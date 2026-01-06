import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';

// Import routes
import tiers from './routes/tiers';
import orders from './routes/orders';
import shipping from './routes/shipping';

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware for API routes
app.use('/api/*', cors());

// API routes
app.route('/api/tiers', tiers);
app.route('/api/orders', orders);
app.route('/api/shipping', shipping);

// Serve static files (CSS, JS, images)
app.use('/static/*', serveStatic({ root: './public' }));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Default route - Splash Screen (auto-redirect to /home after 2s)
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FORTUNE BOX - Break Your Fortune, Unlock Luxury</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #000000;
                color: #D4AF37;
                overflow-x: hidden;
            }

            /* Splash Screen */
            .splash-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }

            .emblem-container {
                position: relative;
                animation: floatIn 1.5s ease-out;
            }

            .emblem {
                width: 200px;
                height: 200px;
                border: 3px solid #D4AF37;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
                position: relative;
                animation: pulse 2s ease-in-out infinite;
            }

            .emblem::before {
                content: '';
                position: absolute;
                width: 220px;
                height: 220px;
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 50%;
            }

            .emblem-content {
                text-align: center;
            }

            .crown {
                font-size: 48px;
                margin-bottom: 10px;
            }

            .emblem-text {
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 2px;
                color: #D4AF37;
            }

            .brand-name {
                margin-top: 40px;
                text-align: center;
            }

            .brand-name h1 {
                font-size: 28px;
                font-weight: 300;
                letter-spacing: 8px;
                margin-bottom: 10px;
                color: #D4AF37;
                animation: fadeIn 2s ease-out 0.5s both;
            }

            .brand-name .tagline {
                font-size: 14px;
                font-weight: 300;
                font-style: italic;
                color: rgba(212, 175, 55, 0.8);
                animation: fadeIn 2s ease-out 1s both;
            }

            .loading-ring {
                margin-top: 60px;
                width: 60px;
                height: 60px;
                border: 3px solid rgba(212, 175, 55, 0.2);
                border-top-color: #D4AF37;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .particles {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
            }

            .particle {
                position: absolute;
                width: 2px;
                height: 2px;
                background: #D4AF37;
                border-radius: 50%;
                animation: float 3s ease-in-out infinite;
                opacity: 0.5;
            }

            @keyframes floatIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) translateX(20px);
                    opacity: 0;
                }
            }
        </style>
    </head>
    <body>
        <!-- Splash Screen -->
        <div class="splash-screen" id="splash">
            <div class="particles" id="particles"></div>
            
            <div class="emblem-container">
                <div class="emblem">
                    <div class="emblem-content">
                        <div class="crown">👑</div>
                        <div class="emblem-text">FORTUNE<br>BOX</div>
                    </div>
                </div>
            </div>

            <div class="brand-name">
                <h1>포춘박스</h1>
                <div class="tagline">Break Your Fortune, Unlock Luxury</div>
            </div>

            <div class="loading-ring"></div>
        </div>

        <script>
            // Create particles
            function createParticles() {
                const container = document.getElementById('particles');
                for (let i = 0; i < 30; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 3 + 's';
                    particle.style.animationDuration = (2 + Math.random() * 3) + 's';
                    container.appendChild(particle);
                }
            }

            createParticles();

            // Auto redirect to home after 2 seconds
            setTimeout(() => {
                window.location.href = '/home';
            }, 2000);
        </script>
    </body>
    </html>
  `);
});

// Home screen - Main tier selection
app.get('/home', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Choose Your Fortune - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
            }

            .header-title {
                font-size: 32px;
                font-weight: 300;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: #D4AF37;
                text-align: center;
                margin: 30px 0;
                text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            }

            .tier-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
            }

            .tier-card {
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
                border: 2px solid rgba(212, 175, 55, 0.3);
                border-radius: 16px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .tier-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .tier-card:hover {
                border-color: #D4AF37;
                transform: translateY(-5px);
                box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
            }

            .tier-card:hover::before {
                opacity: 1;
            }

            .best-choice-badge {
                position: absolute;
                top: -10px;
                right: -10px;
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5);
            }

            .tier-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                font-size: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .tier-name {
                font-size: 24px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 8px;
                color: #D4AF37;
            }

            .tier-subtitle {
                font-size: 12px;
                text-align: center;
                color: rgba(212, 175, 55, 0.7);
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }

            .tier-price {
                font-size: 28px;
                font-weight: 700;
                text-align: center;
                color: #ffffff;
                margin-bottom: 8px;
            }

            .tier-max-reward {
                font-size: 14px;
                text-align: center;
                color: rgba(212, 175, 55, 0.8);
                margin-bottom: 20px;
            }

            .tier-cta {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 12px 24px;
                border-radius: 8px;
                text-align: center;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 1px;
                border: none;
                width: 100%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .tier-cta:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            }

            .bottom-nav {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.2) 100%);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(212, 175, 55, 0.3);
                display: flex;
                justify-content: space-around;
                padding: 16px 0;
            }

            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: rgba(212, 175, 55, 0.6);
                font-size: 12px;
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .nav-item.active,
            .nav-item:hover {
                color: #D4AF37;
            }

            .nav-item i {
                font-size: 24px;
                margin-bottom: 4px;
            }

            /* Color schemes */
            .tier-bronze .tier-icon { color: #CD7F32; }
            .tier-gold .tier-icon { color: #FFD700; }
            .tier-platinum .tier-icon { color: #E5E4E2; }
            .tier-diamond .tier-icon { color: #B9F2FF; }

            .logo {
                text-align: center;
                padding: 20px 0 10px;
            }

            .logo-text {
                font-size: 18px;
                font-weight: 300;
                letter-spacing: 3px;
                color: #D4AF37;
            }
        </style>
    </head>
    <body>
        <div class="logo">
            <div class="logo-text">FORTUNE BOX</div>
        </div>

        <h1 class="header-title">Choose Your Fortune</h1>

        <div class="tier-grid" id="tierGrid">
            <!-- Tier cards will be loaded dynamically -->
            <div style="grid-column: 1 / -1; text-align: center; color: #D4AF37; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 16px;">Loading tiers...</p>
            </div>
        </div>

        <div style="height: 100px;"></div>

        <div class="bottom-nav">
            <a href="/home" class="nav-item active">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="/history" class="nav-item">
                <i class="fas fa-history"></i>
                <span>History</span>
            </a>
            <a href="/profile" class="nav-item">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </a>
        </div>

        <script>
            // Format currency
            function formatCurrency(amount) {
                return '₩' + amount.toLocaleString('ko-KR');
            }

            // Get color scheme emoji
            function getTierIcon(colorScheme) {
                const icons = {
                    'bronze': '🥉',
                    'gold': '🥇',
                    'platinum': '💎',
                    'diamond': '💠'
                };
                return icons[colorScheme] || '🎁';
            }

            // Load tiers
            async function loadTiers() {
                try {
                    const response = await fetch('/api/tiers');
                    const result = await response.json();

                    if (result.success && result.data) {
                        renderTiers(result.data);
                    } else {
                        console.error('Failed to load tiers:', result.error);
                    }
                } catch (error) {
                    console.error('Error loading tiers:', error);
                }
            }

            // Render tiers
            function renderTiers(tiers) {
                const grid = document.getElementById('tierGrid');
                grid.innerHTML = tiers.map(tier => \`
                    <div class="tier-card tier-\${tier.color_scheme}" onclick="goToTierDetail('\${tier.tier_code}')">
                        \${tier.is_best_choice ? '<div class="best-choice-badge">BEST CHOICE</div>' : ''}
                        
                        <div class="tier-icon">
                            \${getTierIcon(tier.color_scheme)}
                        </div>

                        <div class="tier-name">\${tier.tier_name_en}</div>
                        <div class="tier-subtitle">\${tier.subtitle}</div>

                        <div class="tier-price">\${formatCurrency(tier.price)}</div>
                        <div class="tier-max-reward">Max Reward: \${formatCurrency(tier.max_reward)}</div>

                        <button class="tier-cta">View Details</button>
                    </div>
                \`).join('');
            }

            // Go to tier detail
            function goToTierDetail(tierCode) {
                window.location.href = '/tier/' + tierCode;
            }

            // Load on page load
            loadTiers();
        </script>
    </body>
    </html>
  `);
});

