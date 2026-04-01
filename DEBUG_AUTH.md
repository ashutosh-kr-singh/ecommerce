# Token & Authentication Debugging

## 🔍 Quick Debug Steps

### Step 1: Check if Token Exists
Open **DevTools Console** (F12) and run:

```javascript
console.log('Token:', localStorage.getItem('token'))
```

**Expected Output:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If you see:**
```
Token: null
```
👉 **You're NOT actually logged in!** Token wasn't saved.

---

### Step 2: Check User Info
Run in console:

```javascript
console.log('User:', JSON.parse(localStorage.getItem('user')))
```

**Should show:**
```
User: { _id: "...", name: "...", email: "..." }
```

---

### Step 3: Check API Configuration
Run in console:

```javascript
fetch('http://localhost:5000/api/payment/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    items: [],
    shippingAddress: 'test',
    customerEmail: 'test@test.com',
    customerPhone: '1234567890'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

**If successful:** Order created
**If 401:** Token is invalid or not being sent

---

## ✅ Complete Login + Checkout Flow

### 1. **Start Fresh**
```javascript
localStorage.clear()
```

### 2. **Register/Login**
- Go to `/register`
- Create new account with:
  - Email: `test@example.com`
  - Password: `Test123!@`
  - Name: `Test User`
- **Check Console** - Should see:
  ```
  🔐 Attempting login with: test@example.com
  ✅ Login successful: { token: "...", user: {...} }
  ✅ Token saved to localStorage
  ```

### 3. **Verify Token Saved**
Run in console:
```javascript
localStorage.getItem('token')  // Should show token, not null
```

### 4. **Add Products & Checkout**
- Add 2-3 products
- Go to checkout
- **Check Console** - Should show:
  ```
  🔐 Token from localStorage: ✅ Present
  ✅ Authorization header set
  📤 Request to: http://localhost:5000/api/payment/create-order
  ```

### 5. **Fill Form & Click Pay**
- Address: "123 Main St"
- Email: "test@example.com"
- Phone: "1234567890"
- Click "Pay ₹XXX.XX"

### 6. **Check for Success**
Should see in console:
```
✅ Order created: { orderId: "...", razorpayOrderId: "..." }
```

---

## 🆘 If Token is Missing (null)

### Issue 1: Not Logged In
**Symptom:** `localStorage.getItem('token')` returns `null`

**Fix:**
1. Go to `/login` page
2. Clear console
3. Enter valid credentials
4. **Watch console while logging in**
5. You MUST see:
   ```
   ✅ Login successful
   ✅ Token saved to localStorage
   ```

### Issue 2: Login Failed
**Symptom:** See error in console during login

**Check:**
1. Did you register first?
2. Is backend running? (`npm run dev` in backend folder)
3. MongoDB connected?
4. Did you use correct email/password?

### Issue 3: Token Expired
**Symptom:** Token exists but still getting 401

**Fix:**
1. Logout and login again:
   ```javascript
   localStorage.clear()
   ```
2. Then go to `/login` and login fresh

---

## 🧪 Advanced Debugging

### Check Backend Authorization Header
Open backend terminal where `npm run dev` is running.

**When you try to make the payment request, you should see:**
```
👤 User info: { _id: "...", email: "...", ... }
```

**If you see:**
```
👤 User info: undefined
```
👉 Backend is NOT receiving the token properly!

---

### Verify Token Format
Run in console:
```javascript
const token = localStorage.getItem('token');
console.log('Token length:', token?.length);
console.log('Starts with Bearer format:', token?.startsWith('eyJ'));
console.log('Full token:', token);
```

Should be a long string starting with `eyJ...`

---

### Test Backend Auth Directly
In console:

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/payment/my-orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

**If 200:** Authorization working! ✅
**If 401:** Token issue on backend

---

## 📋 Checklist

- [ ] Token exists: `localStorage.getItem('token')` not null
- [ ] Token has value: Long string starting with `eyJ`
- [ ] User info saved: `localStorage.getItem('user')` shows object
- [ ] Backend running: Terminal shows port 5000
- [ ] MongoDB connected: Backend shows "Connected"
- [ ] Console shows "Token from localStorage: ✅ Present"
- [ ] Authorization header being set: Console shows it
- [ ] Backend receives token: Check backend terminal logs

---

## 💬 Report Issue With

1. **Console output** - Copy-paste what you see
2. **Token value** - Run `localStorage.getItem('token')`
3. **Backend logs** - What you see in backend terminal
4. **Error details** - Any error messages with 401
