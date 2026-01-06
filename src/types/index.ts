// Cloudflare D1 Database Bindings
export type Bindings = {
  DB: D1Database;
};

// Tier
export interface Tier {
  id: number;
  tier_code: string;
  tier_name: string;
  tier_name_en: string;
  subtitle?: string;
  price: number;
  max_reward: number;
  color_scheme?: string;
  is_best_choice: number;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

// Reward
export interface Reward {
  id: number;
  tier_id: number;
  reward_name: string;
  reward_name_en?: string;
  reward_image_url?: string;
  reward_value: number;
  probability: number;
  is_jackpot: number;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

// Order Status Type
export type OrderStatus = 
  | 'payment_pending' 
  | 'paid' 
  | 'broken' 
  | 'shipping' 
  | 'delivered' 
  | 'refunded' 
  | 'cancelled';

// Order
export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  tier_id: number;
  tier_code: string;
  price: number;
  status: OrderStatus;
  payment_method?: string;
  payment_at?: string;
  payment_transaction_id?: string;
  is_broken: number;
  broken_at?: string;
  reward_id?: number;
  refund_at?: string;
  refund_reason?: string;
  refund_amount?: number;
  user_ip?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

// Shipping
export interface Shipping {
  id: number;
  order_id: number;
  recipient_name: string;
  recipient_phone: string;
  postal_code?: string;
  address: string;
  address_detail?: string;
  shipping_memo?: string;
  shipping_status: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

// Analytics Event
export interface AnalyticsEvent {
  id?: number;
  event_name: string;
  order_id?: number;
  tier_code?: string;
  user_id?: number;
  session_id?: string;
  event_data?: string;
  user_ip?: string;
  user_agent?: string;
  created_at?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TierWithRewards extends Tier {
  rewards: Reward[];
}

export interface OrderWithDetails extends Order {
  tier?: Tier;
  reward?: Reward;
  shipping?: Shipping;
}