// Tier detail page
app.get('/tier/:code', async (c) => {
  const tierCode = c.req.param('code');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tier Detail - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 80px;
            }

            .header {
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .back-btn {
                color: #D4AF37;
                font-size: 20px;
                cursor: pointer;
            }

            .header-title {
                font-size: 24px;
                font-weight: 600;
                color: #D4AF37;
            }

            .tier-summary {
                padding: 30px 20px;
                text-align: center;
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
                border-bottom: 2px solid rgba(212, 175, 55, 0.3);
            }

            .tier-icon-large {
                font-size: 80px;
                margin-bottom: 16px;
            }

            .tier-name-large {
                font-size: 32px;
                font-weight: 700;
                color: #D4AF37;
                margin-bottom: 8px;
            }

            .tier-subtitle-large {
                font-size: 14px;
                color: rgba(212, 175, 55, 0.7);
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 20px;
            }

            .tier-price-large {
                font-size: 36px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 8px;
            }

            .tier-max-large {
                font-size: 16px;
                color: rgba(212, 175, 55, 0.8);
            }

            .trust-badges {
                display: flex;
                justify-content: space-around;
                padding: 20px;
                background: rgba(212, 175, 55, 0.05);
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }

            .trust-badge {
                text-align: center;
                flex: 1;
            }

            .trust-icon {
                font-size: 24px;
                color: #D4AF37;
                margin-bottom: 8px;
            }

            .trust-text {
                font-size: 10px;
                color: rgba(212, 175, 55, 0.8);
                line-height: 1.4;
            }

            .section-title {
                font-size: 20px;
                font-weight: 600;
                color: #D4AF37;
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }

            .rewards-list {
                padding: 20px;
            }

            .reward-item {
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(40, 40, 40, 0.6) 100%);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .reward-icon {
                font-size: 32px;
                min-width: 50px;
                text-align: center;
            }

            .reward-info {
                flex: 1;
            }

            .reward-name {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 4px;
            }

            .reward-value {
                font-size: 14px;
                color: #D4AF37;
                margin-bottom: 4px;
            }

            .reward-probability {
                font-size: 12px;
                color: rgba(212, 175, 55, 0.7);
            }

            .jackpot-badge {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 700;
                margin-left: 8px;
            }

            .refund-policy {
                padding: 20px;
                background: rgba(212, 175, 55, 0.05);
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                margin-top: 20px;
            }

            .refund-policy h3 {
                font-size: 16px;
                font-weight: 600;
                color: #D4AF37;
                margin-bottom: 12px;
            }

            .refund-policy ul {
                list-style: none;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.8;
            }

            .refund-policy li {
                padding-left: 20px;
                position: relative;
            }

            .refund-policy li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #D4AF37;
            }

            .action-buttons {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 16px 20px;
                background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.95) 20%);
                display: flex;
                gap: 12px;
            }

            .btn {
                flex: 1;
                padding: 16px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                text-align: center;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
            }

            .btn-primary:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            }

            .btn-secondary {
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                color: #D4AF37;
            }

            .btn-secondary:hover {
                background: rgba(212, 175, 55, 0.2);
            }
        </style>
    </head>
    <body>
        <div class="header">
            <i class="fas fa-arrow-left back-btn" onclick="history.back()"></i>
            <div class="header-title" id="headerTitle">Tier Details</div>
            <div style="width: 20px;"></div>
        </div>

        <div id="tierContent">
            <!-- Content will be loaded dynamically -->
            <div style="text-align: center; padding: 60px 20px; color: #D4AF37;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 16px;">Loading...</p>
            </div>
        </div>

        <script>
            const tierCode = '${tierCode}';

            // Format currency
            function formatCurrency(amount) {
                return '₩' + amount.toLocaleString('ko-KR');
            }

            // Format probability
            function formatProbability(prob) {
                return (prob * 100).toFixed(2) + '%';
            }

            // Get tier icon
            function getTierIcon(colorScheme) {
                const icons = {
                    'bronze': '🥉',
                    'gold': '🥇',
                    'platinum': '💎',
                    'diamond': '💠'
                };
                return icons[colorScheme] || '🎁';
            }

            // Get reward icon
            function getRewardIcon(rewardName) {
                if (rewardName.includes('롤렉스') || rewardName.includes('Rolex')) return '⌚';
                if (rewardName.includes('에르메스') || rewardName.includes('Hermes')) return '👜';
                if (rewardName.includes('람보르기니') || rewardName.includes('Lamborghini')) return '🏎️';
                if (rewardName.includes('아파트') || rewardName.includes('Apt')) return '🏠';
                if (rewardName.includes('시계')) return '⌚';
                if (rewardName.includes('가방')) return '👜';
                if (rewardName.includes('상품권') || rewardName.includes('기프티콘')) return '🎁';
                return '✨';
            }

            // Load tier data
            async function loadTierData() {
                try {
                    const response = await fetch('/api/tiers/' + tierCode);
                    const result = await response.json();

                    if (result.success && result.data) {
                        renderTierDetail(result.data);
                    } else {
                        console.error('Failed to load tier:', result.error);
                    }
                } catch (error) {
                    console.error('Error loading tier:', error);
                }
            }

            // Render tier detail
            function renderTierDetail(tier) {
                document.getElementById('headerTitle').textContent = tier.tier_name_en;
                
                const content = \`
                    <div class="tier-summary">
                        <div class="tier-icon-large">\${getTierIcon(tier.color_scheme)}</div>
                        <div class="tier-name-large">\${tier.tier_name_en}</div>
                        <div class="tier-subtitle-large">\${tier.subtitle}</div>
                        <div class="tier-price-large">\${formatCurrency(tier.price)}</div>
                        <div class="tier-max-large">Max Reward: \${formatCurrency(tier.max_reward)}</div>
                    </div>

                    <div class="trust-badges">
                        <div class="trust-badge">
                            <div class="trust-icon"><i class="fas fa-chart-pie"></i></div>
                            <div class="trust-text">투명한<br>확률 공개</div>
                        </div>
                        <div class="trust-badge">
                            <div class="trust-icon"><i class="fas fa-certificate"></i></div>
                            <div class="trust-text">100% 정품<br>실물 보상</div>
                        </div>
                        <div class="trust-badge">
                            <div class="trust-icon"><i class="fas fa-shield-alt"></i></div>
                            <div class="trust-text">합법적·안전<br>플로우</div>
                        </div>
                    </div>

                    <div class="section-title">Available Rewards</div>

                    <div class="rewards-list">
                        \${tier.rewards.map(reward => \`
                            <div class="reward-item">
                                <div class="reward-icon">\${getRewardIcon(reward.reward_name)}</div>
                                <div class="reward-info">
                                    <div class="reward-name">
                                        \${reward.reward_name}
                                        \${reward.is_jackpot ? '<span class="jackpot-badge">JACKPOT</span>' : ''}
                                    </div>
                                    <div class="reward-value">\${formatCurrency(reward.reward_value)}</div>
                                    <div class="reward-probability">확률: \${formatProbability(reward.probability)}</div>
                                </div>
                            </div>
                        \`).join('')}
                    </div>

                    <div class="refund-policy">
                        <h3><i class="fas fa-info-circle"></i> 환불 정책</h3>
                        <ul>
                            <li>박스 깨기 전: 환불 가능</li>
                            <li>박스 깬 후: 환불 불가</li>
                            <li>배송 시작 후: 환불 불가</li>
                        </ul>
                    </div>

                    <div style="height: 80px;"></div>
                \`;

                document.getElementById('tierContent').innerHTML = content;
            }

            // Go to checkout
            function goToCheckout() {
                // Create order and go to checkout
                createOrder(tierCode);
            }

            // Create order
            async function createOrder(tierCode) {
                try {
                    const response = await fetch('/api/orders/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tier_code: tierCode })
                    });

                    const result = await response.json();

                    if (result.success && result.data) {
                        // Go to checkout page
                        window.location.href = '/checkout/' + result.data.order_id;
                    } else {
                        alert('주문 생성 실패: ' + result.error);
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    alert('주문 생성 중 오류가 발생했습니다.');
                }
            }

            // Load on page load
            loadTierData();
        </script>

        <div class="action-buttons">
            <button class="btn btn-secondary" onclick="history.back()">다른 티어 보기</button>
            <button class="btn btn-primary" onclick="goToCheckout()">결제하기</button>
        </div>
    </body>
    </html>
  `);
});

export default app;
