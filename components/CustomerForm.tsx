
import React, { useState, useMemo } from 'react';
import { Customer, CustomerStatus } from '../types';
import { X, Save, User, Phone, MapPin, Calendar, Briefcase, AlertCircle, MessageCircle } from 'lucide-react';

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
    onSubmit({
      ...formData as Customer,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString()
    });
  };

  const handleSelectSuggestion = (suggested: Customer) => {
    if (window.confirm(`${suggested.name}님의 정보를 불러올까요?`)) {
      setFormData({
        ...formData,
        name: suggested.name,
        phone: suggested.phone,
        address: suggested.address,
        birthDate: suggested.birthDate,
        registrationNumber: suggested.registrationNumber,
        kakaoLink: suggested.kakaoLink || '',
        company: suggested.company,
        jobTitle: suggested.jobTitle,
        status: suggested.status
      });
      setShowSuggestions(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{customer ? '고객 정보 수정' : '새 고객 등록'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormInput label="이름 *" icon={User} placeholder="성함" value={formData.name || ''} onChange={v => setFormData({...formData, name: v})}/>
               <div className="relative">
                 <FormInput label="연락처 *" icon={Phone} placeholder="010-0000-0000" value={formData.phone || ''} onChange={v => { setFormData({...formData, phone: v}); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)}/>
                 {showSuggestions && suggestions.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden animate-in slide-in-from-top-2">
                     {suggestions.map(s => (
                       <button key={s.id} type="button" onClick={() => handleSelectSuggestion(s)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors">
                         <div className="flex flex-col"><span className="text-sm font-bold text-gray-900">{s.name}</span><span className="text-xs text-gray-500">{s.phone}</span></div>
                         <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">불러오기</div>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
               <div className="md:col-span-2">
                 <FormInput label="카카오톡 링크 (오픈채팅 등)" icon={MessageCircle} placeholder="https://open.kakao.com/..." value={formData.kakaoLink || ''} onChange={v => setFormData({...formData, kakaoLink: v})}/>
               </div>
               <div className="md:col-span-2">
                 <FormInput label="주소" icon={MapPin} placeholder="상세 주소" value={formData.address || ''} onChange={v => setFormData({...formData, address: v})}/>
               </div>
               <FormInput label="생년월일" icon={Calendar} type="date" value={formData.birthDate || ''} onChange={v => setFormData({...formData, birthDate: v})}/>
               <FormInput label="주민번호" icon={User} placeholder="예: 801231-1******" value={formData.registrationNumber || ''} onChange={v => setFormData({...formData, registrationNumber: v})}/>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">직업 및 상태</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormInput label="회사명" icon={Briefcase} placeholder="소속 회사" value={formData.company || ''} onChange={v => setFormData({...formData, company: v})}/>
               <FormInput label="직함" icon={Briefcase} placeholder="직급" value={formData.jobTitle || ''} onChange={v => setFormData({...formData, jobTitle: v})}/>
               <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 mb-1.5 block px-1">상태</label>
                  <div className="flex gap-2">
                    {Object.values(CustomerStatus).map(status => (
                      <button key={status} type="button" onClick={() => setFormData({...formData, status})} className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${formData.status === status ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-white text-gray-600 border-gray-200'}`}>{status}</button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100"><button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"><Save size={20} />{customer ? '정보 수정하기' : '새 고객으로 등록'}</button></div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon: Icon, placeholder, value, onChange, onFocus, type = "text" }: { label: string, icon: any, placeholder?: string, value: string, onChange: (v: string) => void, onFocus?: () => void, type?: string }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 mb-1.5 block px-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
      <input type={type} placeholder={placeholder} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus}/>
    </div>
  </div>
);

export default CustomerForm;
