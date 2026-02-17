
export type Role = 'ADMIN' | 'SELLER' | 'BUYER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  isBlocked: boolean;
  companyName?: string;
  rating?: number;
  isVerified?: boolean;
  yearsOnPlatform?: number;
  region?: string;
  balance?: number;
  inn?: string;
  phone?: string;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price per ton
  stock: number; // In tons
  categoryId: string;
  sellerId: string;
  image: string;
  specifications: Record<string, string>; // Dynamic: Diameter, Grade, GOST, Length
  tags: string[];
  views: number;
  createdAt: string;
  status: 'ACTIVE' | 'DRAFT' | 'MODERATION' | 'ARCHIVED';
  region: string;
  gost?: string;
}

export interface ExcelImportLog {
  id: string;
  fileName: string;
  sellerId: string;
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING';
  rowCount: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  date: string;
  productName: string;
  buyerName: string;
  buyerPhone: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';
  amount: number; // Requested amount in tons
  totalPrice?: number;
}

// Chart Data Types
export interface DailyStat {
  date: string;
  views: number;
  orders: number;
}
