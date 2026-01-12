
import React, { useRef } from 'react';
import { 
  ArrowLeft, Download, Upload, FileSpreadsheet, 
  FileText, Database, Info, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface DataManagementViewProps {
  totalCount: number;
  filteredCount: number;
  onDownloadTemplate: () => void;
  onImport: (file: File) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onBack: () => void;
  isFilterActive: boolean;
}

const DataManagementView: React.FC<DataManagementViewProps> = ({
  totalCount, filteredCount, onDownloadTemplate, onImport, 
  onExportCSV, onExportPDF, onBack, isFilterActive
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col bg-[#F2F2F7] overflow-y-auto">
      <div className="ios-blur px-8 py-10 border-b border-gray-200 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-1 text-blue-500 font-bold text-sm mb-4 hover:underline">
          <ArrowLeft size={18} /> 고객 관리로 돌아가기
        </button>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">데이터 관리 센터</h2>
        <p className="text-gray-500 mt-2 font-medium">고객 정보를 안전하게 백업하고 대량으로 등록하세요.</p>
      </div>

      <div className="p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <Database size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">전체 등록 고객</p>
              <p className="text-2xl font-black text-gray-900">{totalCount}명</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">현재 필터링된 고객</p>
              <p className="text-2xl font-black text-gray-900">{filteredCount}명</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Import Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">데이터 가져오기</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Upload size={40} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">엑셀/CSV 파일 업로드</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">양식에 맞춰 작성된 고객 데이터를 한 번에 대량으로 등록할 수 있습니다.</p>
              </div>
              <div className="w-full space-y-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  파일 선택 및 업로드
                </button>
                <button 
                  onClick={onDownloadTemplate}
                  className="w-full bg-gray-50 text-gray-700 py-3 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} /> 가져오기용 양식 다운로드
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              </div>
            </div>
          </section>

          {/* Export Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">데이터 내보내기</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Download size={40} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">검색 결과 추출</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">
                  {isFilterActive 
                    ? "설정된 필터 조건에 맞는 고객 정보만 추출합니다." 
                    : "전체 고객 데이터를 다양한 형식으로 저장할 수 있습니다."}
                </p>
              </div>
              <div className="w-full grid grid-cols-1 gap-3">
                <button 
                  onClick={onExportCSV}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-500/20 active:scale-95 transition-all"
                >
                  <FileSpreadsheet size={20} /> 엑셀(CSV) 저장
                </button>
                <button 
                  onClick={onExportPDF}
                  className="flex items-center justify-center gap-2 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                >
                  <FileText size={20} /> PDF 리스트 출력
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
          <Info className="text-blue-500 shrink-0 mt-1" size={24} />
          <div>
            <h5 className="font-bold text-blue-900 text-sm">데이터 보안 안내</h5>
            <p className="text-xs text-blue-700 leading-relaxed mt-1">
              본 앱은 어떠한 고객 정보도 외부 서버로 전송하지 않습니다. 모든 정보는 설계사님의 브라우저(로컬 스토리지)에만 저장되므로 주기적으로 <strong>'엑셀 저장'</strong>을 통해 개별 PC에 백업 파일을 보관하시는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementView;
