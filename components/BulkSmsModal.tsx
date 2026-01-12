
import React, { useState } from 'react';
import { Customer } from '../types';
import { X, Send, Users, Info, Copy, CheckCircle, MessageSquarePlus } from 'lucide-react';

interface BulkSmsModalProps {
  selectedCustomers: Customer[];
  onClose: () => void;
}

const SMS_TEMPLATES = [
  {
    id: 'greeting',
    title: '기본 안부',
    content: (name: string) => `안녕하세요 ${name} 고객님! 인슈어플래너 담당 설계사입니다. 별일 없이 평안하신지요? 보험 관련 궁금한 점 있으시면 언제든 연락 주세요.`
  },
  {
    id: 'expiry',
    title: '만기 안내',
    content: (name: string) => `안녕하세요 ${name} 고객님. 가입하신 보험의 만기일이 다가오고 있어 안내드립니다. 보장 공백이 생기지 않도록 검토가 필요합니다.`
  },
  {
    id: 'product',
    title: '상품 안내',
    content: (name: string) => `[안내] 안녕하세요 ${name} 고객님. 최근 보장 범위가 확대된 신규 상품이 출시되어 정보 공유드립니다. 관심 있으시면 상담 도와드리겠습니다.`
  },
  {
    id: 'birthday',
    title: '생일 축하',
    content: (name: string) => `🎉 ${name} 고객님, 생신을 진심으로 축하드립니다! 오늘 하루 세상에서 가장 행복하고 따뜻한 시간 보내시길 바랍니다.`
  }
];

const BulkSmsModal: React.FC<BulkSmsModalProps> = ({ selectedCustomers, onClose }) => {
  const [message, setMessage] = useState('');
  const [copiedType, setCopiedType] = useState<'none' | 'numbers' | 'content'>('none');
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const applyTemplate = (templateId: string) => {
    const template = SMS_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    // Use the first customer's name as a representative for the template preview in the text box
    // or use a placeholder if multiple selected
    const representativeName = selectedCustomers.length === 1 ? selectedCustomers[0].name : "OOO";
    setMessage(template.content(representativeName));
  };

  const handleSend = () => {
    if (!message.trim()) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    // Prepare phone numbers
    const phoneNumbers = selectedCustomers.map(c => c.phone.replace(/[^0-9]/g, ''));
    
    // Separator logic: iOS uses ',', Android uses ';'
    const separator = isIOS ? ',' : ';';
    const phonesParam = phoneNumbers.join(separator);
    
    // SMS URI construction based on platform standards
    let smsUrl = '';
    if (isIOS) {
      // iOS: sms:num1,num2&body=text
      smsUrl = `sms:${phonesParam}&body=${encodeURIComponent(message)}`;
    } else if (isAndroid) {
      // Android: sms:num1;num2?body=text
      smsUrl = `sms:${phonesParam}?body=${encodeURIComponent(message)}`;
    } else {
      // General fallback
      smsUrl = `sms:${phonesParam}?body=${encodeURIComponent(message)}`;
    }
    
    window.location.href = smsUrl;
    
    setTimeout(() => {
        if(window.confirm('기본 메시지 앱으로 연결을 시도했습니다. 발송 완료 후 선택 모드를 종료할까요?')) {
            onClose();
        }
    }, 1000);
  };

  const copyToClipboard = async (type: 'numbers' | 'content') => {
    let text = '';
    if (type === 'numbers') {
      text = selectedCustomers.map(c => c.phone).join('\n');
    } else {
      text = message;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType('none'), 2000);
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-gray-900">단체 메시지 작성</h2>
            <p className="text-xs text-gray-500 font-bold flex items-center gap-1">
              <Users size={12} /> {selectedCustomers.length}명의 수신자 선택됨
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Recipient Chips */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            {selectedCustomers.map(c => (
              <span key={c.id} className="inline-flex shrink-0 items-center bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-[11px] font-black text-blue-600">
                {c.name}
              </span>
            ))}
          </div>

          {/* Templates Section */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 px-1">
              <MessageSquarePlus size={12} /> 빠른 템플릿 선택
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SMS_TEMPLATES.map(template => (
                <button 
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all text-left truncate"
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">메시지 내용</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => copyToClipboard('content')}
                  className="text-[10px] font-black text-blue-500 flex items-center gap-1 hover:underline"
                >
                  {copiedType === 'content' ? <CheckCircle size={10} /> : <Copy size={10} />}
                  내용 복사
                </button>
                <span className="text-[10px] font-black text-gray-400">{message.length}자</span>
              </div>
            </div>
            <textarea 
              autoFocus
              placeholder="템플릿을 선택하거나 직접 내용을 입력하세요. 고객명은 자동으로 적용되지 않으므로 개별 발송 시 수정이 필요할 수 있습니다."
              className="w-full h-32 p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium leading-relaxed resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => copyToClipboard('numbers')}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-4 rounded-2xl font-black transition-all active:scale-[0.98]"
            >
              {copiedType === 'numbers' ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
              번호 목록 복사
            </button>
            <button 
              onClick={handleSend}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Send size={18} />
              메시지 앱 연동
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl flex gap-3 border border-gray-100">
            <Info size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-500 font-bold leading-snug">
              <p className="text-gray-700 mb-1">단체 발송 유의사항</p>
              <p>• iOS와 안드로이드의 번호 구분자( , vs ; )를 자동 처리합니다.</p>
              <p>• 수신자가 너무 많을 경우 이동통신사에 의해 스팸으로 차단될 수 있으니 20~30명 단위 발송을 권장합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkSmsModal;
