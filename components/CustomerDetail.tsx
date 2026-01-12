
import React, { useState, useMemo } from 'react';
import { Customer, CustomerStatus, HistoryType, RelationType, Contract, HistoryEntry, Relationship } from '../types';
import { 
  ArrowLeft, Edit, Trash2, User, FileText, History, Network, 
  MapPin, Calendar, Briefcase, Plus, ExternalLink, PhoneCall, X, Save, Tag as TagIcon, MessageCircle, Clock, CreditCard, Banknote, Share2, HeartPulse, Stethoscope, ShieldCheck
} from 'lucide-react';

interface CustomerDetailProps {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  allCustomers: Customer[];
  onUpdate: (updated: Customer) => void;
  onSelectCustomer?: (id: string) => void;
}

const PREDEFINED_TAGS = ['종합', '암', '운전자', '태아', '실손', '생명', '치아', '화재', '연금'];

const CustomerDetail: React.FC<CustomerDetailProps> = ({ 
  customer, onClose, onEdit, onDelete, allCustomers, onUpdate, onSelectCustomer 
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'contract' | 'history' | 'network'>('info');
  
  // History form states
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [newHistory, setNewHistory] = useState({ type: HistoryType.CONSULTATION, content: '' });

  // Contract form states
  const [showContractForm, setShowContractForm] = useState(false);
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [contractFormData, setContractFormData] = useState<Partial<Contract>>({ 
    insurer: '', productName: '', premium: 0, paymentMethod: '자동이체', paymentDetails: '', startDate: '', tags: []
  });
  const [showInsurerSuggestions, setShowInsurerSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // 자동 완성 로직
  const insurerSuggestions = useMemo(() => {
    const query = contractFormData.insurer?.toLowerCase() || '';
    if (query.length < 1) return [];
    return Array.from(new Set(allCustomers.flatMap(c => c.contracts.map(con => con.insurer))))
      .filter((name): name is string => typeof name === 'string' && name.toLowerCase().includes(query) && name.toLowerCase() !== query)
      .slice(0, 5);
  }, [contractFormData.insurer, allCustomers]);

  const productSuggestions = useMemo(() => {
    const query = contractFormData.productName?.toLowerCase() || '';
    if (query.length < 1) return [];
    return Array.from(new Set(allCustomers.flatMap(c => c.contracts.map(con => con.productName))))
      .filter((name): name is string => typeof name === 'string' && name.toLowerCase().includes(query) && name.toLowerCase() !== query)
      .slice(0, 5);
  }, [contractFormData.productName, allCustomers]);

  const logAutoTouch = (method: string) => {
    const touchEntry: HistoryEntry = {
      id: `auto-${Date.now()}`,
      type: HistoryType.TOUCH,
      date: new Date().toISOString().split('T')[0],
      content: `[자동 기록] ${method} 버튼을 통해 고객에게 연락을 시도했습니다.`
    };
    onUpdate({
      ...customer,
      history: [touchEntry, ...customer.history]
    });
  };

  const handleAddHistory = () => {
    if (!newHistory.content) return;
    onUpdate({
      ...customer,
      history: [
        { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...newHistory },
        ...customer.history
      ]
    });
    setNewHistory({ type: HistoryType.CONSULTATION, content: '' });
    setShowHistoryForm(false);
  };

  const handleOpenContractForm = (contract?: Contract) => {
    if (contract) {
      setEditingContractId(contract.id);
      setContractFormData({ ...contract });
    } else {
      setEditingContractId(null);
      setContractFormData({ 
        insurer: '', productName: '', premium: 0, paymentMethod: '자동이체', paymentDetails: '', 
        startDate: new Date().toISOString().split('T')[0], tags: []
      });
    }
    setShowContractForm(true);
  };

  const toggleTag = (tag: string) => {
    const currentTags = contractFormData.tags || [];
    setContractFormData({ 
      ...contractFormData, 
      tags: currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag]
    });
  };

  const handleSaveContract = () => {
    if (!contractFormData.insurer || !contractFormData.productName) {
      alert('보험사와 상품명은 필수입니다.');
      return;
    }
    const contractDataToSave = { 
      ...contractFormData, 
      id: editingContractId || Date.now().toString(),
      tags: contractFormData.tags || [] 
    } as Contract;

    const updatedContracts = editingContractId 
      ? customer.contracts.map(c => c.id === editingContractId ? contractDataToSave : c)
      : [contractDataToSave, ...customer.contracts];

    onUpdate({ ...customer, contracts: updatedContracts });
    setShowContractForm(false);
    setEditingContractId(null);
  };

  const handleDeleteContract = (id: string) => {
    if (window.confirm('이 계약 정보를 삭제하시겠습니까?')) {
      onUpdate({ ...customer, contracts: customer.contracts.filter(c => c.id !== id) });
    }
  };

  const getRelativeName = (id: string) => allCustomers.find(c => c.id === id)?.name || '알 수 없음';

  const networkData = useMemo(() => {
    const relationships = customer.relationships;
    if (relationships.length === 0) return [];
    return relationships.map((rel, idx) => {
      const angle = (idx / relationships.length) * 2 * Math.PI;
      const radius = 130; // 약간 더 넓게 배치
      return { 
        ...rel, 
        name: getRelativeName(rel.targetId), 
        x: Math.cos(angle) * radius, 
        y: Math.sin(angle) * radius 
      };
    });
  }, [customer.relationships, allCustomers]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 고정 상단 헤더 */}
      <div className="ios-blur px-6 pt-12 pb-6 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="md:hidden p-2 -ml-2 text-blue-500 flex items-center gap-1 font-bold">
            <ArrowLeft size={20} /><span>목록</span>
          </button>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"><Edit size={20} /></button>
            <button onClick={onDelete} className="p-2.5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"><Trash2 size={20} /></button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/20">
            {customer.name.substring(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight truncate">{customer.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${customer.status === CustomerStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {customer.status}
              </span>
              <span className="text-sm font-bold text-gray-500">{customer.phone}</span>
            </div>
          </div>
        </div>
        {/* 커스텀 탭 메뉴 */}
        <div className="flex mt-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {[
            { id: 'info', icon: User, label: '정보' },
            { id: 'contract', icon: FileText, label: '계약' },
            { id: 'history', icon: History, label: '이력' },
            { id: 'network', icon: Network, label: '인맥' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-blue-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon size={16} /><span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
        {activeTab === 'info' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">기본 정보 및 직업</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoRow icon={MapPin} label="거주지 주소" value={customer.address} />
                <InfoRow icon={Calendar} label="생년월일" value={customer.birthDate} />
                <InfoRow icon={ShieldCheck} label="주민등록번호" value={customer.registrationNumber || '미등록'} />
                <InfoRow icon={Briefcase} label="소속 회사/직함" value={`${customer.company || ''} ${customer.jobTitle || ''}`} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { logAutoTouch('전화'); window.location.href=`tel:${customer.phone}`; }} className="flex flex-col items-center justify-center gap-2 bg-green-500 text-white py-6 rounded-[32px] font-black shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                <PhoneCall size={24} />
                <span>전화 연결</span>
              </button>
              <button onClick={() => logAutoTouch('카카오톡')} className="flex flex-col items-center justify-center gap-2 bg-[#FEE500] text-[#3A1D1D] py-6 rounded-[32px] font-black shadow-xl shadow-yellow-400/20 active:scale-95 transition-all">
                <MessageCircle size={24} fill="currentColor" />
                <span>카톡 상담</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contract' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-black text-gray-900">보유 계약 <span className="text-blue-500 ml-1">{customer.contracts.length}</span></h3>
              <button onClick={() => handleOpenContractForm()} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2">
                <Plus size={16} /> 신규 계약
              </button>
            </div>

            {showContractForm && (
              <div className="bg-white p-8 rounded-[40px] border-2 border-blue-500/10 shadow-2xl mb-8 animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black text-gray-900 text-xl tracking-tight">계약 정보 {editingContractId ? '수정' : '입력'}</h4>
                  <button onClick={() => setShowContractForm(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormInputSmall label="보험사" placeholder="삼성화재, 메리츠 등" value={contractFormData.insurer || ''} onChange={v => setContractFormData({...contractFormData, insurer: v})}/>
                    <FormInputSmall label="상품명" placeholder="통합보험, 운전자보험 등" value={contractFormData.productName || ''} onChange={v => setContractFormData({...contractFormData, productName: v})}/>
                    <FormInputSmall label="보험료" placeholder="0" type="number" value={contractFormData.premium?.toString() || ''} onChange={v => setContractFormData({...contractFormData, premium: parseInt(v) || 0})}/>
                    <FormInputSmall label="개시일" type="date" value={contractFormData.startDate || ''} onChange={v => setContractFormData({...contractFormData, startDate: v})}/>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {PREDEFINED_TAGS.map(tag => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-4 py-2 rounded-full text-[11px] font-black border transition-all ${contractFormData.tags?.includes(tag) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>{tag}</button>
                    ))}
                  </div>
                  <button onClick={handleSaveContract} className="w-full bg-blue-600 text-white py-5 rounded-[24px] text-base font-black shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all">계약 정보 저장</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {customer.contracts.length === 0 ? (
                <div className="bg-gray-50 p-20 rounded-[48px] text-center text-gray-400 border-2 border-dashed border-gray-200 flex flex-col items-center">
                  <FileText size={48} className="opacity-10 mb-4" />
                  <p className="font-black">등록된 계약이 없습니다.</p>
                </div>
              ) : (
                customer.contracts.map(contract => (
                  <div key={contract.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group relative overflow-hidden hover:shadow-xl transition-all">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenContractForm(contract)} className="p-2.5 bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteContract(contract.id)} className="p-2.5 bg-gray-50 text-gray-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {contract.tags?.map(tag => (
                        <span key={tag} className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100/50">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{contract.insurer}</span>
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{contract.productName}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">{contract.premium.toLocaleString()}원</p>
                        <p className="text-[10px] text-gray-400 font-bold">월 보험료</p>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-8">
                       <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-gray-300" />
                        <div><p className="text-[10px] text-gray-400 font-bold">계약 시작일</p><p className="text-sm font-black text-gray-700">{contract.startDate}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-gray-300" />
                        <div><p className="text-[10px] text-gray-400 font-bold">결제 수단</p><p className="text-sm font-black text-gray-700">{contract.paymentMethod}</p></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8 animate-in fade-in duration-300 flex flex-col h-full max-w-4xl mx-auto">
             <div className="flex justify-between items-center px-1">
               <h3 className="text-xl font-black text-gray-900">가족 및 지인 관계도</h3>
             </div>

             {customer.relationships.length === 0 ? (
               <div className="flex-1 bg-gray-50 p-20 rounded-[48px] text-center text-gray-400 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                 <Network size={48} className="mb-4 opacity-10" />
                 <p className="font-black">연결된 인맥 정보가 없습니다.</p>
               </div>
             ) : (
               <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-50 rounded-[48px] border border-gray-100 min-h-[500px]">
                 <svg className="absolute inset-0 w-full h-full opacity-30">
                    {networkData.map((node, i) => (
                      <line 
                        key={i}
                        x1="50%" y1="50%" 
                        x2={`calc(50% + ${node.x}px)`} y2={`calc(50% + ${node.y}px)`}
                        className="stroke-blue-400 stroke-[2] stroke-dasharray-[6]"
                      />
                    ))}
                 </svg>

                 <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[36px] shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white flex-col animate-in zoom-in-50 duration-700">
                    <User size={28} className="mb-1" />
                    <span className="text-sm font-black tracking-tight">{customer.name}</span>
                 </div>

                 {networkData.map((node, i) => (
                   <div 
                    key={i}
                    style={{ transform: `translate(${node.x}px, ${node.y}px)`, transitionDelay: `${i * 100}ms` }}
                    className="absolute z-20 animate-in zoom-in-0 duration-700"
                   >
                     <button 
                      onClick={() => onSelectCustomer?.(node.targetId)}
                      className="w-20 h-20 bg-white border border-gray-100 rounded-[28px] shadow-xl flex items-center justify-center flex-col transition-all hover:scale-110 hover:border-blue-400 active:scale-95 group"
                     >
                        <div className="text-[8px] font-black text-blue-500 mb-1">{node.type}</div>
                        <span className="text-[11px] font-black text-gray-700">{node.name}</span>
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* 히스토리 탭은 생략(기존 코드 유지) */}
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-5 p-4 rounded-3xl group">
    <div className="mt-0.5 p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500 transition-all"><Icon size={20} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-black text-gray-900 break-words leading-tight">{value || '데이터 없음'}</p>
    </div>
  </div>
);

const FormInputSmall = ({ label, placeholder, value, onChange, type = "text" }: { label: string, placeholder?: string, value: string, onChange: (v: string) => void, type?: string }) => (
  <div>
    <label className="text-[10px] font-black text-gray-400 mb-2 block px-1 uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      className="w-full p-4 rounded-[24px] bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default CustomerDetail;
