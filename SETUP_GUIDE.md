# E-Commerce Platform - Complete Setup Guide

## 🎯 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- Razorpay Account (free to create)

---

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file:
```bash
# Copy from template
cp .env.example .env

# Edit with your values
nano .env
# OR
code .env
```

**Required Keys:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Any random string (change in production)
- `RAZORPAY_KEY_ID` - From Razorpay dashboard
- `RAZORPAY_KEY_SECRET` - From Razorpay dashboard

### 3. Start Backend Server
```bash
npm run dev
# or
node server.js
```

✅ Backend running on: `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```bash
# Copy from template
cp .env.example .env.local

# Edit with your values
nano .env.local
# OR
code .env.local
```

**Required Keys:**
- `VITE_RAZORPAY_KEY_ID` - Same as backend (test key)
- `VITE_API_BASE_URL` - Backend API URL

### 3. Start Frontend Development Server
```bash
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## 💳 Payment Gateway Setup (Razorpay)

### Get Your API Keys
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Go to **Settings → API Keys**
4. Copy **Key ID** and **Key Secret**
5. Use **Test Keys** for development

### Test Payments
Use these card details in development:

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: `12/25` (any future date)
- CVV: `123`

**Failed Payment:**
- Card: `4444 3333 2222 1111`
- Expiry: `12/25`
- CVV: `123`

---

## 📊 Features Implemented

### Backend Features
- ✅ Razorpay Payment Gateway Integration
- ✅ GST Calculation (18% default)
- ✅ Order Management with Payment Tracking
- ✅ Tax Invoice Generation
- ✅ Payment Verification with Signature
- ✅ Order History for Users

### Frontend Features
- ✅ Complete Checkout Flow
- ✅ GST Breakdown Display
- ✅ Order Success Page
- ✅ Invoice Download
- ✅ Shopping Cart with GST
- ✅ Responsive Design

### Database Features
- ✅ Enhanced Order Schema with Tax Fields
- ✅ Payment Details Storage
- ✅ Invoice Information
- ✅ Tax Compliance Tracking

---

## 📝 API Endpoints

### Payment Routes
```
POST   /api/payment/create-order     - Create Razorpay order
POST   /api/payment/verify-payment   - Verify payment signature
GET    /api/payment/invoice/:orderId - Get invoice details
GET    /api/payment/my-orders        - Get user's orders
GET    /api/payment/order-details/:orderId - Get specific order
```

See [PAYMENT_SETUP.md](./PAYMENT_SETUP.md) for detailed API documentation.

---

## 📁 Project Structure

```
backend/
  ├── controllers/
  │   ├── authController.js
  │   ├── paymentController.js      (NEW)
  │   ├── productController.js
  │   └── cartController.js
  ├── routes/
  │   ├── auth.js
  │   ├── payment.js                (NEW)
  │   ├── products.js
  │   └── cart.js
  ├── models/
  │   ├── Order.js                  (UPDATED)
  │   ├── Product.js
  │   ├── User.js
  ├── .env.example                  (NEW)
  └── server.js
  
frontend/
  ├── src/
  │   ├── pages/
  │   │   ├── Checkout.jsx          (NEW)
  │   │   ├── OrderSuccess.jsx      (NEW)
  │   │   ├── CartPage.jsx          (UPDATED)
  │   │   ├── Login.jsx
  │   │   └── Register.jsx
  │   ├── components/
  │   │   ├── ProductCard.jsx
  │   │   ├── ProductList.jsx
  │   │   ├── Navbar.jsx
  │   │   └── Cart.jsx
  │   ├── styles/
  │   │   ├── checkout.css          (NEW)
  │   │   ├── cart.css              (UPDATED)
  │   │   └── main.css
  │   └── services/
  │       └── api.js
  ├── .env.example                  (NEW)
  └── vite.config.js

PAYMENT_SETUP.md                     (NEW - Detailed guide)
```

---

## 🔑 Environment Variables Checklist

### Backend (.env)
- [ ] MONGODB_URI
- [ ] PORT
- [ ] JWT_SECRET
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET

### Frontend (.env.local)
- [ ] VITE_RAZORPAY_KEY_ID
- [ ] VITE_API_BASE_URL

---

## 🧪 Testing the Payment Flow

1. Register/Login to the app
2. Add products to cart
3. Go to CartPage
4. Click "Proceed to Checkout"
5. Fill in order details:
   - Shipping address
   - Email
   - Phone number
   - GSTIN (optional)
6. Click "Pay" button
7. Use test Razorpay card details
8. Verify payment
9. View order summary with GST breakdown
10. Download invoice

---

## 📊 GST Breakdown Example

```
Product Price (Subtotal):  ₹1000
GST (18%):                 ₹180
────────────────────────
Total Amount:              ₹1180
```

---

## 🆘 Troubleshooting

### Backend Issues
```bash
# Port already in use
# Change PORT in .env or stop the process using port 5000

# MongoDB connection failed
# Check MONGODB_URI in .env
# Ensure MongoDB is running

# Razorpay payment fails
# Verify API keys in .env
# Check if using test keys for development
```

### Frontend Issues
```bash
# Images not loading
# Check /frontend/public/images/ folder exists

# Razorpay not loading
# Verify VITE_RAZORPAY_KEY_ID in .env.local
# Check browser console for errors

# API calls failing
# Ensure backend is running on VITE_API_BASE_URL
# Check CORS configuration in backend
```

### Payment Verification Fails
```bash
# Ensure RAZORPAY_KEY_SECRET is correct
# Check payment signature generation logic
# Verify request body format
```

---

## 🔐 Security Checklist

**Before Production:**
- [ ] Change JWT_SECRET to strong random string
- [ ] Switch to Razorpay Live Keys
- [ ] Enable HTTPS on all URLs
- [ ] Remove console.log statements
- [ ] Setup proper error logging
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Setup automated backups
- [ ] Add payment webhook verification
- [ ] Test all edge cases

---

## 📚 Documentation

- [Razorpay Documentation](https://razorpay.com/docs/)
- [GST Compliance Guide](https://www.gst.gov.in/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

## 💡 Next Steps

1. Test the payment flow end-to-end
2. Customize GST rates per category (if needed)
3. Add more payment methods (if needed)
4. Setup email notifications
5. Implement refund system
6. Add admin dashboard
7. Setup analytics
8. Deploy to production

---

## 📞 Support

For issues or questions:
1. Check [PAYMENT_SETUP.md](./PAYMENT_SETUP.md) for detailed API docs
2. Review troubleshooting section above
3. Check Razorpay dashboard for payment details
4. Review error logs in browser console and backend terminal

---

**Happy selling! 🎉**
