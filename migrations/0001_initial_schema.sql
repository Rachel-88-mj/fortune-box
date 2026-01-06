-- ========================================
-- FORTUNE BOX DATABASE SCHEMA
-- ========================================

-- Users Table (계정 관리 - 향후 확장용)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tiers Table (4개 고정 티어: BRONZE, GOLD, PLATINUM, DIAMOND)
CREATE TABLE IF NOT EXISTS tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_code TEXT UNIQUE NOT NULL, -- 'BRONZE', 'GOLD', 'PLATINUM', 'DIAMOND'
  tier_name TEXT NOT NULL,
  tier_name_en TEXT NOT NULL,
  subtitle TEXT, -- 'Entry Level', 'Most Popular', 'VIP Access', 'High Roller Only'
  price INTEGER NOT NULL, -- 단위: 원
  max_reward INTEGER NOT NULL, -- 최대 보상 금액
  color_scheme TEXT, -- 'bronze', 'gold', 'platinum', 'diamond'
  is_best_choice INTEGER DEFAULT 0, -- 1 = BEST CHOICE 뱃지 표시
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rewards Table (티어별 리워드 아이템)
CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_id INTEGER NOT NULL,
  reward_name TEXT NOT NULL,
  reward_name_en TEXT,
  reward_image_url TEXT, -- 리워드 이미지 URL
  reward_value INTEGER NOT NULL, -- 리워드 가치 (원)
  probability REAL NOT NULL, -- 확률 (0.0 ~ 1.0, 합계 1.0)
  is_jackpot INTEGER DEFAULT 0, -- 1 = 잭팟 아이템
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tier_id) REFERENCES tiers(id) ON DELETE CASCADE
);

-- Orders Table (주문/결제 정보)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL, -- 주문번호 (예: FB20260106-XXXX)
  user_id INTEGER, -- 향후 로그인 연동시 사용
  tier_id INTEGER NOT NULL,
  tier_code TEXT NOT NULL,
  price INTEGER NOT NULL,
  
  -- 주문 상태 (payment_pending, paid, broken, shipping, delivered, refunded, cancelled)
  status TEXT DEFAULT 'payment_pending',
  
  -- 결제 정보
  payment_method TEXT, -- 'card', 'bank', 'virtual'
  payment_at DATETIME,
  payment_transaction_id TEXT,
  
  -- 깨기(Break) 정보
  is_broken INTEGER DEFAULT 0, -- 0 = 미깨짐, 1 = 깨짐
  broken_at DATETIME,
  reward_id INTEGER, -- 획득한 리워드 ID
  
  -- 환불 정보
  refund_at DATETIME,
  refund_reason TEXT,
  refund_amount INTEGER,
  
  -- 메타 정보
  user_ip TEXT,
  user_agent TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tier_id) REFERENCES tiers(id),
  FOREIGN KEY (reward_id) REFERENCES rewards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Shipping Table (배송지 정보)
CREATE TABLE IF NOT EXISTS shipping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER UNIQUE NOT NULL,
  
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  
  postal_code TEXT,
  address TEXT NOT NULL,
  address_detail TEXT,
  
  shipping_memo TEXT,
  
  -- 배송 상태 (pending, preparing, shipped, delivered)
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  shipped_at DATETIME,
  delivered_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Analytics Events Table (트래킹 이벤트)
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  order_id INTEGER,
  tier_code TEXT,
  user_id INTEGER,
  session_id TEXT,
  event_data TEXT, -- JSON 형태
  user_ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin Users Table (어드민 계정)
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- 'admin', 'super_admin'
  is_active INTEGER DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_tier_id ON orders(tier_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rewards_tier_id ON rewards(tier_id);
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON rewards(is_active);

CREATE INDEX IF NOT EXISTS idx_tiers_tier_code ON tiers(tier_code);
CREATE INDEX IF NOT EXISTS idx_tiers_is_active ON tiers(is_active);

CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON shipping(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_status ON shipping(shipping_status);

CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);
