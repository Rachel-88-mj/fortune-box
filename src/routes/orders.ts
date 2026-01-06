import { Hono } from 'hono';
import type { Bindings, Order, OrderWithDetails, ApiResponse } from '../types';
import { 
  generateOrderNumber, 
  trackEvent, 
  selectRandomReward, 
  canRefund,
  getClientIp,
  getUserAgent
} from '../lib/utils';

const orders = new Hono<{ Bindings: Bindings }>();

// POST /api/orders/create - Create new order (checkout start)
orders.post('/create', async (c) => {
  try {
    const { DB } = c.env;
    const body = await c.req.json();
    const { tier_code } = body;

    if (!tier_code) {
      return c.json<ApiResponse>({
        success: false,
        error: 'tier_code is required'
      }, 400);
    }

    // Get tier
    const tier = await DB.prepare(`
      SELECT * FROM tiers 
      WHERE tier_code = ? AND is_active = 1
    `).bind(tier_code).first();

    if (!tier) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Tier not found'
      }, 404);
    }

    // Generate order number
    const orderNumber = generateOrderNumber();
    const userIp = getClientIp(c);
    const userAgent = getUserAgent(c);

    // Insert order
    const result = await DB.prepare(`
      INSERT INTO orders (
        order_number, tier_id, tier_code, price, status, 
        user_ip, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      orderNumber,
      tier.id,
      tier_code,
      tier.price,
      'payment_pending',
      userIp,
      userAgent
    ).run();

    // Track event
    await trackEvent(c, {
      event_name: 'checkout_start',
      order_id: result.meta.last_row_id as number,
      tier_code,
      event_data: JSON.stringify({ order_number: orderNumber, price: tier.price })
    });

    return c.json<ApiResponse>({
      success: true,
      data: {
        order_id: result.meta.last_row_id,
        order_number: orderNumber,
        tier_code,
        price: tier.price
      }
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to create order'
    }, 500);
  }
});

// POST /api/orders/:orderId/payment - Process payment
orders.post('/:orderId/payment', async (c) => {
  try {
    const { DB } = c.env;
    const orderId = c.req.param('orderId');
    const body = await c.req.json();
    const { payment_method, transaction_id } = body;

    // Get order
    const order = await DB.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(orderId).first() as Order;

    if (!order) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order not found'
      }, 404);
    }

    if (order.status !== 'payment_pending') {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order is not in payment_pending status'
      }, 400);
    }

    // Simulate payment processing (in production, integrate with real payment gateway)
    const paymentSuccess = Math.random() > 0.05; // 95% success rate for demo

    if (paymentSuccess) {
      // Update order status to paid
      await DB.prepare(`
        UPDATE orders 
        SET status = 'paid', 
            payment_method = ?, 
            payment_transaction_id = ?,
            payment_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `).bind(payment_method || 'card', transaction_id || `TXN-${Date.now()}`, orderId).run();

      // Track event
      await trackEvent(c, {
        event_name: 'payment_success',
        order_id: parseInt(orderId),
        tier_code: order.tier_code,
        event_data: JSON.stringify({ 
          payment_method, 
          transaction_id,
          amount: order.price 
        })
      });

      return c.json<ApiResponse>({
        success: true,
        message: 'Payment successful',
        data: { order_id: orderId, status: 'paid' }
      });
    } else {
      // Track event
      await trackEvent(c, {
        event_name: 'payment_fail',
        order_id: parseInt(orderId),
        tier_code: order.tier_code,
        event_data: JSON.stringify({ payment_method, reason: 'payment_gateway_error' })
      });

      return c.json<ApiResponse>({
        success: false,
        error: 'Payment failed',
        message: 'Payment gateway error. Please try again.'
      }, 400);
    }
  } catch (error) {
    console.error('Failed to process payment:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to process payment'
    }, 500);
  }
});

// POST /api/orders/:orderId/break - Break the box (reveal reward)
orders.post('/:orderId/break', async (c) => {
  try {
    const { DB } = c.env;
    const orderId = c.req.param('orderId');

    // Get order
    const order = await DB.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(orderId).first() as Order;

    if (!order) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order not found'
      }, 404);
    }

    if (order.status !== 'paid') {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order must be paid before breaking'
      }, 400);
    }

    if (order.is_broken === 1) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Box already broken'
      }, 400);
    }

    // Get rewards for this tier
    const { results: rewards } = await DB.prepare(`
      SELECT * FROM rewards 
      WHERE tier_id = ? AND is_active = 1
    `).bind(order.tier_id).all();

    if (!rewards || rewards.length === 0) {
      return c.json<ApiResponse>({
        success: false,
        error: 'No rewards available for this tier'
      }, 500);
    }

    // Select random reward based on probability
    const selectedReward = selectRandomReward(rewards);

    // Update order: mark as broken, set reward_id
    await DB.prepare(`
      UPDATE orders 
      SET is_broken = 1, 
          broken_at = datetime('now'),
          reward_id = ?,
          status = 'broken',
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(selectedReward.id, orderId).run();

    // Track event
    await trackEvent(c, {
      event_name: 'break_box_start',
      order_id: parseInt(orderId),
      tier_code: order.tier_code,
      event_data: JSON.stringify({ 
        reward_id: selectedReward.id, 
        reward_name: selectedReward.reward_name,
        reward_value: selectedReward.reward_value
      })
    });

    // Track reward reveal
    await trackEvent(c, {
      event_name: 'reward_reveal',
      order_id: parseInt(orderId),
      tier_code: order.tier_code,
      event_data: JSON.stringify({ 
        reward_id: selectedReward.id,
        is_jackpot: selectedReward.is_jackpot
      })
    });

    return c.json<ApiResponse>({
      success: true,
      message: '운이 자산이 되는 순간',
      data: {
        order_id: orderId,
        reward: selectedReward
      }
    });
  } catch (error) {
    console.error('Failed to break box:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to break box'
    }, 500);
  }
});

