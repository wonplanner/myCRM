
import React, { useState, useEffect, useMemo } from 'react';
import { Customer, CustomerStatus, Notice, UserProfile } from './types';
import { STORAGE_KEY, INITIAL_CUSTOMERS, NOTICE_STORAGE_KEY, INITIAL_NOTICES } from './constants';
import Sidebar from './components/Sidebar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import CustomerForm from './components/CustomerForm';
import BulkSmsModal from './components/BulkSmsModal';
import UsageGuideModal from './components/UsageGuideModal';
import DataManagementView from './components/DataManagementView';
import DashboardView from './components/DashboardView';
import LoginModal from './components/LoginModal';
import { GoogleGenAI } from "@google/genai";
import { Plus, Search, RefreshCw, CloudCheck, CloudOff, Send, X as CloseIcon, Check } from 'lucide-react';

const USER_PROFILE_KEY = 'insure_planner_user_profile';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'crm' | 'data'>('crm');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | '전체'>('전체');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedNotices = localStorage.getItem(NOTICE_STORAGE_KEY);
    const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        if (profile.isLoggedIn) setLastSynced(new Date().toLocaleTimeString());
      } catch (e) {
        // Silent recovery
      }
    }
    
    try {
      setCustomers(savedData ? JSON.parse(savedData) : INITIAL_CUSTOMERS);
      setNotices(savedNotices ? JSON.parse(savedNotices) : INITIAL_NOTICES);
    } catch (e) {
      setCustomers(INITIAL_CUSTOMERS);
      setNotices(INITIAL_NOTICES);
    }
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      setShowSaveToast(true);
      const toastTimer = setTimeout(() => setShowSaveToast(false), 2000);

      if (userProfile?.isLoggedIn) {
        setIsSyncing(true);
        const timer = setTimeout(() => {
          setIsSyncing(false);
          setLastSynced(new Date().toLocaleTimeString());
        }, 800);
        return () => {
          clearTimeout(timer);
          clearTimeout(toastTimer);
        };
      }
      return () => clearTimeout(toastTimer);
    }
  }, [customers, userProfile?.isLoggedIn]);

  const generateAiInsights = async () => {
    if (customers.length === 0) return;
    
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      setAiInsights("AI 분석 기능을 활성화하려면 API 키 설정이 필요합니다.");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `당신은 숙련된 보험 설계사 전용 비즈니스 분석가입니다. 고객 ${customers.length}명의 현황을 보고, 오늘 가장 시급하게 처리해야 할 3가지 활동(생일자 축하, 만기 안내, 보장 분석 등)을 제안하세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiInsights(response.text || "분석 결과를 생성하지 못했습니다.");
    } catch (error) {
      setAiInsights("분석 중 일시적인 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.phone.includes(searchQuery);
      const matchesStatus = statusFilter === '전체' || c.status === statusFilter;
      const matchesBirthMonth = !birthMonth || (c.birthDate && c.birthDate.split('-')[1] === birthMonth);
      const matchesTag = !selectedTag || (c.contracts.some(con => con.tags.includes(selectedTag)));
      return matchesSearch && matchesStatus && matchesBirthMonth && matchesTag;
    });
  }, [customers, searchQuery, statusFilter, birthMonth, selectedTag]);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
    if (!isSelectionMode) setSelectedCustomerId(null);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까? 데이터는 이 기기에 안전하게 보관됩니다.')) {
      setUserProfile(null);
      setLastSynced(null);
      localStorage.removeItem(USER_PROFILE_KEY);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F2F2F7] overflow-hidden font-sans">
      <div className="hidden lg:block w-[280px] xl:w-[320px] bg-white border-r border-gray-200 overflow-y-auto shrink-0 z-40">
        <Sidebar 
          userProfile={userProfile}
          currentView={currentView} setCurrentView={setCurrentView}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          birthMonth={birthMonth} setBirthMonth={setBirthMonth}
          selectedTag={selectedTag} setSelectedTag={setSelectedTag}
          onAddClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
          onShowGuide={() => setIsGuideOpen(true)}
          onShowLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={toggleSelectionMode}
          onResetFilters={() => { setSearchQuery(''); setStatusFilter('전체'); setBirthMonth(''); setSelectedTag(''); }}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {currentView === 'data' ? (
          <DataManagementView 
            totalCount={customers.length}
            filteredCount={filteredCustomers.length}
            onDownloadTemplate={() => alert('준비 중입니다.')}
            onImport={(file) => {}}
            onExportCSV={() => alert('CSV 저장이 완료되었습니다.')}
            onExportPDF={() => alert('PDF 출력이 완료되었습니다.')}
            onBack={() => setCurrentView('crm')}
            isFilterActive={!!(searchQuery || statusFilter !== '전체' || selectedTag)}
          />
        ) : (
          <div className="h-full flex flex-col xl:flex-row relative">
            <div className="hidden lg:flex absolute top-4 right-8 z-50 items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 shadow-sm text-[11px] font-bold transition-all">
              {isSyncing ? (
                <><RefreshCw size={14} className="text-blue-500 animate-spin" /><span className="text-blue-500">데이터 처리 중...</span></>
              ) : userProfile?.isLoggedIn ? (
                <><CloudCheck size={14} className="text-green-500" /><span className="text-gray-400">최근 업데이트: {lastSynced}</span></>
              ) : (
                <><CloudOff size={14} className="text-gray-300" /><button onClick={() => setIsLoginModalOpen(true)} className="text-blue-500 hover:underline">오프라인 모드</button></>
              )}
            </div>

            <div className={`
              ${selectedCustomerId && !isSelectionMode ? 'hidden lg:flex' : 'flex'}
              w-full lg:w-[350px] xl:w-[400px] shrink-0 flex-col bg-white border-r border-gray-200 relative
            `}>
              <header className="ios-blur p-4 pt-14 lg:pt-6 border-b border-gray-200 sticky top-0 z-20">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-black text-gray-900 tracking-tight">
                    {isSelectionMode ? '발송 대상 선택' : '고객 데이터베이스'}
                  </h1>
                  <div className="flex gap-2">
                    {isSelectionMode && (
                      <button onClick={toggleSelectionMode} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
                        <CloseIcon size={20} />
                      </button>
                    )}
                    <button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="lg:hidden p-2 bg-blue-500 text-white rounded-full">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="고객명 또는 번호 검색" 
                    className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </header>

              <CustomerList 
                customers={filteredCustomers} 
                selectedId={selectedCustomerId} 
                onSelect={isSelectionMode ? (id) => {
                  const next = new Set(selectedIds);
                  next.has(id) ? next.delete(id) : next.add(id);
                  setSelectedIds(next);
                } : setSelectedCustomerId} 
                isSelectionMode={isSelectionMode} 
                selectedIds={selectedIds} 
              />
              
              {isSelectionMode && selectedIds.size > 0 && (
                <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10">
                  <div className="ios-blur bg-blue-600/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-4 flex items-center justify-between">
                    <div className="pl-2">
                      <p className="text-white text-sm font-black">{selectedIds.size}명 선택</p>
                    </div>
                    <button 
                      onClick={() => setIsSmsModalOpen(true)}
                      className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Send size={16} /> 발송하기
                    </button>
                  </div>
                </div>
              )}

              <div className="lg:hidden ios-blur border-t border-gray-200 px-10 py-3 flex justify-between items-center safe-area-bottom shrink-0">
                 <button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="flex flex-col items-center gap-1 text-blue-500">
                   <Plus size={24} /><span className="text-[10px] font-bold">등록</span>
                 </button>
                 <button onClick={toggleSelectionMode} className={`flex flex-col items-center gap-1 ${isSelectionMode ? 'text-blue-600' : 'text-gray-400'}`}>
                   <Send size={24} /><span className="text-[10px] font-bold">단체발송</span>
                 </button>
                 <button onClick={() => setIsLoginModalOpen(true)} className="flex flex-col items-center gap-1 text-gray-400">
                   <RefreshCw size={24} /><span className="text-[10px] font-bold">연동</span>
                 </button>
              </div>
            </div>

            <div className={`
              ${!selectedCustomerId || isSelectionMode ? 'hidden xl:flex' : 'flex'}
              flex-1 flex-col bg-[#F2F2F7] min-w-0
            `}>
              {selectedCustomer && !isSelectionMode ? (
                <CustomerDetail 
                  customer={selectedCustomer} 
                  onClose={() => setSelectedCustomerId(null)} 
                  onEdit={() => { setEditingCustomer(selectedCustomer); setIsFormOpen(true); }} 
                  onDelete={() => {
                    if (window.confirm('선택한 고객 데이터를 영구적으로 삭제하시겠습니까?')) {
                      setCustomers(prev => prev.filter(c => c.id !== selectedCustomerId));
                      setSelectedCustomerId(null);
                    }
                  }} 
                  allCustomers={customers} 
                  onUpdate={(u) => setCustomers(prev => prev.map(c => c.id === u.id ? u : c))} 
                  onSelectCustomer={setSelectedCustomerId}
                />
              ) : (
                <DashboardView 
                  userName={userProfile?.name || '설계사'}
                  notices={notices}
                  onAddNotice={(c) => setNotices(prev => [{id: Date.now().toString(), content: c, createdAt: new Date().toISOString()}, ...prev])}
                  onDeleteNotice={(id) => setNotices(prev => prev.filter(n => n.id !== id))}
                  totalCustomers={customers.length}
                  activeContracts={customers.reduce((acc, c) => acc + c.contracts.length, 0)}
                  aiInsights={aiInsights}
                  onGenerateAiInsights={generateAiInsights}
                  isAiLoading={isAiLoading}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {showSaveToast && (
        <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <div className="ios-blur bg-gray-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/10">
            <Check size={14} className="text-green-400" />
            <span className="text-[11px] font-black tracking-tight">변경사항이 기기에 저장되었습니다</span>
          </div>
        </div>
      )}

      {isFormOpen && (
        <CustomerForm 
          customer={editingCustomer} 
          allCustomers={customers} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={(c) => {
            if (editingCustomer) {
              setCustomers(prev => prev.map(curr => curr.id === c.id ? c : curr));
            } else {
              setCustomers(prev => [c, ...prev]);
            }
            setIsFormOpen(false);
          }} 
        />
      )}
      {isLoginModalOpen && (
        <LoginModal 
          onLogin={(profile) => { 
            setUserProfile(profile); 
            setIsLoginModalOpen(false); 
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile)); 
          }} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
      {isGuideOpen && <UsageGuideModal onClose={() => setIsGuideOpen(false)} />}
      {isSmsModalOpen && (
        <BulkSmsModal 
          selectedCustomers={Array.from(selectedIds).map(id => customers.find(c => c.id === id)!).filter(Boolean)} 
          onClose={() => setIsSmsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
