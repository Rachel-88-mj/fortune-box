import { Hono } from 'hono';
import type { Bindings, TierWithRewards, ApiResponse } from '../types';
import { trackEvent } from '../lib/utils';

const tiers = new Hono<{ Bindings: Bindings }>();

// GET /api/tiers - Get all active tiers
tiers.get('/', async (c) => {
  try {
    const { DB } = c.env;

    const { results: tiersList } = await DB.prepare(`
      SELECT * FROM tiers 
      WHERE is_active = 1 
      ORDER BY display_order ASC
    `).all();

    // Track event
    await trackEvent(c, {
      event_name: 'tier_view',
      event_data: JSON.stringify({ count: tiersList.length })
    });

    return c.json<ApiResponse<typeof tiersList>>({
      success: true,
      data: tiersList
    });
  } catch (error) {
    console.error('Failed to fetch tiers:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch tiers'
    }, 500);
  }
});

// GET /api/tiers/:code - Get tier by code with rewards
tiers.get('/:code', async (c) => {
  try {
    const { DB } = c.env;
    const tierCode = c.req.param('code');

    const tier = await DB.prepare(`
      SELECT * FROM tiers 
      WHERE tier_code = ? AND is_active = 1
    `).bind(tierCode).first();

    if (!tier) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Tier not found'
      }, 404);
    }

    const { results: rewards } = await DB.prepare(`
      SELECT * FROM rewards 
      WHERE tier_id = ? AND is_active = 1 
      ORDER BY display_order ASC
    `).bind(tier.id).all();

    const tierWithRewards: TierWithRewards = {
      ...tier,
      rewards
    } as TierWithRewards;

    // Track event
    await trackEvent(c, {
      event_name: 'tier_click',
      tier_code: tierCode,
      event_data: JSON.stringify({ tier_id: tier.id })
    });

    return c.json<ApiResponse<TierWithRewards>>({
      success: true,
      data: tierWithRewards
    });
  } catch (error) {
    console.error('Failed to fetch tier:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch tier'
    }, 500);
  }
});

// GET /api/tiers/:code/probabilities - Get probability view
tiers.get('/:code/probabilities', async (c) => {
  try {
    const { DB } = c.env;
    const tierCode = c.req.param('code');

    const tier = await DB.prepare(`
      SELECT * FROM tiers 
      WHERE tier_code = ? AND is_active = 1
    `).bind(tierCode).first();

    if (!tier) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Tier not found'
      }, 404);
    }

    const { results: rewards } = await DB.prepare(`
      SELECT * FROM rewards 
      WHERE tier_id = ? AND is_active = 1 
      ORDER BY probability DESC
    `).bind(tier.id).all();

    // Track event
    await trackEvent(c, {
      event_name: 'probability_view',
      tier_code: tierCode,
      event_data: JSON.stringify({ tier_id: tier.id, rewards_count: rewards.length })
    });

    return c.json<ApiResponse>({
      success: true,
      data: { tier, rewards }
    });
  } catch (error) {
    console.error('Failed to fetch probabilities:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch probabilities'
    }, 500);
  }
});

export default tiers;
