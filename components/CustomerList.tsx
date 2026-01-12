
import React from 'react';
import { Customer, CustomerStatus } from '../types';
import { ChevronRight, Phone, CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers, selectedId, onSelect, isSelectionMode, selectedIds 
}) => {
  
  const getStatusStyle = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'bg-green-100 text-green-700 border-green-200';
      case CustomerStatus.CANCELLED:
        return 'bg-red-100 text-red-700 border-red-200';
      case CustomerStatus.PROSPECT:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {customers.length === 0 ? (
        <div className="p-8 text-center text-gray-400 mt-10">
          <p className="text-sm">해당하는 고객 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {customers.map(customer => {
            const isChecked = selectedIds?.has(customer.id);
            const allTags = Array.from(new Set(customer.contracts.flatMap(c => c.tags || [])));
            
            return (
              <div 
                key={customer.id}
                onClick={() => onSelect(customer.id)}
                className={`p-4 cursor-pointer transition-all flex items-center gap-4 border-l-4 ${
                  !isSelectionMode && selectedId === customer.id 
                  ? 'bg-blue-50 border-blue-500' 
                  : isChecked && isSelectionMode
                    ? 'bg-blue-50/50 border-blue-500/50'
                    : 'hover:bg-gray-50 border-transparent'
                }`}
              >
                {isSelectionMode && (
                  <div className={`transition-colors ${isChecked ? 'text-blue-500' : 'text-gray-300'}`}>
                    {isChecked ? <CheckCircle2 size={22} fill="currentColor" className="text-white fill-blue-500" /> : <Circle size={22} />}
                  </div>
                )}
                
                <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-base shrink-0 relative">
                  {customer.name.substring(0, 1)}
                  {customer.status === CustomerStatus.PROSPECT && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{customer.name}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-black tracking-tight ${getStatusStyle(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <Phone size={10} className="text-gray-400" />
                    {customer.phone}
                  </p>
                  
                  {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {allTags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] font-bold text-blue-500 bg-blue-50 px-1 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                      {allTags.length > 3 && (
                        <span className="text-[8px] font-bold text-gray-400 px-1 py-0.5">+{allTags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {!isSelectionMode && <ChevronRight size={16} className="text-gray-300" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
