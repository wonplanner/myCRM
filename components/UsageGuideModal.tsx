
import React from 'react';
import { X, UserPlus, Filter, MessageCircle, Download, UserCircle } from 'lucide-react';

interface UsageGuideModalProps {
  onClose: () => void;
}

const UsageGuideModal: React.FC<UsageGuideModalProps> = ({ onClose }) => {
  const steps = [
    {
      icon: <UserCircle className="text-purple-500" />,
      title: "나만의 브랜드 설정",
      desc: "사이드바 좌측 상단의 '설계사의 고객관리' 이름을 클릭해 보세요. 본인의 이름으로 변경하여 나만의 전문 CRM으로 개인화할 수 있습니다."
    },
    {
      icon: <UserPlus className="text-blue-500" />,
      title: "고객 등록 및 관리",
      desc: "우측 상단 또는 사이드바의 '새 고객 등록' 버튼을 눌러 정보를 입력하세요. 연락처 입력 시 기존 고객이면 정보를 자동으로 불러옵니다."
    },
    {
      icon: <MessageCircle className="text-yellow-500" />,
      title: "카카오톡 스마트 연락",
      desc: "상세 페이지의 카톡 버튼을 누르면 링크 연결 또는 정보 자동 복사가 진행됩니다. 연락 시 활동 히스토리에 일시가 자동 기록됩니다."
    },
    {
      icon: <Download className="text-red-500" />,
      title: "데이터 관리 및 백업",
      desc: "'데이터 관리 센터'에서 전체 명부를 엑셀(CSV)로 저장하거나 PDF로 출력할 수 있습니다. 주기적인 엑셀 백업을 권장합니다."
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">앱 사용 가이드</h2>
            <p className="text-sm text-gray-500 font-medium">인슈어플래너를 200% 활용하는 방법</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">{step.icon}</div>
                <div><h3 className="font-bold text-gray-900 mb-1">{step.title}</h3><p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">!</span>데이터 보안 안내</h4>
            <p className="text-xs text-blue-700 leading-relaxed">입력하신 모든 정보는 외부 서버가 아닌 <strong>설계사님의 현재 브라우저</strong>에만 저장됩니다. 따라서 브라우저 쿠키를 삭제하면 데이터가 날아갈 수 있으니 자주 엑셀로 백업해 주세요.</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center"><button onClick={onClose} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all">확인했습니다</button></div>
      </div>
    </div>
  );
};

export default UsageGuideModal;
