# 🎰 FORTUNE BOX MVP

**"Break Your Fortune, Unlock Luxury"**

포춘박스는 프리미엄 랜덤박스 커머스 플랫폼입니다. 망치로 포춘쿠키를 깨뜨려 럭셔리 보상을 획득하는 독특한 게이미피케이션 경험을 제공합니다.

---

## 🌐 라이브 URL

- **Sandbox Demo**: https://3000-isudinvs6hwxhy8jz22wy-3844e1b6.sandbox.novita.ai
- **GitHub Repository**: https://github.com/Rachel-88-mj/fortune-box

---

## 🎯 프로젝트 개요

### 핵심 컨셉
- **타깃**: 30~50대 남성 / 사업가·자산가·전문직 / 연소득 1억+ 또는 자산 10억+
- **슬로건**: "Break Your Fortune, Unlock Luxury"
- **브랜드 톤**: Black & Gold 프리미엄
- **핵심 경험**: 망치로 박스를 깨뜨리는 디지털 리츄얼 + 실물 럭셔리 자산 획득

### 현재 구현된 기능 ✅

#### 사용자 플로우
1. **Splash 화면** (`/`)
   - Black & Gold 엠블럼
   - 2초 후 자동 리다이렉트

2. **Home 화면** (`/home`)
   - 4개 티어 카드 그리드
   - Bronze (₩5,000) → Gold (₩10,000) → Platinum (₩30,000) → Diamond (₩50,000)
   - BEST CHOICE 뱃지 (Gold)

3. **Tier 상세** (`/tier/:code`)
   - 확률/리워드 투명 공개
   - 신뢰 배지 3개 (투명한 확률 공개 / 100% 정품 실물 보상 / 합법적·안전 플로우)
   - 환불 정책 안내

4. **Checkout** (`/checkout/:orderId`)
   - 주문 요약
   - 필수 동의 항목 (확률 확인 / 환불 정책 / 개인정보)
   - 결제 진행

5. **Break** (`/break/:orderId`)
   - 망치 타격 애니메이션
   - "BREAKING YOUR FORTUNE..." 타이틀
   - TAP TO BREAK 버튼
   - 금가루 파티클 효과

6. **Reward Reveal** (`/reward/:orderId`)
   - "운이 자산이 되는 순간"
   - 리워드 카드 표시
   - JACKPOT 뱃지 (해당시)
   - 배송지 입력 연결

7. **Shipping** (`/shipping/:orderId`)
   - 배송지 정보 입력 폼
   - 수령인/연락처/주소/메모

8. **History** (`/history`)
   - 주문 히스토리 리스트
   - 상태별 필터링
   - 환불 버튼 (조건부 표시)

9. **Profile** (`/profile`)
   - FAQ
   - 고객 지원
   - 이용약관/개인정보처리방침

#### API 엔드포인트

**Tiers API**
- `GET /api/tiers` - 티어 목록
- `GET /api/tiers/:code` - 티어 상세 + 리워드
- `GET /api/tiers/:code/probabilities` - 확률 공개

**Orders API**
- `POST /api/orders/create` - 주문 생성
- `POST /api/orders/:orderId/payment` - 결제 처리
- `POST /api/orders/:orderId/break` - 박스 깨기
- `GET /api/orders/:orderId` - 주문 상세
- `POST /api/orders/:orderId/refund` - 환불 요청
- `GET /api/orders` - 주문 히스토리

**Shipping API**
- `POST /api/shipping` - 배송지 정보 제출
- `GET /api/shipping/:orderId` - 배송지 정보 조회

#### 트래킹 이벤트 (10개)
1. `landing_view` - 랜딩 페이지 진입
2. `tier_click` - 티어 카드 클릭
3. `probability_view` - 확률 공개 페이지 조회
4. `checkout_start` - 결제 시작
5. `payment_success` - 결제 성공
6. `payment_fail` - 결제 실패
7. `break_box_start` - 박스 깨기 시작
8. `reward_reveal` - 리워드 공개
9. `shipping_submit` - 배송지 정보 제출
10. `refund_request` / `refund_success` - 환불 요청/성공

---

## 💰 티어 가격 및 최대 보상

| 티어 | 가격 | 최대 보상 | 특징 |
|------|------|-----------|------|
| **Bronze Box** | ₩5,000 | ₩1,000,000 | Entry Level |
| **Gold Box** | ₩10,000 | ₩10,000,000 | Most Popular (BEST CHOICE) |
| **Platinum Box** | ₩30,000 | ₩50,000,000 | VIP Access |
| **Diamond Box** | ₩50,000 | ₩100,000,000 | High Roller Only |

---

## 🗄️ 데이터 아키텍처

### Cloudflare D1 Database (SQLite)

**Tables:**
- `users` - 사용자 계정 (향후 확장)
- `tiers` - 4개 고정 티어
- `rewards` - 티어별 리워드 아이템 + 확률
- `orders` - 주문/결제/환불 정보
- `shipping` - 배송지 정보
- `analytics_events` - 트래킹 이벤트
- `admin_users` - 어드민 계정

**주요 관계:**
- 1 Tier → N Rewards (확률 합계 1.0)
- 1 Order → 1 Tier
- 1 Order → 1 Reward (after break)
- 1 Order → 1 Shipping

