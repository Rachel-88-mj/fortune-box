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
app.use('/images/*', serveStatic({ root: './public' }));

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

            /* Splash Screen - New Premium Design */
            .splash-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(180deg, #1a2332 0%, #0a0e1a 50%, #000000 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 60px 20px 40px;
                z-index: 9999;
                overflow: hidden;
            }

            /* Decorative background pattern */
            .splash-screen::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
                pointer-events: none;
            }

            /* Header with Crown and Title */
            .splash-header {
                text-align: center;
                z-index: 1;
                animation: fadeInDown 1s ease-out;
            }

            .splash-crown {
                font-size: 56px;
                margin-bottom: 16px;
                animation: float 3s ease-in-out infinite;
                filter: drop-shadow(0 4px 20px rgba(212, 175, 55, 0.5));
            }

            .splash-title {
                font-size: 48px;
                font-weight: 700;
                letter-spacing: 8px;
                color: #D4AF37;
                text-shadow: 0 2px 20px rgba(212, 175, 55, 0.6);
                margin-bottom: 8px;
            }

            .splash-badge {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(212, 175, 55, 0.15);
                border: 1px solid #D4AF37;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 2px;
                color: #D4AF37;
                text-transform: uppercase;
            }

            /* Main Visual - Fortune Cookie */
            .splash-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-width: 500px;
                position: relative;
                z-index: 1;
            }

            .fortune-container {
                position: relative;
                width: 100%;
                max-width: 400px;
                animation: scaleIn 1.2s ease-out 0.3s both;
            }

            .fortune-cookie-halves {
                position: relative;
                width: 100%;
                padding-bottom: 100%;
            }

            .cookie-half {
                position: absolute;
                width: 52%;
                height: 100%;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #D4AF37 100%);
                border-radius: 50%;
                box-shadow: 
                    0 20px 60px rgba(212, 175, 55, 0.4),
                    inset 0 -10px 30px rgba(0, 0, 0, 0.3),
                    inset 0 10px 30px rgba(255, 255, 255, 0.3);
            }

            .cookie-half-left {
                left: 0;
                transform: rotate(-5deg);
                animation: cookieOpenLeft 1.5s ease-out 0.5s both;
            }

            .cookie-half-right {
                right: 0;
                transform: rotate(5deg);
                animation: cookieOpenRight 1.5s ease-out 0.5s both;
            }

            /* Ornamental pattern overlay */
            .cookie-half::before {
                content: '';
                position: absolute;
                top: 10%;
                left: 10%;
                right: 10%;
                bottom: 10%;
                background-image: repeating-radial-gradient(
                    circle at center,
                    transparent 0,
                    transparent 8px,
                    rgba(255, 255, 255, 0.1) 8px,
                    rgba(255, 255, 255, 0.1) 10px
                );
                border-radius: 50%;
            }

            /* Items inside cookie */
            .cookie-items {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: center;
                animation: itemsReveal 1s ease-out 1.2s both;
                z-index: 2;
            }

            .cookie-item {
                font-size: 32px;
                animation: float 2.5s ease-in-out infinite;
                filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.6));
            }

            .cookie-item:nth-child(2) {
                animation-delay: 0.3s;
            }

            .cookie-item:nth-child(3) {
                animation-delay: 0.6s;
            }

            /* Hammer */
            .splash-hammer {
                position: absolute;
                top: -10%;
                right: -5%;
                font-size: 72px;
                transform: rotate(-25deg);
                animation: hammerFloat 2s ease-in-out infinite;
                filter: drop-shadow(0 8px 24px rgba(212, 175, 55, 0.5));
                z-index: 3;
            }

            /* Subtitle */
            .splash-subtitle {
                margin-top: 40px;
                text-align: center;
                animation: fadeIn 1s ease-out 1.5s both;
            }

            .splash-subtitle h2 {
                font-size: 24px;
                font-weight: 700;
                color: #FFFFFF;
                margin-bottom: 12px;
                letter-spacing: 1px;
            }

            .splash-subtitle p {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
            }

            /* CTA Button */
            .splash-cta {
                width: 100%;
                max-width: 400px;
                z-index: 1;
                animation: fadeInUp 1s ease-out 1.8s both;
            }

            .splash-btn {
                width: 100%;
                padding: 18px 32px;
                background: linear-gradient(135deg, #2c8e9e 0%, #1a5f6e 100%);
                color: #FFFFFF;
                font-size: 18px;
                font-weight: 700;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 24px rgba(44, 142, 158, 0.4);
                letter-spacing: 1px;
            }

            .splash-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(44, 142, 158, 0.6);
            }

            .splash-btn:active {
                transform: translateY(0);
            }

            /* Footer */
            .splash-footer {
                text-align: center;
                font-size: 11px;
                color: rgba(255, 255, 255, 0.4);
                z-index: 1;
                animation: fadeIn 1s ease-out 2s both;
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

            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes cookieOpenLeft {
                from {
                    transform: translateX(0) rotate(0deg);
                }
                to {
                    transform: translateX(-20px) rotate(-15deg);
                }
            }

            @keyframes cookieOpenRight {
                from {
                    transform: translateX(0) rotate(0deg);
                }
                to {
                    transform: translateX(20px) rotate(15deg);
                }
            }

            @keyframes itemsReveal {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes hammerFloat {
                0%, 100% {
                    transform: translateY(0) rotate(-25deg);
                }
                50% {
                    transform: translateY(-10px) rotate(-20deg);
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
            
            <!-- Header -->
            <div class="splash-header">
                <div class="splash-crown">👑</div>
                <div class="splash-title">포춘박스</div>
                <span class="splash-badge">NEW SEASON</span>
            </div>

            <!-- Main Visual -->
            <div class="splash-main">
                <div class="fortune-container">
                    <div class="fortune-cookie-halves">
                        <!-- Left Cookie Half -->
                        <div class="cookie-half cookie-half-left"></div>
                        
                        <!-- Right Cookie Half -->
                        <div class="cookie-half cookie-half-right"></div>
                        
                        <!-- Items Inside -->
                        <div class="cookie-items">
                            <span class="cookie-item">💎</span>
                            <span class="cookie-item">⌚</span>
                            <span class="cookie-item">🏆</span>
                        </div>
                    </div>
                    
                    <!-- Hammer -->
                    <div class="splash-hammer">🔨</div>
                </div>

                <!-- Subtitle -->
                <div class="splash-subtitle">
                    <h2>운이 자산이 되는 순간</h2>
                    <p>최고급 명품을 랜덤으로 만나보는 특별한 경험</p>
                </div>
            </div>

            <!-- CTA Button -->
            <div class="splash-cta">
                <button class="splash-btn" onclick="window.location.href='/home'">
                    지금 바로 깨기
                </button>
            </div>

            <!-- Footer -->
            <div class="splash-footer">
                © 2024 FORTUNE BOX. ALL RIGHTS RESERVED.
            </div>
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
                width: 120px;
                height: 120px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .tier-icon img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 15px rgba(212, 175, 55, 0.3));
                transition: transform 0.3s ease;
            }

            .tier-card:hover .tier-icon img {
                transform: scale(1.1) rotate(5deg);
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

            // Get tier image
            function getTierImage(colorScheme) {
                const images = {
                    'bronze': '/images/bronze-box.png',
                    'gold': '/images/gold-box.png',
                    'platinum': '/images/platinum-box.png',
                    'diamond': '/images/diamond-box.png'
                };
                return images[colorScheme] || '/images/gold-box.png';
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
                            <img src="\${getTierImage(tier.color_scheme)}" alt="\${tier.tier_name}">
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
                width: 150px;
                height: 150px;
                margin: 0 auto 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .tier-icon-large img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 8px 30px rgba(212, 175, 55, 0.5));
                animation: float 3s ease-in-out infinite;
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

            // Get tier image
            function getTierImage(colorScheme) {
                const images = {
                    'bronze': '/images/bronze-box.png',
                    'gold': '/images/gold-box.png',
                    'platinum': '/images/platinum-box.png',
                    'diamond': '/images/diamond-box.png'
                };
                return images[colorScheme] || '/images/gold-box.png';
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
                        <div class="tier-icon-large"><img src="\${getTierImage(tier.color_scheme)}" alt="\${tier.tier_name}"></div>
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

// Checkout page
app.get('/checkout/:orderId', async (c) => {
  const orderId = c.req.param('orderId');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checkout - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 100px;
            }

            .header {
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                text-align: center;
            }

            .header-title {
                font-size: 24px;
                font-weight: 600;
                color: #D4AF37;
            }

            .order-summary {
                padding: 30px 20px;
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
                border-bottom: 2px solid rgba(212, 175, 55, 0.3);
                margin: 20px;
                border-radius: 12px;
            }

            .summary-title {
                font-size: 18px;
                font-weight: 600;
                color: #D4AF37;
                margin-bottom: 20px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
            }

            .summary-label {
                color: rgba(255, 255, 255, 0.7);
            }

            .summary-value {
                color: #ffffff;
                font-weight: 600;
            }

            .total-row {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(212, 175, 55, 0.3);
                font-size: 20px;
            }

            .total-row .summary-value {
                color: #D4AF37;
                font-size: 28px;
            }

            .agreement-section {
                padding: 20px;
            }

            .agreement-title {
                font-size: 16px;
                font-weight: 600;
                color: #D4AF37;
                margin-bottom: 16px;
            }

            .checkbox-item {
                display: flex;
                align-items: center;
                padding: 12px;
                background: rgba(212, 175, 55, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 8px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .checkbox-item:hover {
                background: rgba(212, 175, 55, 0.1);
                border-color: rgba(212, 175, 55, 0.4);
            }

            .checkbox-item input[type="checkbox"] {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
            }

            .checkbox-label {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                flex: 1;
            }

            .action-buttons {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 16px 20px;
                background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.95) 20%);
            }

            .btn {
                width: 100%;
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

            .btn-primary:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            }

            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-title">결제 확인</div>
        </div>

        <div id="checkoutContent">
            <div style="text-align: center; padding: 60px 20px; color: #D4AF37;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 16px;">Loading...</p>
            </div>
        </div>

        <script>
            const orderId = '${orderId}';

            function formatCurrency(amount) {
                return '₩' + amount.toLocaleString('ko-KR');
            }

            async function loadOrderData() {
                try {
                    const response = await fetch('/api/orders/' + orderId);
                    const result = await response.json();

                    if (result.success && result.data) {
                        renderCheckout(result.data);
                    } else {
                        alert('주문을 찾을 수 없습니다.');
                        window.location.href = '/home';
                    }
                } catch (error) {
                    console.error('Error loading order:', error);
                }
            }

            function renderCheckout(order) {
                const content = \`
                    <div class="order-summary">
                        <div class="summary-title">주문 요약</div>
                        <div class="summary-row">
                            <span class="summary-label">주문번호</span>
                            <span class="summary-value">\${order.order_number}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">박스 티어</span>
                            <span class="summary-value">\${order.tier?.tier_name || order.tier_code}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">최대 보상</span>
                            <span class="summary-value">\${formatCurrency(order.tier?.max_reward || 0)}</span>
                        </div>
                        <div class="summary-row total-row">
                            <span class="summary-label">결제 금액</span>
                            <span class="summary-value">\${formatCurrency(order.price)}</span>
                        </div>
                    </div>

                    <div class="agreement-section">
                        <div class="agreement-title">필수 동의 사항</div>
                        
                        <label class="checkbox-item">
                            <input type="checkbox" id="agree1" onchange="checkAllAgreements()">
                            <span class="checkbox-label">확률 정보를 모두 확인했습니다</span>
                        </label>

                        <label class="checkbox-item">
                            <input type="checkbox" id="agree2" onchange="checkAllAgreements()">
                            <span class="checkbox-label">환불 정책에 동의합니다 (박스 깨기 전 환불 가능, 깬 후 환불 불가)</span>
                        </label>

                        <label class="checkbox-item">
                            <input type="checkbox" id="agree3" onchange="checkAllAgreements()">
                            <span class="checkbox-label">개인정보 수집 및 배송 정보 제공에 동의합니다</span>
                        </label>
                    </div>
                \`;

                document.getElementById('checkoutContent').innerHTML = content;
            }

            function checkAllAgreements() {
                const agree1 = document.getElementById('agree1').checked;
                const agree2 = document.getElementById('agree2').checked;
                const agree3 = document.getElementById('agree3').checked;
                
                document.getElementById('paymentBtn').disabled = !(agree1 && agree2 && agree3);
            }

            async function processPayment() {
                const btn = document.getElementById('paymentBtn');
                btn.disabled = true;
                btn.textContent = '결제 처리 중...';

                try {
                    const response = await fetch('/api/orders/' + orderId + '/payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            payment_method: 'card',
                            transaction_id: 'TXN-' + Date.now()
                        })
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Redirect to break page
                        window.location.href = '/break/' + orderId;
                    } else {
                        alert('결제 실패: ' + (result.message || result.error));
                        btn.disabled = false;
                        btn.textContent = '결제 진행';
                    }
                } catch (error) {
                    console.error('Payment error:', error);
                    alert('결제 처리 중 오류가 발생했습니다.');
                    btn.disabled = false;
                    btn.textContent = '결제 진행';
                }
            }

            loadOrderData();
        </script>

        <div class="action-buttons">
            <button class="btn btn-primary" id="paymentBtn" onclick="processPayment()" disabled>
                결제 진행
            </button>
        </div>
    </body>
    </html>
  `);
});

// Break page
app.get('/break/:orderId', async (c) => {
  const orderId = c.req.param('orderId');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Break Your Fortune - FORTUNE BOX</title>
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
                overflow: hidden;
            }

            .break-container {
                position: relative;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, #000000 70%);
            }

            .break-title {
                font-size: 32px;
                font-weight: 300;
                letter-spacing: 6px;
                text-transform: uppercase;
                color: #D4AF37;
                margin-bottom: 60px;
                text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
                animation: pulse 2s ease-in-out infinite;
            }

            .fortune-cookie {
                position: relative;
                width: 250px;
                height: 250px;
                margin-bottom: 80px;
            }

            .cookie-icon {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: float 3s ease-in-out infinite;
                filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.4));
            }

            .cookie-icon img {
                width: 200px;
                height: 200px;
                object-fit: contain;
            }

            .hammer {
                position: absolute;
                top: -50px;
                right: -30px;
                width: 100px;
                height: 100px;
                transform: rotate(-45deg);
                animation: hammerStrike 0.8s ease-in-out;
                opacity: 0;
            }

            .hammer img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 15px rgba(212, 175, 55, 0.5));
            }

            .hammer.active {
                animation: hammerStrike 0.8s ease-in-out;
                opacity: 1;
            }

            .tap-button {
                width: 180px;
                height: 180px;
                border-radius: 50%;
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                border: none;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .tap-button::before {
                content: '';
                position: absolute;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                animation: ripple 2s ease-out infinite;
            }

            .tap-button:hover:not(:disabled) {
                transform: scale(1.1);
                box-shadow: 0 15px 50px rgba(212, 175, 55, 0.7);
            }

            .tap-button:active:not(:disabled) {
                transform: scale(0.95);
            }

            .tap-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tap-icon {
                font-size: 48px;
                color: #000;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }

            .tap-text {
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 2px;
                color: #000;
                position: relative;
                z-index: 1;
            }

            .particles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #D4AF37;
                border-radius: 50%;
                animation: explode 1s ease-out forwards;
                opacity: 0;
            }

            @keyframes pulse {
                0%, 100% {
                    text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
                }
                50% {
                    text-shadow: 0 0 50px rgba(212, 175, 55, 0.8);
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-20px) rotate(5deg);
                }
            }

            @keyframes hammerStrike {
                0% {
                    top: -100px;
                    right: -80px;
                    transform: rotate(-90deg);
                    opacity: 0;
                }
                50% {
                    top: 20px;
                    right: 20px;
                    transform: rotate(-20deg);
                    opacity: 1;
                }
                100% {
                    top: -50px;
                    right: -30px;
                    transform: rotate(-45deg);
                    opacity: 0;
                }
            }

            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }

            @keyframes explode {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }

            .breaking-animation {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        </style>
    </head>
    <body>
        <div class="break-container">
            <div class="particles" id="particles"></div>

            <h1 class="break-title">BREAKING YOUR FORTUNE...</h1>

            <div class="fortune-cookie" id="fortuneCookie">
                <div class="cookie-icon" id="cookieIcon">
                    <img src="/images/gold-box.png" alt="Fortune Cookie" id="cookieImage">
                </div>
                <div class="hammer" id="hammer">
                    <img src="/images/hammer.png" alt="Golden Hammer">
                </div>
            </div>

            <button class="tap-button" id="tapButton" onclick="breakBox()">
                <div class="tap-icon">
                    <i class="fas fa-hand-pointer"></i>
                </div>
                <div class="tap-text">TAP TO BREAK</div>
            </button>
        </div>

        <script>
            const orderId = '${orderId}';
            let isBreaking = false;

            async function breakBox() {
                if (isBreaking) return;
                
                isBreaking = true;
                const button = document.getElementById('tapButton');
                const hammer = document.getElementById('hammer');
                const cookie = document.getElementById('fortuneCookie');
                
                button.disabled = true;
                
                // Trigger hammer animation
                hammer.classList.add('active');
                cookie.classList.add('breaking-animation');
                
                // Create explosion particles
                createExplosion();
                
                // Wait for animation
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Call API to break box
                try {
                    const response = await fetch('/api/orders/' + orderId + '/break', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const result = await response.json();

                    if (result.success && result.data) {
                        // Redirect to reward reveal
                        setTimeout(() => {
                            window.location.href = '/reward/' + orderId;
                        }, 1000);
                    } else {
                        alert('Error: ' + result.error);
                        button.disabled = false;
                        isBreaking = false;
                    }
                } catch (error) {
                    console.error('Break error:', error);
                    alert('박스를 깨는 중 오류가 발생했습니다.');
                    button.disabled = false;
                    isBreaking = false;
                }
            }

            function createExplosion() {
                const container = document.getElementById('particles');
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    const angle = (Math.PI * 2 * i) / 50;
                    const velocity = 100 + Math.random() * 200;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity;
                    
                    particle.style.left = centerX + 'px';
                    particle.style.top = centerY + 'px';
                    particle.style.setProperty('--tx', tx + 'px');
                    particle.style.setProperty('--ty', ty + 'px');
                    particle.style.animationDelay = (Math.random() * 0.2) + 's';
                    
                    container.appendChild(particle);
                    
                    setTimeout(() => particle.remove(), 1000);
                }
            }

            // Check order status and set tier image
            async function checkOrderStatus() {
                try {
                    const response = await fetch('/api/orders/' + orderId);
                    const result = await response.json();

                    if (result.success && result.data) {
                        if (result.data.status !== 'paid') {
                            alert('결제가 완료되지 않은 주문입니다.');
                            window.location.href = '/home';
                        }
                        if (result.data.is_broken === 1) {
                            // Already broken, go to reward page
                            window.location.href = '/reward/' + orderId;
                        }
                        
                        // Set correct tier image
                        const tierImages = {
                            'BRONZE': '/images/bronze-box.png',
                            'GOLD': '/images/gold-box.png',
                            'PLATINUM': '/images/platinum-box.png',
                            'DIAMOND': '/images/diamond-box.png'
                        };
                        const cookieImage = document.getElementById('cookieImage');
                        if (cookieImage && result.data.tier_code) {
                            cookieImage.src = tierImages[result.data.tier_code] || '/images/gold-box.png';
                        }
                    }
                } catch (error) {
                    console.error('Error checking order:', error);
                }
            }

            checkOrderStatus();
        </script>
    </body>
    </html>
  `);
});

// Reward reveal page
app.get('/reward/:orderId', async (c) => {
  const orderId = c.req.param('orderId');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Reward - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 100px;
            }

            .reward-container {
                padding: 40px 20px;
                text-align: center;
            }

            .reward-title {
                font-size: 28px;
                font-weight: 300;
                letter-spacing: 4px;
                color: #D4AF37;
                margin-bottom: 40px;
                animation: fadeIn 1s ease-out;
            }

            .reward-card {
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%);
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 20px;
                padding: 40px;
                margin: 20px auto;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
                animation: scaleIn 0.8s ease-out;
            }

            .reward-icon {
                font-size: 120px;
                margin-bottom: 20px;
                animation: bounce 1s ease-out;
            }

            .jackpot-badge {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 2px;
                display: inline-block;
                margin-bottom: 20px;
                animation: pulse 2s ease-in-out infinite;
            }

            .reward-name {
                font-size: 28px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 16px;
            }

            .reward-value {
                font-size: 36px;
                font-weight: 700;
                color: #D4AF37;
                margin-bottom: 30px;
            }

            .congrats-message {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
                margin-bottom: 30px;
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

            .btn-secondary {
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                color: #D4AF37;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        </style>
    </head>
    <body>
        <div class="reward-container" id="rewardContent">
            <div style="text-align: center; padding: 60px 20px; color: #D4AF37;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 16px;">Loading your reward...</p>
            </div>
        </div>

        <script>
            const orderId = '${orderId}';

            function formatCurrency(amount) {
                return '₩' + amount.toLocaleString('ko-KR');
            }

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

            async function loadReward() {
                try {
                    const response = await fetch('/api/orders/' + orderId);
                    const result = await response.json();

                    if (result.success && result.data && result.data.reward) {
                        renderReward(result.data);
                    } else {
                        alert('리워드를 찾을 수 없습니다.');
                        window.location.href = '/home';
                    }
                } catch (error) {
                    console.error('Error loading reward:', error);
                }
            }

            function renderReward(order) {
                const reward = order.reward;
                
                const content = \`
                    <h1 class="reward-title">운이 자산이 되는 순간</h1>

                    <div class="reward-card">
                        \${reward.is_jackpot ? '<div class="jackpot-badge"><i class="fas fa-star"></i> JACKPOT <i class="fas fa-star"></i></div>' : ''}
                        
                        <div class="reward-icon">\${getRewardIcon(reward.reward_name)}</div>
                        
                        <div class="reward-name">\${reward.reward_name}</div>
                        
                        <div class="reward-value">\${formatCurrency(reward.reward_value)}</div>
                        
                        <div class="congrats-message">
                            축하합니다! 🎉<br>
                            \${reward.is_jackpot ? '잭팟에 당첨되셨습니다!' : '멋진 리워드를 획득하셨습니다!'}<br>
                            배송지 정보를 입력하시면 곧 상품을 받아보실 수 있습니다.
                        </div>
                    </div>
                \`;

                document.getElementById('rewardContent').innerHTML = content;
            }

            function goToShipping() {
                window.location.href = '/shipping/' + orderId;
            }

            function goToHistory() {
                window.location.href = '/history';
            }

            loadReward();
        </script>

        <div class="action-buttons">
            <button class="btn btn-secondary" onclick="goToHistory()">History에서 보기</button>
            <button class="btn btn-primary" onclick="goToShipping()">배송지 입력</button>
        </div>
    </body>
    </html>
  `);
});

