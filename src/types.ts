export interface Student {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  belt_level: string;
  status: "active" | "inactive" | "suspended";
  academy_id: number;
  active: boolean;
  created_at: string;
}

export interface StudentCreateResponse extends Student {
  credentials_email_sent: boolean;
  fallback_temporary_password?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  account_type: "student" | "staff";
  student_id?: number | null;
}

export interface Payment {
  id: number;
  student_id: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  payment_date: string;
  method: string;
  external_id?: string;
}

export interface PayPalCheckoutResponse {
  payment_id: number;
  order_id: string;
  checkout_url: string;
}

export interface Plan {
  id: number;
  name: string;
  monthly_price: number;
  description: string;
  transaction_fee_percent: number;
}

export interface PlanCheckoutResponse {
  subscription_payment_id: number;
  order_id: string;
  checkout_url: string;
}

export interface PlanSubscriptionPayment {
  id: number;
  user_id: number;
  plan_id: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  provider: string;
  mp_payment_id?: string | null;
  payment_date: string;
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
  user_id: number;
  dojo_name: string;
  owner_name: string;
  contact_email: string;
  contact_phone?: string;
  city?: string;
  timezone?: string;
  currency?: string;
  created_at?: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialties?: string;
  hourly_rate: number;
  academy_id: number;
  active: boolean;
  created_at?: string;
}

export interface Schedule {
  id: number;
  class_type: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_students: number;
  active: boolean;
  academy_id: number;
  students?: Student[];
  teachers?: Teacher[];
  created_at?: string;
}

export interface ScheduleCapacityInfo {
  schedule_id: number;
  class_type: string;
  day: string;
  time: string;
  dojo_plan: string;
  is_basic_plan: boolean;
  max_capacity: number | null;
  current_students: number;
  available_spots: number | null;
  is_unlimited: boolean;
  is_full: boolean;
  teachers_count: number;
  teachers: Array<{ id: number; name: string }>;
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

export interface Order {
  id: number;
  plan_id: number;
  dojo_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  city: string;
  timezone: string;
  currency: string;
  amount: number;
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";
  payment_method: string;
  transaction_id?: string;
  paid_at?: string;
  generated_email?: string;
  generated_password?: string;
  credentials_sent_at?: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface ScheduleCreateRequest {
  class_type: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active?: boolean;
}

export interface EnrollStudentRequest {
  student_id: number;
}

export interface AssignTeacherRequest {
  teacher_id: number;
}

export interface TeacherResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialties?: string;
  hourly_rate: number;
  academy_id: number;
  active: boolean;
}

export interface StudentResponse {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  belt_level: string;
  status: string;
  academy_id: number;
  active: boolean;
}