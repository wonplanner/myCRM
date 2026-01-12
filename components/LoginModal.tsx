
import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLogin: (profile: UserProfile) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [step, setStep] = useState<'select' | 'email'>('select');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
    setIsLoading(true);
    // 시뮬레이션: 1.5초 후 로그인 완료
    setTimeout(() => {
      onLogin({
        id: `user-${Date.now()}`,
        name: provider === 'kakao' ? '김카카오' : '네이버 설계사',
        email: `${provider}@example.com`,
        provider,
        isLoggedIn: true
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">반갑습니다!</h2>
            <p className="text-sm text-gray-500 font-medium">데이터 동기화를 위해 로그인해 주세요.</p>
          </div>

          {isLoading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="text-blue-500 animate-spin" size={40} />
              <p className="text-sm font-bold text-gray-400">계정 정보를 불러오는 중...</p>
            </div>
          ) : step === 'select' ? (
            <div className="space-y-3">
              <button 
                onClick={() => handleSocialLogin('kakao')}
                className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#3A1D1D] py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" className="w-5 h-5" alt="K" />
                카카오로 시작하기
              </button>
              <button 
                onClick={() => handleSocialLogin('naver')}
                className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                <span className="font-black text-lg">N</span>
                네이버로 시작하기
              </button>
              <button 
                onClick={() => setStep('email')}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                <Mail size={18} />
                이메일로 계속하기
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <input type="email" placeholder="이메일 주소" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                <input type="password" placeholder="비밀번호" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <button 
                onClick={() => handleSocialLogin('kakao')} // 시뮬레이션용
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20"
              >
                로그인
              </button>
              <button onClick={() => setStep('select')} className="w-full text-xs font-bold text-gray-400 py-2">뒤로 가기</button>
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            로그인 시 인슈어플래너의 이용약관 및 <br/>개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
