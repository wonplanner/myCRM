
import React, { useState, useEffect } from 'react';
import { Notice } from '../types';
import { 
  BellRing, Megaphone, Plus, Trash2, Calendar, 
  Users, FileText, CheckCircle2, ChevronRight, Settings, Edit3, X, Sparkles, Wand2, Loader2
} from 'lucide-react';

interface DashboardViewProps {
  userName: string;
  notices: Notice[];
  onAddNotice: (content: string) => void;
  onDeleteNotice: (id: string) => void;
  totalCustomers: number;
  activeContracts: number;
  aiInsights: string | null;
  onGenerateAiInsights: () => void;
  isAiLoading: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  userName, notices, onAddNotice, onDeleteNotice, totalCustomers, activeContracts,
  aiInsights, onGenerateAiInsights, isAiLoading
}) => {
  const [showNoticeEditor, setShowNoticeEditor] = useState(false);
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [currentNoticeIdx, setCurrentNoticeIdx] = useState(0);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNoticeIdx(prev => (prev + 1) % notices.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [notices]);

  const handleAdd = () => {
    if (!newNoticeContent.trim()) return;
    onAddNotice(newNoticeContent);
    setNewNoticeContent('');
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
  });

  const activeNotice = notices.length > 0 ? notices[currentNoticeIdx] : null;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">{dateString}</p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
          반가워요, <span className="text-blue-600">{userName}</span> 설계사님!
        </h2>
        <p className="text-gray-500 font-medium">오늘도 고객님의 가치를 지키는 보람찬 하루 되세요.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-indigo-100 relative overflow-hidden group h-full flex flex-col">
          <div className="absolute top-0 right-0 p-6 opacity-5 -mr-4 -mt-4">
             <Sparkles size={120} className="text-indigo-600" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Wand2 size={14} /> AI 비즈니스 인사이트
            </span>
            <button 
              disabled={isAiLoading}
              onClick={onGenerateAiInsights}
              className="text-indigo-500 hover:text-indigo-700 transition-colors disabled:opacity-50"
            >
              <Loader2 size={20} className={isAiLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex-1">
            {isAiLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
              </div>
            ) : aiInsights ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aiInsights}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
                   실시간 데이터 기반 자동 업데이트됨
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 mb-4">전체 고객 데이터를 분석하여<br/>최적화된 상담 리스트를 생성할까요?</p>
                <button 
                  onClick={onGenerateAiInsights}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  AI 분석 보고서 생성
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] shadow-2xl shadow-blue-500/20 text-white overflow-hidden h-full flex flex-col justify-between">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Megaphone size={14} /> 개인 업무 리마인더
              </span>
              <button 
                onClick={() => setShowNoticeEditor(true)}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <Settings size={20} />
              </button>
            </div>

            <div className="min-h-[80px] flex items-center">
              {activeNotice ? (
                <p className="text-xl md:text-2xl font-bold leading-relaxed animate-in slide-in-from-bottom-2 duration-500">
                  "{activeNotice.content}"
                </p>
              ) : (
                <p className="text-lg font-medium opacity-60 italic">
                  기억해야 할 중요한 일정을 등록해 보세요.
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            {notices.length > 1 && (
              <div className="flex gap-1.5 pt-2">
                {notices.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentNoticeIdx ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}></div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Users} label="전체 관리 고객" value={`${totalCustomers}명`} color="bg-blue-50 text-blue-600" />
        <StatCard icon={FileText} label="유지 계약 건수" value={`${activeContracts}건`} color="bg-indigo-50 text-indigo-600" />
        <StatCard icon={CheckCircle2} label="신규 체결율" value="82.4%" color="bg-green-50 text-green-600" />
      </section>

      <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
          <Calendar size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-900">본격적인 업무를 시작해볼까요?</h3>
          <p className="text-sm text-gray-500 mt-1">왼쪽 리스트에서 고객을 선택하거나 검색하여 상세 정보를 관리할 수 있습니다.</p>
        </div>
        <div className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold flex items-center gap-2">
          고객 데이터 보기 <ChevronRight size={16} />
        </div>
      </section>

      {showNoticeEditor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">리마인더 설정</h3>
              <button onClick={() => setShowNoticeEditor(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="새로운 리마인더 내용을 입력하세요..."
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-5 rounded-2xl font-bold active:scale-95 transition-all"><Plus size={20} /></button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {notices.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 text-sm">메시지가 비어 있습니다.</p>
                ) : (
                  notices.map(notice => (
                    <div key={notice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                      <p className="text-sm font-medium text-gray-700 flex-1 pr-4">{notice.content}</p>
                      <button onClick={() => onDeleteNotice(notice.id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
              <button onClick={() => setShowNoticeEditor(false)} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl">완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export default DashboardView;
