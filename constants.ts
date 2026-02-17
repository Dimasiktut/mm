
import { Category, Product, User } from './types';

// Данные теперь загружаются из Supabase
export const MOCK_USERS: User[] = [];
export const MOCK_PRODUCTS: Product[] = [];

// Категории можно оставить как статику для UI, или тоже загружать из БД.
// Для старта оставим базовое дерево категорий, чтобы каталог не был пустым визуально,
// пока вы не создадите категории в БД.
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

export const PRISMA_SCHEMA_PREVIEW = `
// schema.prisma (Reference)
// ... (оставлено для справки в админке)
`;
