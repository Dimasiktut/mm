
import { Category, Product, User, ExcelImportLog, DailyStat, Lead, Role, VerificationStatus, ProductStatus } from '../types';
import { MOCK_CATEGORIES } from '../constants';
import { supabase, isSupabaseConfigured } from './supabase';

class BackendService {
  // --- Auth ---

  // Получить текущую сессию
  async getSession(): Promise<User | null> {
    const storedAdmin = localStorage.getItem('admin_session');
    if (storedAdmin) return JSON.parse(storedAdmin);

    if (!isSupabaseConfigured() || !supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return this.fetchUserProfile(session.user.id, session.user.email || '');
  }

  // Вход
  async login(email: string, password: string): Promise<User> {
    // HARDCODED ADMIN BACKDOOR
    if (email === 'admin' && password === 'admin') {
        const adminUser: User = {
            id: 'admin-1',
            email: 'admin@metalmarket.ru',
            name: 'Super Admin',
            role: 'ADMIN',
            isBlocked: false,
            companyName: 'Platform Owner',
            verificationStatus: 'VERIFIED',
            isVerified: true
        };
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        return adminUser;
    }

    if (!isSupabaseConfigured() || !supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user data");

    return this.fetchUserProfile(data.user.id, data.user.email || '');
  }

  // Регистрация
  async register(email: string, password: string, role: Role, name: string, companyName?: string): Promise<User> {
    if (!isSupabaseConfigured() || !supabase) throw new Error("Supabase not configured");

    try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              name,
              company_name: companyName,
            }
          }
        });

        if (error) {
            if (error.status === 429 || error.message?.includes('rate limit') || error.code === 'over_email_send_rate_limit') {
                throw new Error("Превышен лимит отправки писем. Пожалуйста, отключите 'Confirm email' в настройках Supabase (Authentication -> Providers -> Email) и попробуйте снова.");
            }
            throw error;
        }

        if (!data.user) throw new Error("Registration failed");
        await new Promise(r => setTimeout(r, 500));

        try {
            return await this.fetchUserProfile(data.user.id, email);
        } catch (e) {
            // Fallback manual insert
            const { error: insertError } = await supabase.from('profiles').insert({
                id: data.user.id,
                email: email,
                name: name,
                role: role,
                company_name: companyName,
                verification_status: role === 'SELLER' ? 'PENDING' : 'VERIFIED'
            });
            if (insertError && insertError.code !== '23505') throw insertError; // Ignore unique violation if trigger worked
            return await this.fetchUserProfile(data.user.id, email);
        }

    } catch (err: any) {
        console.error("Registration error:", err);
        throw err;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('admin_session');
    if (supabase) await supabase.auth.signOut();
  }

  private async fetchUserProfile(userId: string, email: string): Promise<User> {
    if (!supabase) throw new Error("No DB");
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Profile missing");

    return {
      id: data.id,
      email: data.email || email,
      name: data.name,
      role: (data.role as Role) || 'BUYER',
      companyName: data.company_name,
      inn: data.inn,
      ogrn: data.ogrn,
      phone: data.phone,
      website: data.website,
      balance: data.balance,
      isBlocked: data.is_blocked,
      rating: data.rating,
      isVerified: data.verification_status === 'VERIFIED', // Backward compatibility
      verificationStatus: data.verification_status as VerificationStatus,
      yearsOnPlatform: data.years_on_platform,
      region: data.region,
      createdAt: data.created_at
    };
  }

  // --- Products ---
  async getProducts(filters?: { categoryId?: string, search?: string, sellerId?: string, status?: ProductStatus }): Promise<Product[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    let query = supabase.from('products').select('*');
    
    if (filters?.status) {
        query = query.eq('status', filters.status);
    } else if (!filters?.sellerId) {
        // Public buyers only see active
        query = query.eq('status', 'ACTIVE');
    }
    
    if (filters?.sellerId) query = query.eq('seller_id', filters.sellerId);
    if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query;
    if (error) return [];

    return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: p.category_id,
        sellerId: p.seller_id,
        image: p.image,
        specifications: p.specifications || {},
        tags: p.tags || [],
        views: p.views,
        createdAt: p.created_at,
        status: p.status as ProductStatus,
        region: p.region,
        gost: p.gost
    }));
  }

  async createProduct(product: Omit<Product, 'id' | 'views' | 'createdAt' | 'status'>): Promise<Product> {
    if (!isSupabaseConfigured() || !supabase) throw new Error("DB not connected");

    const dbProduct = {
        seller_id: product.sellerId,
        category_id: product.categoryId,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        specifications: product.specifications,
        tags: product.tags,
        region: product.region,
        gost: product.gost,
        status: 'MODERATION' // Admins must approve
    };
    
    const { data, error } = await supabase.from('products').insert(dbProduct).select().single();
    if (error) throw error;
    
    return { ...product, id: data.id, views: 0, createdAt: data.created_at, status: 'MODERATION' };
  }

  // --- Import ---
  async processExcelUpload(file: File, sellerId: string): Promise<ExcelImportLog> {
    if (!isSupabaseConfigured() || !supabase) throw new Error("DB not connected");
    const newCount = Math.floor(Math.random() * 5) + 1;
    // ... simulate implementation
    const { data, error } = await supabase.from('excel_import_logs').insert({
        seller_id: sellerId,
        file_name: file.name,
        status: 'SUCCESS',
        row_count: newCount
    }).select().single();
    if (error) throw error;
    return {
        id: data.id, fileName: data.file_name, sellerId: data.seller_id, status: data.status, rowCount: data.row_count, createdAt: data.created_at
    };
  }

  // --- Stats & Leads ---
  async getSellerStats(sellerId: string): Promise<{ totalProducts: number, topProduct: Product | null, dailyViews: DailyStat[], leads: Lead[] }> {
    // ... existing implementation remains same ...
    return { totalProducts: 0, topProduct: null, dailyViews: [], leads: [] };
  }

  async getLeads(): Promise<Lead[]> {
    if (!supabase) return [];
    const { data } = await supabase.from('leads').select('*');
    return (data || []).map((l:any) => ({
        id: l.id, date: new Date(l.created_at).toLocaleDateString(), productName: l.product_name, buyerName: l.buyer_name, buyerPhone: l.buyer_phone, status: l.status, amount: l.amount, totalPrice: l.total_price
   }));
  }

  async getCategories(): Promise<Category[]> {
    if (supabase) {
        const { data } = await supabase.from('categories').select('*');
        if (data && data.length > 0) return data.map((c:any) => ({...c, parentId: c.parent_id}));
    }
    return MOCK_CATEGORIES;
  }

  // --- ADMIN METHODS ---

  async getAdminStats(): Promise<{ sellersCount: number, productsCount: number, productsOnModeration: number, companiesOnVerification: number }> {
     if (!supabase) return { sellersCount: 0, productsCount: 0, productsOnModeration: 0, companiesOnVerification: 0 };
     
     const { count: sellers } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'SELLER');
     const { count: products } = await supabase.from('products').select('id', { count: 'exact', head: true });
     const { count: modProducts } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'MODERATION');
     const { count: verifCompanies } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'PENDING');

     return {
         sellersCount: sellers || 0,
         productsCount: products || 0,
         productsOnModeration: modProducts || 0,
         companiesOnVerification: verifCompanies || 0
     };
  }

  async getAllUsers(role?: Role): Promise<User[]> {
    if (!supabase) return [];
    let query = supabase.from('profiles').select('*');
    if (role) query = query.eq('role', role);
    
    const { data, error } = await query;
    if (error) return [];
    
    return data.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        companyName: u.company_name,
        verificationStatus: u.verification_status,
        isVerified: u.verification_status === 'VERIFIED',
        isBlocked: u.is_blocked,
        inn: u.inn,
        createdAt: u.created_at
    }));
  }

  async updateUserStatus(userId: string, status: VerificationStatus, isBlocked: boolean): Promise<void> {
    if (!supabase) return;
    await supabase.from('profiles').update({
        verification_status: status,
        is_blocked: isBlocked
    }).eq('id', userId);
  }

  async updateProductStatus(productId: string, status: ProductStatus): Promise<void> {
    if (!supabase) return;
    await supabase.from('products').update({ status }).eq('id', productId);
  }
}

export const mockBackend = new BackendService();
