export interface Borrower {
  id: string;
  name: string;
  loan_type: string;
  amount: number;
  status: 'New' | 'In Review' | 'Approved' | 'Renew';
}

export interface BorrowerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  loan_amount: number;
  status: string;
  employment: string;
  income: number;
  existing_loan: number;
  credit_score: number;
  source_of_funds: string;
  risk_signal: string;
  ai_flags: string[];
}

export interface Broker {
  name: string;
  deals: number;
  approval_rate: string;
  pending: number;
}

export interface OnboardingStep {
  name: string;
}

export interface PipelineResponse {
  new: Borrower[];
  in_review: Borrower[];
  approved: Borrower[];
}

export interface ApiResponse {
  endpoints: {
    name: string;
    method: string;
    url: string;
    response: PipelineResponse | BorrowerDetails | Broker | { steps: string[] } | { success: boolean; message: string };
  }[];
}