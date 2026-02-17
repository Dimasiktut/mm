
import { Category, Product, User, ExcelImportLog, DailyStat, Lead } from '../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_USERS } from '../constants';

// Simulating a backend service with local state
class MockBackendService {
  private users: User[] = [...MOCK_USERS];
  private products: Product[] = [...MOCK_PRODUCTS];
  private categories: Category[] = [...MOCK_CATEGORIES];
  private importLogs: ExcelImportLog[] = [];
  private leads: Lead[] = [
    { id: 'l1', date: '2023-10-25', productName: 'Арматура А500С 12мм', buyerName: 'ООО СтройТрест', buyerPhone: '+7 (999) 111-22-33', status: 'NEW', amount: 20, totalPrice: 1080000 },
    { id: 'l2', date: '2023-10-24', productName: 'Лист г/к 10мм Ст3сп5', buyerName: 'ИП Петров', buyerPhone: '+7 (912) 345-67-89', status: 'IN_PROGRESS', amount: 5, totalPrice: 342500 },
    { id: 'l3', date: '2023-10-23', productName: 'Труба профильная 80x80x4', buyerName: 'АО МеталлГрупп', buyerPhone: '+7 (495) 555-00-00', status: 'DONE', amount: 10, totalPrice: 720000 },
    { id: 'l4', date: '2023-10-22', productName: 'Арматура А500С 12мм', buyerName: 'Застройщик-М', buyerPhone: '+7 (900) 000-00-01', status: 'NEW', amount: 100, totalPrice: 5400000 },
  ];

  // --- Auth & User ---
  async login(role: string): Promise<User> {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    const user = this.users.find(u => u.role === role);
    if (!user) throw new Error('User not found');
    // Add mock balance if seller
    if(role === 'SELLER') {
        user.balance = 125000;
        user.inn = '7701234567';
        user.website = 'https://mysite.ru';
        user.phone = '+7 (800) 200-00-00';
    }
    return user;
  }

  // --- Products ---
  async getProducts(filters?: { categoryId?: string, search?: string, sellerId?: string }): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 300));
    let res = this.products;

    if (filters?.sellerId) {
      res = res.filter(p => p.sellerId === filters.sellerId);
    }
    if (filters?.categoryId) {
      // Simple filter, in real app would need recursive check for child categories
      res = res.filter(p => p.categoryId === filters.categoryId || this.getChildCategoryIds(filters.categoryId).includes(p.categoryId));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      res = res.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        Object.values(p.specifications).some(val => val.toLowerCase().includes(q))
      );
    }
    return res;
  }

  private getChildCategoryIds(parentId: string): string[] {
    const children = this.categories.filter(c => c.parentId === parentId);
    let ids = children.map(c => c.id);
    children.forEach(c => {
      ids = [...ids, ...this.getChildCategoryIds(c.id)];
    });
    return ids;
  }

  async createProduct(product: Omit<Product, 'id' | 'views' | 'createdAt' | 'status'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      views: 0,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async processExcelUpload(file: File, sellerId: string): Promise<ExcelImportLog> {
    await new Promise(r => setTimeout(r, 1500)); // Simulate processing
    
    // Simulate adding random products from "Excel"
    const newCount = Math.floor(Math.random() * 5) + 2;
    for(let i=0; i<newCount; i++) {
        await this.createProduct({
            name: `Imported Item ${Math.floor(Math.random() * 1000)}`,
            description: 'Imported via Excel bulk upload',
            price: Math.floor(Math.random() * 5000) + 1000,
            stock: 100,
            categoryId: 'c1-1',
            sellerId: sellerId,
            image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
            specifications: { 'Source': 'Excel' },
            tags: ['imported'],
            region: 'Москва'
        });
    }

    const log: ExcelImportLog = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      sellerId,
      status: 'SUCCESS',
      rowCount: newCount,
      createdAt: new Date().toISOString()
    };
    this.importLogs.unshift(log);
    return log;
  }

  async getImportLogs(sellerId: string): Promise<ExcelImportLog[]> {
      return this.importLogs.filter(l => l.sellerId === sellerId);
  }

  // --- Stats & Seller Data ---
  async getSellerStats(sellerId: string): Promise<{ totalProducts: number, topProduct: Product | null, dailyViews: DailyStat[], leads: Lead[] }> {
    const sellerProducts = this.products.filter(p => p.sellerId === sellerId);
    const topProduct = [...sellerProducts].sort((a,b) => b.views - a.views)[0] || null;
    
    // Mock daily stats
    const dailyViews = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6-i) * 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      views: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 10)
    }));

    return {
      totalProducts: sellerProducts.length,
      topProduct,
      dailyViews,
      leads: this.leads
    };
  }

  async getLeads(): Promise<Lead[]> {
      await new Promise(r => setTimeout(r, 300));
      return this.leads;
  }

  // --- Admin ---
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getPlatformStats(): Promise<any> {
      return {
          totalUsers: this.users.length,
          totalProducts: this.products.length,
          totalVolume: '$1.2M'
      }
  }
}

export const mockBackend = new MockBackendService();
