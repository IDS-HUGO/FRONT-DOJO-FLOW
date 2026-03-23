export interface Student {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  active: boolean;
  created_at: string;
}

export interface Payment {
  id: number;
  student_id: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  payment_date: string;
  method: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  attended_at: string;
  class_type: string;
}

export interface BeltProgress {
  id: number;
  student_id: number;
  belt_name: string;
  exam_score: number;
  approved: boolean;
  evaluated_at: string;
}

export interface DashboardKpi {
  mrr: number;
  churn_rate: number;
  take_rate_volume: number;
  nps: number;
  active_students: number;
  attendance_this_month: number;
}

export interface MarketplaceItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
}

export interface AcademyProfile {
  id: number;
  dojo_name: string;
  owner_name: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  timezone: string;
  currency: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialties?: string;
  hourly_rate: number;
  active: boolean;
  created_at?: string;
}

export interface Schedule {
  id: number;
  class_type: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  teacher_id?: number;
  max_students: number;
  active: boolean;
  created_at?: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  max_uses?: number;
  used_count: number;
  valid_until: string;
  active: boolean;
  description?: string;
  created_at?: string;
}