// GET /api/orders/:orderId - Get order details
orders.get('/:orderId', async (c) => {
  try {
    const { DB } = c.env;
    const orderId = c.req.param('orderId');

    const order = await DB.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(orderId).first() as Order;

    if (!order) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order not found'
      }, 404);
    }

    // Get tier
    const tier = await DB.prepare(`
      SELECT * FROM tiers WHERE id = ?
    `).bind(order.tier_id).first();

    // Get reward if broken
    let reward = null;
    if (order.reward_id) {
      reward = await DB.prepare(`
        SELECT * FROM rewards WHERE id = ?
      `).bind(order.reward_id).first();
    }

    // Get shipping if exists
    let shipping = null;
    shipping = await DB.prepare(`
      SELECT * FROM shipping WHERE order_id = ?
    `).bind(orderId).first();

    const orderWithDetails: OrderWithDetails = {
      ...order,
      tier,
      reward,
      shipping
    };

    return c.json<ApiResponse<OrderWithDetails>>({
      success: true,
      data: orderWithDetails
    });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch order'
    }, 500);
  }
});

// POST /api/orders/:orderId/refund - Request refund
orders.post('/:orderId/refund', async (c) => {
  try {
    const { DB } = c.env;
    const orderId = c.req.param('orderId');
    const body = await c.req.json();
    const { reason } = body;

    // Get order
    const order = await DB.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(orderId).first() as Order;

    if (!order) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order not found'
      }, 404);
    }

    // Check if refund is allowed
    if (!canRefund(order)) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Refund not allowed for this order',
        message: '박스를 깬 후에는 환불이 불가능합니다.'
      }, 400);
    }

    // Process refund
    await DB.prepare(`
      UPDATE orders 
      SET status = 'refunded',
          refund_at = datetime('now'),
          refund_reason = ?,
          refund_amount = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(reason || 'User requested', order.price, orderId).run();

    // Track events
    await trackEvent(c, {
      event_name: 'refund_request',
      order_id: parseInt(orderId),
      tier_code: order.tier_code,
      event_data: JSON.stringify({ reason, amount: order.price })
    });

    await trackEvent(c, {
      event_name: 'refund_success',
      order_id: parseInt(orderId),
      tier_code: order.tier_code,
      event_data: JSON.stringify({ amount: order.price })
    });

    return c.json<ApiResponse>({
      success: true,
      message: 'Refund processed successfully',
      data: { order_id: orderId, refund_amount: order.price }
    });
  } catch (error) {
    console.error('Failed to process refund:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to process refund'
    }, 500);
  }
});

// GET /api/orders - Get all orders (for history)
orders.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const limit = c.req.query('limit') || '50';

    const { results: ordersList } = await DB.prepare(`
      SELECT 
        o.*,
        t.tier_name,
        t.tier_code,
        t.color_scheme,
        r.reward_name,
        r.reward_value
      FROM orders o
      LEFT JOIN tiers t ON o.tier_id = t.id
      LEFT JOIN rewards r ON o.reward_id = r.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `).bind(parseInt(limit)).all();

    return c.json<ApiResponse>({
      success: true,
      data: ordersList
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch orders'
    }, 500);
  }
});

export default orders;
