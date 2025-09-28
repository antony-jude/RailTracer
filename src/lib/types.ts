export type UserRole = 'admin' | 'staff' | 'public';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
};

export type ComponentState = 'Verified' | 'Unverified' | 'Damaged';

export type Inspection = {
  id: string;
  date: string;
  inspector: string;
  inspectorId: string;
  notes: string;
  status: ComponentState;
};

export type RailwayComponent = {
  id: string;
  name: string;
  type: string;
  qrCode: string;
  location: string;
  installDate: string;
  currentState: ComponentState;
  history: Inspection[];
  vendor: string;
  warrantyUntil: string;
  supplyDate: string;
};
