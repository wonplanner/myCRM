
import React, { useState, useMemo } from 'react';
import { Customer, CustomerStatus, HistoryType, Contract } from './types';
import { X, Save, User, Phone, MapPin, Calendar, Briefcase, MessageCircle, HeartPulse, ShieldCheck, CreditCard } from 'lucide-react';

interface CustomerFormProps {
  customer: Customer | null;
  allCustomers: Customer[];
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, allCustomers, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      name: '',
      phone: '',
      address: '',
      birthDate: '',
      registrationNumber: '',
      kakaoLink: '',
      status: CustomerStatus.ACTIVE,
      company: '',
      jobTitle: '',
      contracts: [],
      history: [],
      relationships: []
    }
  );

  const [includeContract, setIncludeContract] = useState(false);
  const [initialContract, setInitialContract] = useState<Partial<Contract>>({
    insurer: '', productName: '', premium: 0, paymentMethod: '자동이체', paymentDetails: '', tags: []
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = useMemo(() => {
    const query = formData.phone || '';
    if (query.length < 3) return [];
    return allCustomers.filter(c => c.id !== customer?.id && c.phone.includes(query)).slice(0, 5);
  }, [formData.phone, allCustomers, customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('이름과 연락처는 필수항목입니다.');
      return;
    }

    const finalContracts = [...(formData.contracts || [])];
    if (!customer && includeContract && initialContract.insurer && initialContract.productName) {
      finalContracts.push({
        ...initialContract,
        id: `init-${Date.now()}`,
        startDate: new Date().toISOString().split('T')[0],
        tags: initialContract.tags || []
      } as Contract);
    }

    onSubmit({
      ...formData as Customer,
      id: formData.id || Date.now().toString(),
      contracts: finalContracts,
      createdAt: formData.createdAt || new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F2F2F7] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{customer ? '고객 정보 수정' : '새 고객 등록'}</h2>
            <p className="text-xs text-gray-500 font-bold mt-1">상세한 정보를 입력할수록 AI 분석이 정확해집니다.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] px-1">인적 사항</h3>
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormInput label="이름 *" icon={User} placeholder="성함" value={formData.name || ''} onChange={v => setFormData({...formData, name: v})}/>
               <div className="relative">
                 <FormInput label="연락처 *" icon={Phone} placeholder="010-0000-0000" value={formData.phone || ''} onChange={v => { setFormData({...formData, phone: v}); setShowSuggestions(true); }}/>
                 {showSuggestions && suggestions.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden">
                     {suggestions.map(s => (
                       <button key={s.id} type="button" onClick={() => {setFormData({...formData, name: s.name, phone: s.phone}); setShowSuggestions(false);}} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-0">
                         <div className="flex flex-col"><span className="text-sm font-bold text-gray-900">{s.name}</span><span className="text-xs text-gray-500">{s.phone}</span></div>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
               <div className="md:col-span-2">
                 <FormInput label="주소" icon={MapPin} placeholder="거주지 주소" value={formData.address || ''} onChange={v => setFormData({...formData, address: v})}/>
               </div>
               <FormInput label="생년월일" icon={Calendar} type="date" value={formData.birthDate || ''} onChange={v => setFormData({...formData, birthDate: v})}/>
               <FormInput label="주민등록번호" icon={ShieldCheck} placeholder="850101-1******" value={formData.registrationNumber || ''} onChange={v => setFormData({...formData, registrationNumber: v})}/>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] px-1">직업 정보 및 상태</h3>
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormInput label="회사명" icon={Briefcase} placeholder="직장명" value={formData.company || ''} onChange={v => setFormData({...formData, company: v})}/>
               <FormInput label="직함" icon={Briefcase} placeholder="과장, 팀장 등" value={formData.jobTitle || ''} onChange={v => setFormData({...formData, jobTitle: v})}/>
               <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 mb-3 block px-1 uppercase tracking-widest">관리 상태</label>
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                    {Object.values(CustomerStatus).map(status => (
                      <button key={status} type="button" onClick={() => setFormData({...formData, status})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.status === status ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}>{status}</button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </form>

        <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
            <Save size={20} /> {customer ? '정보 수정 완료' : '새로운 고객으로 등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon: Icon, placeholder, value, onChange, type = "text" }: { label: string, icon: any, placeholder?: string, value: string, onChange: (v: string) => void, type?: string }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 mb-2 block px-1 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  </div>
);

export default CustomerForm;
