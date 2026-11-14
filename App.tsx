
import React, { useState, useEffect } from 'react';
import { db, initializeDb } from './db';
import { ViewState, Category, Expense, AppSettings } from './types';
import { Plus, Home, PieChart, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

import HomeView from './components/HomeView';
import CategoriesView from './components/CategoriesView';
import AddExpenseView from './components/AddExpenseView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import CategoryDetailView from './components/CategoryDetailView';
import ExpenseDetailView from './components/ExpenseDetailView';
import SplashScreen from './components/SplashScreen';
import IntroScreen from './components/IntroScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const startTime = Date.now();
      
      await initializeDb();
      const s = await db.settings.get('app_settings');
      if (s) setSettings(s);
      setInitialized(true);

      const elapsedTime = Date.now() - startTime;
      const minSplashTime = 2500; 
      const remainingTime = Math.max(0, minSplashTime - elapsedTime);
      
      setTimeout(() => {
        setShowSplash(false);
        setShowIntro(true); 
        
        setTimeout(() => {
          setShowIntro(false);
        }, 2200);
        
      }, remainingTime);
    };
    init();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  if (showSplash) return <SplashScreen />;
  
  if (!initialized || !settings) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-bold">
      جاري تحميل صرف...
    </div>
  );

  const handleExpenseSelect = (exp: Expense) => {
    setSelectedExpense(exp);
    setCurrentView(ViewState.EXPENSE_DETAIL);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeView onExpenseSelect={handleExpenseSelect} />;
      case ViewState.CATEGORIES:
        return <CategoriesView onCategorySelect={(cat) => { setSelectedCategory(cat); setCurrentView(ViewState.CATEGORY_DETAIL); }} />;
      case ViewState.ADD_EXPENSE:
        return <AddExpenseView onClose={() => { setEditingExpense(null); setCurrentView(selectedCategory ? ViewState.CATEGORY_DETAIL : ViewState.HOME); }} initialData={editingExpense} preselectedCategoryId={selectedCategory?.id} />;
      case ViewState.REPORTS:
        return <ReportsView onExpenseSelect={handleExpenseSelect} />;
      case ViewState.SETTINGS:
        return <SettingsView onUpdateSettings={setSettings} installPrompt={deferredPrompt} onInstallSuccess={() => setDeferredPrompt(null)} onExpenseSelect={handleExpenseSelect} />;
      case ViewState.CATEGORY_DETAIL:
        return selectedCategory ? <CategoryDetailView category={selectedCategory} onBack={() => { setSelectedCategory(null); setCurrentView(ViewState.CATEGORIES); }} onExpenseSelect={handleExpenseSelect} onAddExpense={() => { setEditingExpense(null); setCurrentView(ViewState.ADD_EXPENSE); }} /> : null;
      case ViewState.EXPENSE_DETAIL:
        return selectedExpense ? <ExpenseDetailView expense={selectedExpense} onBack={() => setCurrentView(selectedCategory ? ViewState.CATEGORY_DETAIL : ViewState.HOME)} onEdit={(exp) => { setEditingExpense(exp); setCurrentView(ViewState.ADD_EXPENSE); }} /> : null;
      default:
        return <HomeView onExpenseSelect={handleExpenseSelect} />;
    }
  };

  return (
    <>
      {showIntro && <IntroScreen />}

      <div className={`h-screen max-w-md mx-auto bg-slate-950 text-slate-100 flex flex-col relative shadow-2xl overflow-hidden transition-all duration-1000 ease-in-out ${showIntro ? 'blur-xl scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
        <header className="flex-none p-4 flex justify-center items-center border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-l from-blue-400 to-blue-600 bg-clip-text text-transparent">صرف</h1>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">ص</div>
          </div>
        </header>

        <main className="flex-grow p-4 overflow-y-auto overflow-x-hidden pb-32 no-scrollbar">
          {renderView()}
        </main>

        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
          <nav className="w-full max-w-[calc(100%-1rem)] md:max-w-[400px] pointer-events-auto bg-slate-900/60 backdrop-blur-2xl border border-white/10 flex justify-around items-center p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
            
            <button 
              onClick={() => { setSelectedCategory(null); setCurrentView(ViewState.HOME); }} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 py-1 flex-1 ${currentView === ViewState.HOME ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Home size={20} /><span className="text-[9px] font-black">الرئيسية</span>
            </button>

            <button 
              onClick={() => { setSelectedCategory(null); setCurrentView(ViewState.CATEGORIES); }} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 py-1 flex-1 ${currentView === ViewState.CATEGORIES || currentView === ViewState.CATEGORY_DETAIL ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={20} /><span className="text-[9px] font-black">الأقسام</span>
            </button>

            <div className="relative -mt-10 px-2">
              <button 
                onClick={() => { setEditingExpense(null); setCurrentView(ViewState.ADD_EXPENSE); }} 
                className="bg-blue-600 p-4 rounded-full shadow-[0_10px_25px_rgba(37,99,235,0.4)] text-white active:scale-90 transition-all ring-4 ring-slate-950 flex items-center justify-center group"
              >
                <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <button 
              onClick={() => setCurrentView(ViewState.REPORTS)} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 py-1 flex-1 ${currentView === ViewState.REPORTS ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <PieChart size={20} /><span className="text-[9px] font-black">التقارير</span>
            </button>

            <button 
              onClick={() => setCurrentView(ViewState.SETTINGS)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 py-1 flex-1 ${currentView === ViewState.SETTINGS ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <SettingsIcon size={20} /><span className="text-[9px] font-black">الضبط</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default App;