// Shipping page
app.get('/shipping/:orderId', async (c) => {
  const orderId = c.req.param('orderId');
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipping Info - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 100px;
            }

            .header {
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                text-align: center;
            }

            .header-title {
                font-size: 24px;
                font-weight: 600;
                color: #D4AF37;
            }

            .form-container {
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #D4AF37;
                margin-bottom: 8px;
            }

            .form-input {
                width: 100%;
                padding: 14px;
                background: rgba(26, 26, 26, 0.8);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 8px;
                color: #ffffff;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .form-input:focus {
                outline: none;
                border-color: #D4AF37;
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
            }

            .form-input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }

            .required {
                color: #ff6b6b;
                margin-left: 4px;
            }

            .action-buttons {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 16px 20px;
                background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.95) 20%);
            }

            .btn {
                width: 100%;
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

            .btn-primary:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            }

            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-title">배송지 정보 입력</div>
        </div>

        <div class="form-container">
            <form id="shippingForm" onsubmit="submitShipping(event)">
                <div class="form-group">
                    <label class="form-label">
                        수령인 이름<span class="required">*</span>
                    </label>
                    <input type="text" class="form-input" id="recipientName" placeholder="받으실 분 이름" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        연락처<span class="required">*</span>
                    </label>
                    <input type="tel" class="form-input" id="recipientPhone" placeholder="010-0000-0000" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        우편번호
                    </label>
                    <input type="text" class="form-input" id="postalCode" placeholder="우편번호 (선택)">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        주소<span class="required">*</span>
                    </label>
                    <input type="text" class="form-input" id="address" placeholder="기본 주소" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        상세 주소
                    </label>
                    <input type="text" class="form-input" id="addressDetail" placeholder="상세 주소 (선택)">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        배송 메모
                    </label>
                    <textarea class="form-input" id="shippingMemo" rows="3" placeholder="배송 시 요청사항 (선택)"></textarea>
                </div>
            </form>
        </div>

        <script>
            const orderId = '${orderId}';

            async function submitShipping(event) {
                event.preventDefault();

                const data = {
                    order_id: orderId,
                    recipient_name: document.getElementById('recipientName').value,
                    recipient_phone: document.getElementById('recipientPhone').value,
                    postal_code: document.getElementById('postalCode').value,
                    address: document.getElementById('address').value,
                    address_detail: document.getElementById('addressDetail').value,
                    shipping_memo: document.getElementById('shippingMemo').value
                };

                const btn = document.getElementById('submitBtn');
                btn.disabled = true;
                btn.textContent = '제출 중...';

                try {
                    const response = await fetch('/api/shipping', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('배송지 정보가 등록되었습니다!');
                        window.location.href = '/history';
                    } else {
                        alert('오류: ' + result.error);
                        btn.disabled = false;
                        btn.textContent = '제출';
                    }
                } catch (error) {
                    console.error('Shipping error:', error);
                    alert('배송지 정보 등록 중 오류가 발생했습니다.');
                    btn.disabled = false;
                    btn.textContent = '제출';
                }
            }
        </script>

        <div class="action-buttons">
            <button class="btn btn-primary" id="submitBtn" onclick="document.getElementById('shippingForm').requestSubmit()">
                제출
            </button>
        </div>
    </body>
    </html>
  `);
});

// History page
app.get('/history', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order History - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 100px;
            }

            .header {
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                text-align: center;
            }

            .header-title {
                font-size: 24px;
                font-weight: 600;
                color: #D4AF37;
            }

            .orders-container {
                padding: 20px;
            }

            .order-card {
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .order-card:hover {
                border-color: #D4AF37;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
            }

            .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .order-number {
                font-size: 14px;
                font-weight: 600;
                color: #D4AF37;
            }

            .order-status {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }

            .status-paid { background: rgba(52, 211, 153, 0.2); color: #34D399; }
            .status-broken { background: rgba(251, 191, 36, 0.2); color: #FBBF24; }
            .status-shipping { background: rgba(96, 165, 250, 0.2); color: #60A5FA; }
            .status-delivered { background: rgba(167, 139, 250, 0.2); color: #A78BFA; }
            .status-refunded { background: rgba(239, 68, 68, 0.2); color: #EF4444; }

            .order-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .order-tier {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
            }

            .order-price {
                font-size: 16px;
                font-weight: 600;
                color: #D4AF37;
            }

            .order-reward {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.7);
                margin-top: 8px;
            }

            .refund-button {
                margin-top: 12px;
                padding: 8px 16px;
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.4);
                border-radius: 6px;
                color: #EF4444;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .refund-button:hover {
                background: rgba(239, 68, 68, 0.3);
                border-color: #EF4444;
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
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-title">주문 히스토리</div>
        </div>

        <div class="orders-container" id="ordersContainer">
            <div style="text-align: center; padding: 60px 20px; color: #D4AF37;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px;"></i>
                <p style="margin-top: 16px;">Loading orders...</p>
            </div>
        </div>

        <div class="bottom-nav">
            <a href="/home" class="nav-item">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="/history" class="nav-item active">
                <i class="fas fa-history"></i>
                <span>History</span>
            </a>
            <a href="/profile" class="nav-item">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </a>
        </div>

        <script>
            function formatCurrency(amount) {
                return '₩' + amount.toLocaleString('ko-KR');
            }

            function getStatusText(status) {
                const statusMap = {
                    'payment_pending': '결제 대기',
                    'paid': '결제 완료',
                    'broken': '개봉 완료',
                    'shipping': '배송 중',
                    'delivered': '배송 완료',
                    'refunded': '환불 완료',
                    'cancelled': '취소됨'
                };
                return statusMap[status] || status;
            }

            async function loadOrders() {
                try {
                    const response = await fetch('/api/orders');
                    const result = await response.json();

                    if (result.success && result.data) {
                        renderOrders(result.data);
                    } else {
                        document.getElementById('ordersContainer').innerHTML = '<p style="text-align: center; color: #D4AF37;">주문 내역이 없습니다.</p>';
                    }
                } catch (error) {
                    console.error('Error loading orders:', error);
                }
            }

            function renderOrders(orders) {
                if (orders.length === 0) {
                    document.getElementById('ordersContainer').innerHTML = '<p style="text-align: center; color: #D4AF37;">주문 내역이 없습니다.</p>';
                    return;
                }

                const html = orders.map(order => {
                    const canRefund = order.status === 'paid' && order.is_broken === 0;
                    
                    return \`
                        <div class="order-card">
                            <div class="order-header">
                                <div class="order-number">\${order.order_number}</div>
                                <div class="order-status status-\${order.status}">\${getStatusText(order.status)}</div>
                            </div>
                            <div class="order-info">
                                <div class="order-tier">\${order.tier_name}</div>
                                <div class="order-price">\${formatCurrency(order.price)}</div>
                            </div>
                            \${order.reward_name ? \`<div class="order-reward">🎁 \${order.reward_name} (\${formatCurrency(order.reward_value)})</div>\` : ''}
                            
                            \${canRefund ? \`<button class="refund-button" onclick="requestRefund(\${order.id}, '\${order.order_number}')"><i class="fas fa-undo"></i> 환불 요청</button>\` : ''}
                            \${!canRefund && order.status === 'paid' ? '<div style="font-size: 11px; color: rgba(255, 255, 255, 0.5); margin-top: 8px;">박스를 깨신 후에는 환불이 불가능합니다.</div>' : ''}
                        </div>
                    \`;
                }).join('');

                document.getElementById('ordersContainer').innerHTML = html;
            }

            async function requestRefund(orderId, orderNumber) {
                if (!confirm('주문번호 ' + orderNumber + '을(를) 환불하시겠습니까?')) {
                    return;
                }

                const reason = prompt('환불 사유를 입력해주세요:');
                if (!reason) return;

                try {
                    const response = await fetch('/api/orders/' + orderId + '/refund', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reason })
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('환불이 완료되었습니다.');
                        loadOrders();
                    } else {
                        alert('환불 실패: ' + result.message || result.error);
                    }
                } catch (error) {
                    console.error('Refund error:', error);
                    alert('환불 처리 중 오류가 발생했습니다.');
                }
            }

            loadOrders();
        </script>
    </body>
    </html>
  `);
});

