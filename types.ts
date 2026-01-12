
export enum CustomerStatus {
  ACTIVE = '유지',
  CANCELLED = '해지',
  PROSPECT = '잠재'
}

export enum RelationType {
  FAMILY = '가족',
  RECOMMENDER = '추천인',
  FRIEND = '지인',
  COLLEAGUE = '직장동료'
}

export enum HistoryType {
  CONSULTATION = '상담일지',
  TOUCH = '터치(안부)',
  MEDICAL = '병력/보상'
}

export interface Contract {
  id: string;
  insurer: string;
  productName: string;
  premium: number;
  paymentMethod: string;
  paymentDetails: string;
  startDate: string;
  tags: string[];
}

export interface HistoryEntry {
  id: string;
  type: HistoryType;
  date: string;
  content: string;
}

export interface Relationship {
  targetId: string;
  type: RelationType;
}

export interface Notice {
  id: string;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: 'kakao' | 'naver' | 'email';
  isLoggedIn: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  birthDate: string;
  registrationNumber?: string;
  kakaoLink?: string; 
  status: CustomerStatus;
  company?: string;
  jobTitle?: string;
  contracts: Contract[];
  history: HistoryEntry[];
  relationships: Relationship[];
  createdAt: string;
}
