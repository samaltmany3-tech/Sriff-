
import Dexie, { type Table } from 'dexie';
import { Category, Expense, AppSettings, RecurringReminder, DraftExpense } from './types';

// Define the database class extending Dexie
export class SarfDB extends Dexie {
  categories!: Table<Category>;
  expenses!: Table<Expense>;
  settings!: Table<AppSettings>;
  reminders!: Table<RecurringReminder>;
  drafts!: Table<DraftExpense>;
  trash!: Table<Expense>; // جدول سلة المهملات

  constructor() {
    super('SarfDB');
    // Version 7 adds multi-entry index for tags
    (this as Dexie).version(7).stores({
      categories: 'id, name, order',
      expenses: 'id, categoryId, date, createdAt, isFavorite, *tags',
      settings: '',
      reminders: 'id, categoryId, dayOfMonth',
      drafts: 'id, categoryName',
      trash: 'id, categoryId, date, createdAt'
    });
  }
}

export const db = new SarfDB();

export async function initializeDb() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.add({
      id: 'default_general',
      name: 'عام',
      color: '#3b82f6',
      order: 0,
      isDefault: true
    });
  }

  const settingsDoc = await db.settings.get('app_settings');
  if (!settingsDoc) {
    await db.settings.put({
      showImages: true,
      showNotes: true,
      lastSerialNumber: 0, // البداية من الصفر
      customDownloadPath: '/storage/emulated/0/Download/eslam'
    }, 'app_settings');
  } else {
    const updates: any = {};
    if (settingsDoc.lastSerialNumber === undefined) updates.lastSerialNumber = 0;
    if (settingsDoc.customDownloadPath === undefined) updates.customDownloadPath = '/storage/emulated/0/Download/eslam';
    
    if (Object.keys(updates).length > 0) {
      await db.settings.update('app_settings', updates);
    }
  }
}
