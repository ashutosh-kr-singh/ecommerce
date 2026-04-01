# Payment Gateway & GST Integration Guide

## Overview
This e-commerce platform now includes:
- **Razorpay Payment Gateway** for secure online payments
- **GST Calculation** (18% default, configurable per product)
- **Tax Invoices** with GST compliance details
- **Order Management** with payment tracking

---

## Setup Instructions

### 1. Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**
5. Use **Test keys** for development, **Live keys** for production

### 2. Backend Configuration

**Update `.env` file:**
```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your_secret_key_here

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=test_secret_key_1234567890abcd

# Business Details (for invoices)
BUSINESS_NAME=Your Store Name
BUSINESS_GSTIN=27AABCT1234H1Z0
BUSINESS_ADDRESS=Your Business Address
BUSINESS_STATE=MH
```

**Install dependencies:**
```bash
cd backend
npm install razorpay
npm install
```

### 3. Frontend Configuration

**Create `.env.local` (or update `.env`):**
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
VITE_API_BASE_URL=http://localhost:5000/api
```

**Install Razorpay script in HTML (already in Checkout component):**
The checkout component automatically loads Razorpay when needed.

---

## How It Works

### Payment Flow

```
1. User adds items to cart
    ↓
2. Proceeds to checkout
    ↓
3. Enters shipping & contact details
    ↓
4. System calculates: Subtotal + GST (18%)
    ↓
5. Backend creates Razorpay Order
    ↓
6. Razorpay modal opens for payment
    ↓
7. User completes payment
    ↓
8. Backend verifies payment signature
    ↓
9. Order marked as "Paid"
    ↓
10. Tax Invoice generated
    ↓
11. Order confirmation sent
```

### API Endpoints

#### Create Order
```bash
POST /api/payment/create-order
Headers: Authorization: Bearer {token}

Body:
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": "Full address here",
  "customerEmail": "customer@example.com",
  "customerPhone": "9999999999",
  "gstinBuyer": "27AABCT1234H1Z0" // Optional
}

Response:
{
  "success": true,
  "orderId": "order_db_id",
  "razorpayOrderId": "order_razorpay_id",
  "amount": 1180,
  "subtotal": 1000,
  "gstAmount": 180,
  "gstRate": 18
}
```

#### Verify Payment
```bash
POST /api/payment/verify-payment
Headers: Authorization: Bearer {token}

Body:
{
  "razorpayOrderId": "order_razorpay_id",
  "razorpayPaymentId": "pay_razorpay_id",
  "razorpaySignature": "signature_hash",
  "orderId": "order_db_id"
}

Response:
{
  "success": true,
  "order": { ...order_details },
  "invoice": { ...invoice_data }
}
```

#### Get Invoice
```bash
GET /api/payment/invoice/{orderId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "invoice": {
    "invoiceNumber": "RCP-1711234567890",
    "invoiceDate": "2024-03-29",
    "subtotal": 1000,
    "gstRate": 18,
    "gstAmount": 180,
    "totalAmount": 1180,
    ...
  }
}
```

#### Get User Orders
```bash
GET /api/payment/my-orders
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "orders": [{ ...order_details }]
}
```

---

## GST Details

### Current Configuration
- **Default GST Rate:** 18% (for electronics)
- **Applicable to:** All products in India
- **Charged on:** Subtotal (before shipping in this version)

### Modifying GST per Category

Edit `backend/controllers/paymentController.js`:

```javascript
const GST_RATES = {
  Electronics: 18,
  Clothing: 5,
  Groceries: 5,
  Books: 0,
  // Add more categories
};
```

When creating order:
```javascript
const gstRate = GST_RATES[product.category] || 18;
```

### Tax Invoice Fields

The system automatically generates invoices with:
- ✓ Invoice Number & Date
- ✓ Buyer Details (Email, Phone, Address)
- ✓ GSTIN (if provided)
- ✓ Item Details with Prices
- ✓ Subtotal
- ✓ GST Amount & Rate
- ✓ Final Total
- ✓ Payment ID Reference

---

## Database Schema

### Order Model
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  gstRate: Number,          // 18
  gstAmount: Number,        // Calculated
  totalPrice: Number,       // subtotal + gst
  shippingAddress: String,
  customerEmail: String,
  customerPhone: String,
  paymentMethod: String,    // 'razorpay' or 'cod'
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    receiptId: String
  },
  invoiceDetails: {
    invoiceNumber: String,
    invoiceDate: Date,
    gstinBuyer: String
  },
  status: String,           // 'pending', 'paid', 'processing', etc.
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing

### Test with Razorpay Test Cards

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25` (or any future date)
- CVV: `123`

**Failed Payment:**
- Card Number: `4444 3333 2222 1111`
- Expiry: `12/25`
- CVV: `123`

### Test GSTIN
- Format: `27AABCT1234H1Z0`
- First 2 digits: State code (27 = Maharashtra)
- Next 5 letters: PAN of entity
- Then 4 digits: Business code
- Then 1 letter: Business division
- Then 1 digit: Checksum
- Last 1 letter: Default `Z`

---

## GST Compliance Checklist

- ✓ GST calculated on all transactions
- ✓ Tax invoices issued automatically
- ✓ GSTIN captured (if B2B)
- ✓ Payment details recorded
- ✓ Order status tracking
- ✓ Invoice download available
- ✓ Tax records maintained

---

## Troubleshooting

### Payment Fails
1. Check Razorpay credentials in `.env`
2. Ensure API keys are correct (test vs live)
3. Verify internet connection
4. Check browser console for errors

### GST Not Calculating
1. Verify GST calculation logic in `paymentController.js`
2. Check if GST_RATES object has product category
3. Ensure subtotal is calculated correctly

### Invoice Not Generating
1. Check if order status is 'paid'
2. Verify invoice fields in Order model
3. Check backend logs for errors

### GSTIN Format Error
1. Follow format: `27AABCT1234H1Z0`
2. First 2 digits must be state code (01-35)
3. Last character must be 'Z'

---

## Production Checklist

Before going live:
- [ ] Switch to Live Razorpay keys
- [ ] Update `.env` with live credentials
- [ ] Enable HTTPS on your domain
- [ ] Test payment flow end-to-end
- [ ] Setup email notifications
- [ ] Configure return/refund policy
- [ ] Add payment failure handling
- [ ] Setup proper error logging
- [ ] Configure backup payment method (COD)

---

## Future Enhancements

- [ ] Multiple payment gateway support (PayPal, Stripe)
- [ ] Per-product GST rates
- [ ] Shipping charges with GST
- [ ] Discount/Coupon codes
- [ ] E-way bill integration
- [ ] SMS/Email notifications
- [ ] Payment receipt PDF generation
- [ ] Refund management system
- [ ] Tax report generation

---

## Support

For Razorpay issues: [Razorpay Docs](https://razorpay.com/docs/)
For GST compliance: Consult local tax authority or CA

