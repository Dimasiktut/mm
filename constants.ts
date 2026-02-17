
import { Category, Product, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Администратор', email: 'admin@metal.com', role: 'ADMIN', isBlocked: false },
  { 
    id: 'u2', 
    name: 'Алексей Петров', 
    companyName: 'Северсталь Дистрибуция',
    email: 'seller@steel.com', 
    role: 'SELLER', 
    isBlocked: false,
    rating: 4.9,
    isVerified: true,
    yearsOnPlatform: 5,
    region: 'Москва'
  },
  { 
    id: 'u4', 
    name: 'Иван Иванов', 
    companyName: 'УралМеталлСнаб',
    email: 'ural@metal.com', 
    role: 'SELLER', 
    isBlocked: false,
    rating: 4.5,
    isVerified: true,
    yearsOnPlatform: 2,
    region: 'Екатеринбург'
  },
  { id: 'u3', name: 'СтройКомплект', email: 'buyer@build.com', role: 'BUYER', isBlocked: false },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Сортовой прокат', parentId: null, image: 'https://images.unsplash.com/photo-1626284620359-994df7ee1912?auto=format&fit=crop&q=80&w=500' },
  { id: 'c2', name: 'Листовой прокат', parentId: null, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=500' },
  { id: 'c3', name: 'Трубный прокат', parentId: null, image: 'https://images.unsplash.com/photo-1535063406549-defdccf96d18?auto=format&fit=crop&q=80&w=500' },
  { id: 'c4', name: 'Фасонный прокат', parentId: null, image: 'https://images.unsplash.com/photo-1533069151839-44d4c51bb317?auto=format&fit=crop&q=80&w=500' },
  { id: 'c1-1', name: 'Арматура', parentId: 'c1' },
  { id: 'c1-2', name: 'Катанка', parentId: 'c1' },
  { id: 'c2-1', name: 'Лист г/к', parentId: 'c2' },
  { id: 'c2-2', name: 'Лист х/к', parentId: 'c2' },
  { id: 'c3-1', name: 'Труба профильная', parentId: 'c3' },
  { id: 'c4-1', name: 'Балка двутавровая', parentId: 'c4' },
  { id: 'c4-2', name: 'Швеллер', parentId: 'c4' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Арматура А500С 12мм',
    description: 'Арматура рифленая А500С диаметром 12 мм. Используется для армирования железобетонных конструкций.',
    price: 54000,
    stock: 120,
    categoryId: 'c1-1',
    sellerId: 'u2',
    image: 'https://images.unsplash.com/photo-1588612502693-0255bbb8421c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Диаметр': '12 мм', 'Марка стали': 'А500С', 'Длина': '11.7 м' },
    tags: ['арматура', 'стройка', 'фундамент'],
    views: 2100,
    createdAt: '2023-10-12',
    status: 'ACTIVE',
    region: 'Москва',
    gost: 'ГОСТ 5781-82'
  },
  {
    id: 'p2',
    name: 'Лист г/к 10мм Ст3сп5',
    description: 'Лист горячекатаный стальной толщиной 10мм. Применяется в строительстве и машиностроении.',
    price: 68500,
    stock: 45,
    categoryId: 'c2-1',
    sellerId: 'u2',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Толщина': '10 мм', 'Марка стали': 'Ст3сп5', 'Раскрой': '1500х6000' },
    tags: ['лист', 'сталь'],
    views: 850,
    createdAt: '2023-10-05',
    status: 'ACTIVE',
    region: 'Москва',
    gost: 'ГОСТ 19903-2015'
  },
  {
    id: 'p3',
    name: 'Труба профильная 80x80x4',
    description: 'Квадратная стальная труба для металлоконструкций.',
    price: 72000,
    stock: 200,
    categoryId: 'c3-1',
    sellerId: 'u4',
    image: 'https://images.unsplash.com/photo-1535063406549-defdccf96d18?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Размер': '80x80 мм', 'Стенка': '4 мм', 'Марка стали': 'Ст3пс' },
    tags: ['труба', 'профиль'],
    views: 1240,
    createdAt: '2023-10-01',
    status: 'ACTIVE',
    region: 'Екатеринбург',
    gost: 'ГОСТ 8639-82'
  },
  {
    id: 'p4',
    name: 'Балка двутавровая 20Б1',
    description: 'Двутавр с параллельными гранями полок.',
    price: 89000,
    stock: 15,
    categoryId: 'c4-1',
    sellerId: 'u4',
    image: 'https://images.unsplash.com/photo-1533069151839-44d4c51bb317?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Номер': '20Б1', 'Марка стали': 'Ст3сп5' },
    tags: ['балка', 'двутавр'],
    views: 540,
    createdAt: '2023-10-15',
    status: 'ACTIVE',
    region: 'Екатеринбург',
    gost: 'ГОСТ 26020-83'
  },
  {
    id: 'p5',
    name: 'Арматура А240 8мм',
    description: 'Гладкая арматура (катанка) для монтажных работ.',
    price: 51000,
    stock: 300,
    categoryId: 'c1-1',
    sellerId: 'u2',
    image: 'https://images.unsplash.com/photo-1588612502693-0255bbb8421c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Диаметр': '8 мм', 'Марка стали': 'А240', 'Бухта': 'Да' },
    tags: ['арматура', 'гладкая'],
    views: 1500,
    createdAt: '2023-11-01',
    status: 'ACTIVE',
    region: 'Москва',
    gost: 'ГОСТ 5781-82'
  }
];

export const PRISMA_SCHEMA_PREVIEW = `
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  BUYER
  SELLER
  ADMIN
}

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  password        String
  role            Role     @default(BUYER)
  companyName     String?
  region          String?
  rating          Float    @default(0)
  isVerified      Boolean  @default(false)
  products        Product[]
  imports         ExcelImportLog[]
  createdAt       DateTime @default(now())
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Decimal
  stock       Int
  views       Int      @default(0)
  image       String?
  region      String?
  gost        String?
  
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  
  seller      User     @relation(fields: [sellerId], references: [id])
  sellerId    String

  specs       Json     // {"Диаметр": "12мм", "Марка": "А500С"}
  tags        Tag[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id        String     @id @default(uuid())
  name      String
  parentId  String?
  image     String?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  products  Product[]
}

model Tag {
  id       String    @id @default(uuid())
  name     String    @unique
  products Product[]
}

model ExcelImportLog {
  id        String   @id @default(uuid())
  status    String
  rowCount  Int
  seller    User     @relation(fields: [sellerId], references: [id])
  sellerId  String
  createdAt DateTime @default(now())
}
`;
