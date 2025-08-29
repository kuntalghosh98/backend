const axios = require('axios');

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";
let token = null;

// Authenticate with Shiprocket
async function authenticate(email, password) {
  const res = await axios.post(`${SHIPROCKET_BASE}/auth/login`, { email, password });
  token = res.data.token;
  return token;
}

// Create Shipment
async function createShipment(order, items) {
  if (!token) throw new Error("Shiprocket not authenticated. Call authenticate first.");

  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString(),
    pickup_location: "Primary",
    billing_customer_name: order.address.name,
    billing_last_name: "",
    billing_address: order.address.flatNumber + ", " + order.address.locality,
    billing_city: order.address.district,
    billing_pincode: order.address.pincode,
    billing_state: order.address.state,
    billing_country: "India",
    billing_email: "customer@example.com", // replace dynamically
    billing_phone: order.address.mobileNumber,
    order_items: items.map(i => ({
      name: "Product", // TODO: fetch real product name
      sku: i.productId.toString(),
      units: i.quantity,
      selling_price: i.price,
    })),
    payment_method: order.payment.status === "completed" ? "Prepaid" : "COD",
    sub_total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    length: 10,
    breadth: 10,
    height: 10,
    weight: 1
  };

  const res = await axios.post(`${SHIPROCKET_BASE}/orders/create/adhoc`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return {
    shipmentId: res.data.shipment_id,
    awbCode: res.data.awb_code,
    courierName: res.data.courier_name,
    trackingUrl: res.data.tracking_url
  };
}

// Track Shipment
async function trackShipment(shipmentId) {
  const res = await axios.get(`${SHIPROCKET_BASE}/courier/track/shipment/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

module.exports = { authenticate, createShipment, trackShipment };
