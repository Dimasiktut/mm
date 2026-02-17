
import { Category, Product, User, ExcelImportLog, DailyStat, Lead, Role } from '../types';
import { MOCK_CATEGORIES } from '../constants';
import { supabase, isSupabaseConfigured } from './supabase';

class BackendService {
  // --- Auth ---

  // Получить текущую сессию
  async getSession(): Promise<User | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return this.fetchUserProfile(session.user.id, session.user.email || '');
  }

  // Вход
  async login(email: string, password: string): Promise<User> {
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
        // 1. Создаем пользователя в Auth
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
            // Специальная обработка для Rate Limit (429)
            if (error.status === 429 || error.message?.includes('rate limit') || error.code === 'over_email_send_rate_limit') {
                throw new Error("Превышен лимит отправки писем. Пожалуйста, отключите 'Confirm email' в настройках Supabase (Authentication -> Providers -> Email) и попробуйте снова.");
            }
            throw error;
        }

        if (!data.user) throw new Error("Registration failed");

        // 2. Ждем триггер, затем пытаемся получить профиль или создать его вручную
        // Небольшая задержка для триггера
        await new Promise(r => setTimeout(r, 500));

        try {
            return await this.fetchUserProfile(data.user.id, email);
        } catch (e) {
            console.warn("Profile not found after trigger, attempting manual creation...");
            
            // Ручное создание, если триггер не сработал.
            // Работает благодаря Policy FOR INSERT.
            const { error: insertError } = await supabase.from('profiles').insert({
                id: data.user.id,
                email: email,
                name: name,
                role: role,
                company_name: companyName
            });

            if (insertError) {
                console.error("Manual profile insert failed:", insertError);
                if (insertError.code === '42501') {
                    throw new Error("Ошибка доступа к БД. Запустите обновленный 'supabase_setup.sql' для исправления прав.");
                }
                throw insertError;
            }

            return await this.fetchUserProfile(data.user.id, email);
        }

    } catch (err: any) {
        console.error("Registration error:", err);
        // Пробрасываем сообщение пользователю
        throw err;
    }
  }

  // Выход
  async logout(): Promise<void> {
    if (supabase) await supabase.auth.signOut();
  }

  // Вспомогательный метод получения профиля
  private async fetchUserProfile(userId: string, email: string): Promise<User> {
    if (!supabase) throw new Error("No DB");
    
    // Используем maybeSingle() вместо single(), чтобы не получать ошибку PGRST116, если записи нет
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }

    if (!data) {
        // Если профиля нет, выбрасываем ошибку, чтобы вызывающий метод (register) мог запустить fallback
        throw new Error("Profile missing");
    }

    return {
      id: data.id,
      email: data.email || email,
      name: data.name,
      role: (data.role as Role) || 'BUYER',
      companyName: data.company_name,
      inn: data.inn,
      phone: data.phone,
      website: data.website,
      balance: data.balance,
      isBlocked: data.is_blocked,
      rating: data.rating,
      isVerified: data.is_verified,
      yearsOnPlatform: data.years_on_platform,
      region: data.region
    };
  }

  // --- Products ---
  async getProducts(filters?: { categoryId?: string, search?: string, sellerId?: string }): Promise<Product[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    let query = supabase.from('products').select('*').eq('status', 'ACTIVE');
    
    if (filters?.sellerId) {
        // Продавцы видят и неактивные товары
        query = supabase.from('products').select('*').eq('seller_id', filters.sellerId);
    }
    
    if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query;
    
    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

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
        status: p.status,
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
        status: 'ACTIVE'
    };
    
    const { data, error } = await supabase.from('products').insert(dbProduct).select().single();
    
    if (error) throw error;
    
    return {
        ...product,
        id: data.id,
        views: 0,
        createdAt: data.created_at,
        status: 'ACTIVE'
    };
  }

  // --- Import ---
  async processExcelUpload(file: File, sellerId: string): Promise<ExcelImportLog> {
    if (!isSupabaseConfigured() || !supabase) throw new Error("DB not connected");

    // 1. В реальном приложении: Загружаем файл в Storage
    // const { data: fileData, error: fileError } = await supabase.storage.from('imports').upload(...)
    
    // 2. Симулируем создание товаров (В реальности это делает Edge Function)
    const newCount = Math.floor(Math.random() * 5) + 1;
    for(let i=0; i<newCount; i++) {
        await this.createProduct({
            name: `Импорт Excel ${Math.floor(Math.random() * 1000)}`,
            description: 'Автоматический импорт',
            price: 50000,
            stock: 100,
            categoryId: 'c1-1', // Hardcoded for demo
            sellerId: sellerId,
            image: null as any,
            specifications: { 'Источник': 'Excel' },
            tags: ['import'],
            region: 'Москва'
        });
    }

    // 3. Лог
    const { data, error } = await supabase.from('excel_import_logs').insert({
        seller_id: sellerId,
        file_name: file.name,
        status: 'SUCCESS',
        row_count: newCount
    }).select().single();

    if (error) throw error;

    return {
        id: data.id,
        fileName: data.file_name,
        sellerId: data.seller_id,
        status: data.status,
        rowCount: data.row_count,
        createdAt: data.created_at
    };
  }

  // --- Stats ---
  async getSellerStats(sellerId: string): Promise<{ totalProducts: number, topProduct: Product | null, dailyViews: DailyStat[], leads: Lead[] }> {
    if (!isSupabaseConfigured() || !supabase) return { totalProducts: 0, topProduct: null, dailyViews: [], leads: [] };

    // Товары
    const { data: products } = await supabase.from('products').select('*').eq('seller_id', sellerId);
    const mappedProducts = (products || []).map((p:any) => ({ ...p, id: p.id, views: p.views || 0 }));
    
    const topProduct = mappedProducts.sort((a:any, b:any) => b.views - a.views)[0] || null;

    // Лиды
    const { data: leadsData } = await supabase.from('leads').select('*').eq('seller_id', sellerId);
    const leads = (leadsData || []).map((l:any) => ({
         id: l.id,
         date: new Date(l.created_at).toLocaleDateString(),
         productName: l.product_name,
         buyerName: l.buyer_name,
         buyerPhone: l.buyer_phone,
         status: l.status,
         amount: l.amount,
         totalPrice: l.total_price
    }));

    return {
      totalProducts: mappedProducts.length,
      topProduct: topProduct as any,
      dailyViews: [], // Реальная аналитика требует отдельной таблицы events
      leads
    };
  }

  async getLeads(): Promise<Lead[]> {
    if (!supabase) return [];
    const { data } = await supabase.from('leads').select('*');
    return (data || []).map((l:any) => ({
        id: l.id,
        date: new Date(l.created_at).toLocaleDateString(),
        productName: l.product_name,
        buyerName: l.buyer_name,
        buyerPhone: l.buyer_phone,
        status: l.status,
        amount: l.amount,
        totalPrice: l.total_price
   }));
  }

  async getCategories(): Promise<Category[]> {
    if (supabase) {
        const { data } = await supabase.from('categories').select('*');
        if (data && data.length > 0) return data.map((c:any) => ({...c, parentId: c.parent_id}));
    }
    return MOCK_CATEGORIES;
  }
}

export const mockBackend = new BackendService();
