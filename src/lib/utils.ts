import type { Context } from 'hono';
import type { Bindings, AnalyticsEvent } from '../types';

/**
 * Generate unique order number
 * Format: FB20260106-XXXX (FB + YYYYMMDD + 4-digit random)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `FB${dateStr}-${randomStr}`;
}

/**
 * Generate session ID for analytics
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Track analytics event
 */
export async function trackEvent(
  c: Context<{ Bindings: Bindings }>,
  event: AnalyticsEvent
): Promise<void> {
  try {
    const { DB } = c.env;
    const userIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    await DB.prepare(`
      INSERT INTO analytics_events (
        event_name, order_id, tier_code, user_id, session_id, 
        event_data, user_ip, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      event.event_name,
      event.order_id || null,
      event.tier_code || null,
      event.user_id || null,
      event.session_id || null,
      event.event_data || null,
      userIp,
      userAgent
    ).run();
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Select random reward based on probability
 */
export function selectRandomReward(rewards: any[]): any {
  const rand = Math.random();
  let cumulative = 0;

  for (const reward of rewards) {
    cumulative += reward.probability;
    if (rand <= cumulative) {
      return reward;
    }
  }

  // Fallback to last reward if no match (should not happen with correct probabilities)
  return rewards[rewards.length - 1];
}

/**
 * Format currency (KRW)
 */
export function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

/**
 * Validate refund eligibility
 * Rules:
 * - Can refund if: status = 'paid' AND is_broken = 0
 * - Cannot refund if: is_broken = 1 OR status in ['shipping', 'delivered', 'refunded', 'cancelled']
 */
export function canRefund(order: any): boolean {
  return order.status === 'paid' && order.is_broken === 0;
}

/**
 * Get client IP
 */
export function getClientIp(c: Context): string {
  return c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
}

/**
 * Get user agent
 */
export function getUserAgent(c: Context): string {
  return c.req.header('user-agent') || 'unknown';
}
