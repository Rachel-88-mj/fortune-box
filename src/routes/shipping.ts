import { Hono } from 'hono';
import type { Bindings, Shipping, ApiResponse } from '../types';
import { trackEvent } from '../lib/utils';

const shipping = new Hono<{ Bindings: Bindings }>();

// POST /api/shipping - Submit shipping information
shipping.post('/', async (c) => {
  try {
    const { DB } = c.env;
    const body = await c.req.json();
    const {
      order_id,
      recipient_name,
      recipient_phone,
      postal_code,
      address,
      address_detail,
      shipping_memo
    } = body;

    // Validation
    if (!order_id || !recipient_name || !recipient_phone || !address) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Check if order exists and is broken
    const order = await DB.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).bind(order_id).first();

    if (!order) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Order not found'
      }, 404);
    }

    if (order.is_broken !== 1) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Box must be broken before submitting shipping info'
      }, 400);
    }

    // Check if shipping info already exists
    const existingShipping = await DB.prepare(`
      SELECT * FROM shipping WHERE order_id = ?
    `).bind(order_id).first();

    if (existingShipping) {
      // Update existing shipping
      await DB.prepare(`
        UPDATE shipping 
        SET recipient_name = ?,
            recipient_phone = ?,
            postal_code = ?,
            address = ?,
            address_detail = ?,
            shipping_memo = ?,
            updated_at = datetime('now')
        WHERE order_id = ?
      `).bind(
        recipient_name,
        recipient_phone,
        postal_code || null,
        address,
        address_detail || null,
        shipping_memo || null,
        order_id
      ).run();
    } else {
      // Insert new shipping
      await DB.prepare(`
        INSERT INTO shipping (
          order_id, recipient_name, recipient_phone, postal_code,
          address, address_detail, shipping_memo, shipping_status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
      `).bind(
        order_id,
        recipient_name,
        recipient_phone,
        postal_code || null,
        address,
        address_detail || null,
        shipping_memo || null
      ).run();
    }

    // Update order status
    await DB.prepare(`
      UPDATE orders 
      SET status = 'shipping', updated_at = datetime('now')
      WHERE id = ?
    `).bind(order_id).run();

    // Track event
    await trackEvent(c, {
      event_name: 'shipping_submit',
      order_id: parseInt(order_id),
      event_data: JSON.stringify({ recipient_name })
    });

    return c.json<ApiResponse>({
      success: true,
      message: 'Shipping information submitted successfully'
    });
  } catch (error) {
    console.error('Failed to submit shipping:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to submit shipping information'
    }, 500);
  }
});

// GET /api/shipping/:orderId - Get shipping info for order
shipping.get('/:orderId', async (c) => {
  try {
    const { DB } = c.env;
    const orderId = c.req.param('orderId');

    const shippingInfo = await DB.prepare(`
      SELECT * FROM shipping WHERE order_id = ?
    `).bind(orderId).first();

    if (!shippingInfo) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Shipping information not found'
      }, 404);
    }

    return c.json<ApiResponse<Shipping>>({
      success: true,
      data: shippingInfo as Shipping
    });
  } catch (error) {
    console.error('Failed to fetch shipping:', error);
    return c.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch shipping information'
    }, 500);
  }
});

export default shipping;