// Profile page
app.get('/profile', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile - FORTUNE BOX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
            
            body {
                font-family: 'Cormorant Garamond', serif;
                background: #000000;
                color: #ffffff;
                min-height: 100vh;
                padding-bottom: 100px;
            }

            .header {
                padding: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                text-align: center;
            }

            .header-title {
                font-size: 24px;
                font-weight: 600;
                color: #D4AF37;
            }

            .profile-container {
                padding: 20px;
            }

            .menu-item {
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .menu-item:hover {
                border-color: #D4AF37;
                transform: translateX(5px);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
            }

            .menu-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .menu-icon {
                font-size: 24px;
                color: #D4AF37;
                width: 40px;
                text-align: center;
            }

            .menu-text {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
            }

            .menu-arrow {
                font-size: 16px;
                color: rgba(212, 175, 55, 0.5);
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
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-title">프로필 / FAQ</div>
        </div>

        <div class="profile-container">
            <div class="menu-item" onclick="alert('FAQ: 자주 묻는 질문\\n\\n1. 박스를 깬 후 환불이 가능한가요?\\n→ 아니오, 박스를 깬 후에는 환불이 불가능합니다.\\n\\n2. 확률은 어떻게 공개되나요?\\n→ 각 티어 상세 페이지에서 모든 리워드의 정확한 확률을 확인할 수 있습니다.\\n\\n3. 배송은 얼마나 걸리나요?\\n→ 배송지 정보 입력 후 영업일 기준 3-5일 소요됩니다.')">
                <div class="menu-left">
                    <div class="menu-icon"><i class="fas fa-question-circle"></i></div>
                    <div class="menu-text">자주 묻는 질문 (FAQ)</div>
                </div>
                <div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>

            <div class="menu-item" onclick="alert('고객 문의\\n\\n이메일: support@fortunebox.com\\n전화: 1588-0000\\n운영시간: 평일 09:00-18:00')">
                <div class="menu-left">
                    <div class="menu-icon"><i class="fas fa-headset"></i></div>
                    <div class="menu-text">고객 지원</div>
                </div>
                <div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>

            <div class="menu-item" onclick="alert('이용약관\\n\\n1. 서비스 이용\\n2. 환불 정책\\n3. 개인정보 보호\\n4. 책임의 한계\\n\\n자세한 내용은 웹사이트를 참고해주세요.')">
                <div class="menu-left">
                    <div class="menu-icon"><i class="fas fa-file-contract"></i></div>
                    <div class="menu-text">이용약관</div>
                </div>
                <div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>

            <div class="menu-item" onclick="alert('개인정보 처리방침\\n\\n- 수집하는 개인정보: 이름, 연락처, 주소\\n- 이용 목적: 상품 배송, 고객 문의 응대\\n- 보유 기간: 배송 완료 후 1년\\n\\n자세한 내용은 웹사이트를 참고해주세요.')">
                <div class="menu-left">
                    <div class="menu-icon"><i class="fas fa-shield-alt"></i></div>
                    <div class="menu-text">개인정보 처리방침</div>
                </div>
                <div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>

            <div class="menu-item" onclick="alert('FORTUNE BOX v1.0.0\\n\\n© 2026 Fortune Box. All rights reserved.\\n\\nBreak Your Fortune, Unlock Luxury')">
                <div class="menu-left">
                    <div class="menu-icon"><i class="fas fa-info-circle"></i></div>
                    <div class="menu-text">앱 정보</div>
                </div>
                <div class="menu-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        </div>

        <div class="bottom-nav">
            <a href="/home" class="nav-item">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="/history" class="nav-item">
                <i class="fas fa-history"></i>
                <span>History</span>
            </a>
            <a href="/profile" class="nav-item active">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </a>
        </div>
    </body>
    </html>
  `);
});

export default app;
