
export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
  phoneNumber?: string; // حقل اختياري لرقم الهاتف
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  notes?: string;
  tags?: string[]; // وسوم إضافية (مثل: #سفر، #عيد)
  image?: string; // base64
  createdAt: number;
  serialNumber?: number; // رقم تسلسلي (SRF-1)
  isFavorite?: boolean; // حقل السندات المميزة
}

export interface DraftExpense {
  id: string;
  categoryName: string;
  amount: number;
  notes: string;
  date: string;
}

export interface RecurringReminder {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  dayOfMonth: number;
}

export interface AppSettings {
  showImages: boolean;
  showNotes: boolean;
  lastSerialNumber?: number; // تتبع آخر رقم تسلسلي تم إصداره
  customDownloadPath?: string; // مسار حفظ الملفات المخصص
}

export enum ViewState {
  HOME = 'HOME',
  CATEGORIES = 'CATEGORIES',
  ADD_EXPENSE = 'ADD_EXPENSE',
  EDIT_EXPENSE = 'EDIT_EXPENSE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  CATEGORY_DETAIL = 'CATEGORY_DETAIL',
  EXPENSE_DETAIL = 'EXPENSE_DETAIL'
}
