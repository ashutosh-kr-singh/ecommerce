# Payment/Checkout Troubleshooting Guide

## 🔴 Problem: "Error creating order" on checkout

### ⚙️ Step 1: Check Backend is Running

1. **Open Terminal/PowerShell**
2. **Check backend terminal** - Should show:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB Connected: localhost
   ```

3. **If NOT running, start it:**
   ```bash
   cd backend
   npm run dev
   ```

---

### 🔐 Step 2: Make Sure You're Logged In

**The checkout REQUIRES authentication!**

1. **Go to** `http://localhost:5173/login`
2. **Register a new account OR login**
3. **Check DevTools Console** should show:
   ```
   ✅ User is logged in
   ```

---

### 🔑 Step 3: Verify Razorpay Configuration

1. **Check backend `.env` file:**
   ```bash
   cat backend/.env
   ```

2. **Should have:**
   ```
   RAZORPAY_KEY_ID=rzp_test_1234567890abcd
   RAZORPAY_KEY_SECRET=test_secret_1234567890abcd
   ```

3. **If missing or different, update it:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Copy your TEST keys
   - Update `backend/.env` with your actual keys

---

### 🧪 Step 4: Check Browser Console for Clues

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **When you click "Pay" button**, look for logs:

#### Expected Success Logs:
```
✅ User is logged in
📤 Sending order request to backend...
✅ Order created: { orderId: "...", razorpayOrderId: "..." }
```

#### If Error, Check for:
```
❌ Error creating order: ...
```

**Copy this error message and report it!**

---

### 🔍 Step 5: Check Backend Logs

1. **Look at the backend terminal** where you ran `npm run dev`
2. **Should show logs like:**
   ```
   📦 Creating order with: {...}
   👤 User info: { _id: "...", email: "..." }
   🔍 Fetching products: [...]
   💳 Creating Razorpay order with amount: ...
   ✅ Razorpay order created: order_...
   ```

3. **If error, you'll see:**
   ```
   ❌ Error creating order: [error message]
   Full error: [detailed error]
   ```

---

## 🆘 Common Issues & Solutions

### Issue 1: "Please login first to proceed with checkout"
**Cause:** User not authenticated
**Solution:**
1. Go to `/login` page
2. Register or login with valid credentials
3. Then go to checkout again

### Issue 2: "Your cart is empty"
**Cause:** No items in cart
**Solution:**
1. Go back to `/products`
2. Add products to cart
3. Then go to checkout

### Issue 3: "Please fill in all required fields"
**Cause:** Missing delivery address, email, or phone
**Solution:**
1. Fill in **Delivery Address**
2. Enter valid **Email**
3. Enter valid **Phone Number** (10 digits)
4. Click Pay button

### Issue 4: "Cart is empty" or "Products not found"
**Cause:** Product IDs not matching between frontend and backend
**Solution:**
1. Clear localStorage: Run in console: `localStorage.clear()`
2. Refresh page
3. Add products again
4. Check console logs for product IDs

### Issue 5: "Payment gateway not configured"
**Cause:** Razorpay keys missing from `.env`
**Solution:**
1. Get TEST keys from https://dashboard.razorpay.com/app/keys
2. Update `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
   RAZORPAY_KEY_SECRET=test_secret_YOUR_KEY
   ```
3. Restart backend: `npm run dev`

---

## 📋 Complete Setup Checklist

### Frontend Ready?
- [ ] Running on `http://localhost:5173`
- [ ] No console errors
- [ ] Can add products to cart
- [ ] Cart shows correct totals

### Backend Ready?
- [ ] Running on `http://localhost:5000`
- [ ] Shows "MongoDB Connected"
- [ ] `.env` file has all keys set
- [ ] No startup errors

### User Authenticated?
- [ ] Can login/register
- [ ] Token stored in localStorage
- [ ] User info visible in localStorage

### Cart Data?
- [ ] Items in localStorage: `localStorage.getItem('cart')`
- [ ] Shows product names and prices
- [ ] Prices are numbers, not strings

### Razorpay Configured?
- [ ] TEST keys in `backend/.env`
- [ ] Keys not empty/dummy values
- [ ] Backend restarted after updating keys

---

## 🧪 Manual Testing Steps

### Test Complete Flow:
1. **Start backend:** `npm run dev`
2. **Start frontend:** `npm run dev`
3. **Open browser:** `http://localhost:5173`
4. **Register new account**
5. **Add 2-3 products to cart**
6. **Go to cart page** - Check totals are correct
7. **Click "Proceed to Checkout"**
8. **Fill in form:**
   - Address: "123 Main St, City"
   - Email: "test@example.com"
   - Phone: "1234567890"
9. **Click "Pay ₹XXX.XX"**
10. **Check browser console** for success logs
11. **Razorpay modal should open** with payment form

---

## 🐛 Debug Mode

**Enable detailed logging:**

In `frontend/src/pages/Checkout.jsx`, all important steps are already logged!

**Check Console for:**
- ✅ = Success
- ❌ = Error  
- 📦 = Data/Process
- 💳 = Payment system
- 👤 = Authentication

---

## 📞 Need More Help?

Collect and share:
1. **Console error** (F12 → Console tab)
2. **Backend terminal output** (where `npm run dev` is running)
3. **localStorage cart:** Run `console.log(JSON.parse(localStorage.getItem('cart')))`
4. **Backend .env** values (keys only, mask secret if needed)

