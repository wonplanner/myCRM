
import { Customer, CustomerStatus, HistoryType, RelationType, Notice } from './types';

export const STORAGE_KEY = 'insure_planner_crm_data';
export const NOTICE_STORAGE_KEY = 'insure_planner_notices';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: '김철수',
    phone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123',
    birthDate: '1985-05-20',
    registrationNumber: '850520-1******',
    status: CustomerStatus.ACTIVE,
    company: '삼성전자',
    jobTitle: '과장',
    contracts: [
      {
        id: 'c1',
        insurer: '삼성화재',
        productName: '무배당 통합보험',
        premium: 150000,
        paymentMethod: '자동이체',
        paymentDetails: '우리은행 1002-***-****',
        startDate: '2022-01-15',
        tags: ['종합']
      }
    ],
    history: [
      {
        id: 'h1',
        type: HistoryType.CONSULTATION,
        date: '2023-11-01',
        content: '기존 보험 분석 및 리모델링 상담 완료'
      }
    ],
    relationships: [
      { targetId: '2', type: RelationType.FAMILY }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '이영희',
    phone: '010-9876-5432',
    address: '경기도 성남시 분당구 정자동',
    birthDate: '1988-12-10',
    status: CustomerStatus.ACTIVE,
    contracts: [],
    history: [],
    relationships: [
      { targetId: '1', type: RelationType.FAMILY }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_NOTICES: Notice[] = [
  { id: 'n1', content: '자동차 보험 만기 고객님 리스트를 확인하셨나요?', createdAt: new Date().toISOString() },
  { id: 'n2', content: '오늘 생일인 고객님께 안부 메시지를 보내보세요.', createdAt: new Date().toISOString() },
  { id: 'n3', content: '신규 상품 교육 자료를 다시 한번 숙지합시다.', createdAt: new Date().toISOString() }
];
