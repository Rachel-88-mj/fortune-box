-- ========================================
-- FORTUNE BOX SEED DATA
-- ========================================

-- Insert 4 Tiers (가격/보상 업데이트)
INSERT OR IGNORE INTO tiers (id, tier_code, tier_name, tier_name_en, subtitle, price, max_reward, color_scheme, is_best_choice, display_order, is_active) VALUES
(1, 'BRONZE', 'Bronze Box', 'Bronze Box', 'Entry Level', 5000, 1000000, 'bronze', 0, 1, 1),
(2, 'GOLD', 'Gold Box', 'Gold Box', 'Most Popular', 10000, 10000000, 'gold', 1, 2, 1),
(3, 'PLATINUM', 'Platinum Box', 'Platinum Box', 'VIP Access', 30000, 50000000, 'platinum', 0, 3, 1),
(4, 'DIAMOND', 'Diamond Box', 'Diamond Box', 'High Roller Only', 50000, 100000000, 'diamond', 0, 4, 1);

-- Insert Sample Rewards for BRONZE Tier (Max 100만원)
INSERT OR IGNORE INTO rewards (tier_id, reward_name, reward_name_en, reward_value, probability, is_jackpot, display_order, is_active) VALUES
-- BRONZE (총 확률 1.0 = 100%)
(1, '스타벅스 기프티콘', 'Starbucks Gift Card', 10000, 0.50, 0, 1, 1),
(1, '올리브영 상품권 10만원', 'Olive Young 100K', 100000, 0.30, 0, 2, 1),
(1, '애플 에어팟 프로', 'Apple AirPods Pro', 300000, 0.15, 0, 3, 1),
(1, '명품 지갑 (루이비통)', 'LV Wallet', 1000000, 0.05, 1, 4, 1);

-- Insert Sample Rewards for GOLD Tier (Max 1,000만원)
INSERT OR IGNORE INTO rewards (tier_id, reward_name, reward_name_en, reward_value, probability, is_jackpot, display_order, is_active) VALUES
-- GOLD (총 확률 1.0 = 100%)
(2, '백화점 상품권 100만원', 'Department Store 1M', 1000000, 0.40, 0, 1, 1),
(2, '애플 아이패드 프로', 'Apple iPad Pro', 1200000, 0.35, 0, 2, 1),
(2, '명품 가방 (구찌)', 'Gucci Bag', 5000000, 0.20, 0, 3, 1),
(2, '롤렉스 서브마리너', 'Rolex Submariner', 10000000, 0.05, 1, 4, 1);

-- Insert Sample Rewards for PLATINUM Tier (Max 5,000만원)
INSERT OR IGNORE INTO rewards (tier_id, reward_name, reward_name_en, reward_value, probability, is_jackpot, display_order, is_active) VALUES
-- PLATINUM (총 확률 1.0 = 100%)
(3, '명품 시계 (오메가)', 'Omega Seamaster', 5000000, 0.50, 0, 1, 1),
(3, '에르메스 버킨백 25', 'Hermes Birkin 25', 15000000, 0.30, 0, 2, 1),
(3, '롤렉스 데이토나', 'Rolex Daytona', 30000000, 0.15, 1, 3, 1),
(3, '람보르기니 우라칸 1개월 렌탈', 'Lamborghini Huracan Rental', 50000000, 0.05, 1, 4, 1);

-- Insert Sample Rewards for DIAMOND Tier
INSERT OR IGNORE INTO rewards (tier_id, reward_name, reward_name_en, reward_value, probability, is_jackpot, display_order, is_active) VALUES
-- DIAMOND (총 확률 1.0 = 100%)
(4, '명품 시계 세트 (파텍필립)', 'Patek Philippe Set', 30000000, 0.50, 0, 1, 1),
(4, '람보르기니 우라칸 (신차)', 'Lamborghini Huracan New', 50000000, 0.30, 1, 2, 1),
(4, '롤스로이스 고스트 (신차)', 'Rolls-Royce Ghost New', 70000000, 0.15, 1, 3, 1),
(4, '강남 아파트 1년 월세 지원', 'Gangnam Apt 1Y Rent', 100000000, 0.05, 1, 4, 1);

-- Insert Sample Admin User (username: admin, password: admin123 - MUST CHANGE IN PRODUCTION)
-- Password hash generated with bcrypt: admin123 -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT OR IGNORE INTO admin_users (id, username, password_hash, role, is_active) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'super_admin', 1);
