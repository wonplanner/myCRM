
import React, { useState } from 'react';
import { 
  Search, UserPlus, Calendar, Tag, ChevronDown, ChevronUp, 
  HelpCircle, UserCircle, Database, Users, LogIn, Cloud, LogOut, ShieldCheck, Filter
} from 'lucide-react';
import { CustomerStatus, UserProfile } from '../types';

interface SidebarProps {
  userProfile: UserProfile | null;
  currentView: 'crm' | 'data';
  setCurrentView: (v: 'crm' | 'data') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: CustomerStatus | '전체';
  setStatusFilter: (s: CustomerStatus | '전체') => void;
  birthMonth: string;
  setBirthMonth: (m: string) => void;
  selectedTag: string;
  setSelectedTag: (t: string) => void;
  onAddClick: () => void;
  onShowGuide: () => void;
  onShowLogin: () => void;
  onLogout: () => void;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onResetFilters: () => void;
}

const PREDEFINED_TAGS = ['종합', '암', '운전자', '태아', '실손', '생명', '치아', '화재', '연금'];
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const Sidebar: React.FC<SidebarProps> = ({ 
  userProfile, currentView, setCurrentView,
  searchQuery, setSearchQuery, statusFilter, setStatusFilter, 
  birthMonth, setBirthMonth, selectedTag, setSelectedTag, onAddClick, onShowGuide, 
  onShowLogin, onLogout, isSelectionMode, onToggleSelectionMode, onResetFilters
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getStatusBtnClass = (status: string) => {
    const base = "px-3 py-2.5 rounded-xl text-[11px] font-black transition-all border";
    if (statusFilter === status) {
      switch (status) {
        case '유지': return `${base} bg-green-50 text-green-600 border-green-200 shadow-sm`;
        case '해지': return `${base} bg-red-50 text-red-600 border-red-200 shadow-sm`;
        case '잠재': return `${base} bg-blue-50 text-blue-600 border-blue-200 shadow-sm`;
        default: return `${base} bg-blue-50 text-blue-600 border-blue-100 shadow-sm`;
      }
    }
    return `${base} bg-white border-gray-100 text-gray-400 hover:border-gray-200`;
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* 계정 정보 카드 */}
      <div className="mb-8">
        <div className="group relative flex items-center gap-3 p-3 bg-gray-50 rounded-[28px] border border-gray-100 transition-all hover:bg-gray-100/50">
          <div className={`w-12 h-12 ${userProfile?.isLoggedIn ? 'bg-blue-600' : 'bg-gray-200'} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10 transition-all`}>
            {userProfile?.isLoggedIn ? <Cloud size={24} /> : <UserCircle size={24} className="text-gray-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-black text-gray-900 truncate">
              {userProfile?.isLoggedIn ? userProfile.name : '설계사 미로그인'}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 truncate">
              {userProfile?.isLoggedIn ? userProfile.email : '로그인 시 PC 연동 가능'}
            </p>
          </div>
          {userProfile?.isLoggedIn && (
            <button 
              onClick={onLogout}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {!userProfile?.isLoggedIn && (
          <button 
            onClick={onShowLogin}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black active:scale-95 transition-all"
          >
            <LogIn size={14} /> 실시간 클라우드 연동 시작
          </button>
        )}
      </div>

      <nav className="mb-8 space-y-1.5">
        <button 
          onClick={() => setCurrentView('crm')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${currentView === 'crm' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Users size={18} /> 고객 데이터베이스
        </button>
        <button 
          onClick={() => setCurrentView('data')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${currentView === 'data' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Database size={18} /> 백업 및 데이터 센터
        </button>
      </nav>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">고객 빠른 검색</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="이름 또는 전화번호" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-10 pr-4 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-xs font-bold" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center px-1 mb-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">관리 상태 필터</label>
            <Filter size={12} className="text-gray-300" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['전체', ...Object.values(CustomerStatus)].map(status => (
              <button 
                key={status} 
                onClick={() => setStatusFilter(status as any)} 
                className={getStatusBtnClass(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex justify-between items-center px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            상세 필터 및 태그 {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showAdvanced && (
            <div className="space-y-5 animate-in slide-in-from-top-2">
              <div>
                <label className="text-[9px] font-black text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-widest"><Calendar size={10} /> 생일 해당 월</label>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-3 text-[11px] font-bold outline-none">
                  <option value="">전체 월</option>
                  {MONTHS.map(m => <option key={m} value={m}>{parseInt(m)}월</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-widest"><Tag size={10} /> 가입 상품 태그</label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_TAGS.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} 
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedTag === tag ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={onResetFilters} className="w-full py-2.5 text-[10px] font-black text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">필터 초기화</button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2.5">
          <button 
            onClick={onAddClick} 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[22px] font-black text-sm transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
          >
            <UserPlus size={18} /> 신규 고객 등록
          </button>
          <button 
            onClick={onToggleSelectionMode} 
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-[22px] font-black text-xs transition-all active:scale-[0.98] ${isSelectionMode ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {isSelectionMode ? '선택 해제' : '단체 메시지 발송'}
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button onClick={onShowGuide} className="w-full mb-4 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 hover:text-blue-500 transition-all">
          <HelpCircle size={14} /> 인슈어플래너 가이드
        </button>
        <div className="text-center">
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] leading-relaxed">
            Insure Planner CRM Cloud <br/> Device Sync Active v2.5
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