---

## 🛠️ 기술 스택

### Frontend
- **CDN 라이브러리**:
  - Tailwind CSS (스타일링)
  - Font Awesome (아이콘)
  - Cormorant Garamond 폰트 (프리미엄 세리프)

### Backend
- **Hono** (v4.11.3) - Lightweight web framework
- **Cloudflare Workers** - Edge runtime
- **Cloudflare D1** - SQLite database (로컬 개발 + 프로덕션)

### DevOps
- **Vite** (v6.4.1) - Build tool
- **Wrangler** (v4.54.0) - Cloudflare CLI
- **PM2** - Process manager (sandbox 환경)
- **TypeScript** - Type safety

---

## 🚀 로컬 개발

### 1. 설치
```bash
cd /home/user/fortune-box
npm install
```

### 2. 데이터베이스 설정
```bash
# 마이그레이션 실행
npm run db:migrate:local

# 시드 데이터 삽입
npm run db:seed

# 데이터베이스 리셋 (개발 중)
npm run db:reset
```

### 3. 개발 서버 시작
```bash
# 빌드
npm run build

# PM2로 시작
pm2 start ecosystem.config.cjs

# 또는 직접 실행 (blocking)
npm run dev:sandbox
```

### 4. 테스트
```bash
# 헬스 체크
curl http://localhost:3000/health

# 티어 API
curl http://localhost:3000/api/tiers
```

---

## 📦 환불 정책

**환불 가능:**
- ✅ 박스 깨기 전 (status = 'paid' AND is_broken = 0)

**환불 불가:**
- ❌ 박스 깬 후 (is_broken = 1)
- ❌ 배송 시작 후 (status = 'shipping' 이상)
- ❌ 이미 환불된 주문 (status = 'refunded')

---

## 📱 화면 구성 요약

### 완료된 화면 (9개)
1. ✅ Splash - 2초 스플래시 + 자동 리다이렉트
2. ✅ Home - 4개 티어 카드 그리드
3. ✅ Tier Detail - 확률/리워드 공개
4. ✅ Checkout - 결제 확인
5. ✅ Break - 망치 타격 애니메이션
6. ✅ Reward Reveal - 리워드 공개
7. ✅ Shipping - 배송지 입력
8. ✅ History - 주문 히스토리 + 환불
9. ✅ Profile - FAQ/고객지원

### 미구현 (선택 사항)
- ⏳ Admin Dashboard (티어/리워드/확률 관리)
- ⏳ VIP 라운지 오프라인 개봉 의식 (후속 기능)

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Gold**: `#D4AF37`
- **Light Gold**: `#FFD700`
- **Pure Black**: `#000000`
- **Dark Gray**: `#1a1a1a` / `#282828`
- **White**: `#ffffff`

### 타이포그래피
- **Font Family**: Cormorant Garamond (Google Fonts)
- **Heading**: 대문자 + Letter Spacing + Gold
- **Body**: 고딕 (한글) + Serif (영문)

### 애니메이션
- `pulse` - 텍스트 발광 효과
- `float` - 부유 효과
- `hammerStrike` - 망치 타격
- `explode` - 파티클 폭발

---

## 🔧 주요 스크립트

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --d1=fortune-box-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "deploy": "npm run build && wrangler pages deploy dist --project-name fortune-box",
  "db:migrate:local": "wrangler d1 migrations apply fortune-box-production --local",
  "db:seed": "wrangler d1 execute fortune-box-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true"
}
```

---

## 📊 다음 단계 (권장)

### 우선순위 높음
1. **실제 결제 게이트웨이 통합** (현재 95% 성공률 시뮬레이션)
2. **사용자 인증/로그인** (현재는 세션 기반)
3. **어드민 대시보드** (티어/리워드/확률 관리)

### 우선순위 중간
4. **이메일 알림** (결제 성공/배송 시작)
5. **푸시 알림** (배송 완료)
6. **리워드 이미지 업로드** (현재는 이모지)

### 우선순위 낮음 (장기)
7. **VIP 라운지 오프라인 개봉** (프라이빗 의식)
8. **소셜 공유** (SNS 연동)
9. **추천인 시스템** (친구 초대)

---

## 👤 주요 페르소나

**The Fortune Breaker - 김진수 (47세)**
- 직업: 사업가 / 자산가
- 연소득: 1억+ / 자산: 10억+
- 니즈: 짧고 강렬한 경험, 특별한 획득 과정
- 페인 포인트: 지루함, 기존 랜덤박스 확률 불신, 카지노 접근 제한
- 명언: _"돈은 충분합니다. 이제는 남들과 다른 특별한 경험이 필요해요."_

---

## 📝 배포 상태

- ✅ **로컬 개발**: PM2 + Wrangler (포트 3000)
- ⏳ **Cloudflare Pages**: 배포 예정
- ⏳ **GitHub**: 레포지토리 연동 예정

---

## 🔗 유용한 링크

- **Hono Documentation**: https://hono.dev
- **Cloudflare D1 Docs**: https://developers.cloudflare.com/d1
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages

---

## 📄 라이선스

© 2026 Fortune Box. All rights reserved.

---

**마지막 업데이트**: 2026-01-06  
**버전**: v1.0.0 MVP  
**개발자**: Fortune Box Team
