# Cart Data Debugging Guide

## 🔍 How to Debug Cart Issues

### Step 1: Open Browser DevTools
- **Windows/Linux**: Press `F12`
- **Mac**: Press `Cmd + Option + I`
- Go to the **Console** tab

### Step 2: Check Console Logs
When you add items to cart, look for logs like:

```
✅ Adding to cart: {
  _id: "product_id_here",
  name: "Tablet",
  price: 399,
  ...
}

📦 Item: Tablet, Price: ₹399, Qty: 1, Subtotal: ₹399

💰 TOTALS → Subtotal: ₹399.00 | GST (18%): ₹71.82 | Total: ₹470.82
```

### Step 3: Check LocalStorage
Run this in console:
```javascript
console.log(JSON.parse(localStorage.getItem('cart')))
```

You should see:
```javascript
[
  {
    id: "product_id",
    product: "product_id",
    _id: "product_id",
    name: "Tablet",
    price: 399,
    qty: 1,
    // ... other fields
  }
]
```

### Step 4: Expected Values
For a **Tablet (₹399 each)**, you should see:

| Item | Price | Qty | Subtotal |
|------|-------|-----|----------|
| Tablet | ₹399 | 1 | ₹399 |
| **Subtotal** | | | **₹399.00** |
| **GST (18%)** | | | **₹71.82** |
| **Total** | | | **₹470.82** |

### Step 5: If Values Are Wrong
Check:
1. Is the **price** showing as a number in console (not string)?
2. Is the **qty** correct?
3. Are there **NaN** values anywhere?

### Step 6: Clear and Retry
If still broken, clear everything and try again:
```javascript
localStorage.clear()
```

Then:
1. Refresh the page
2. Add item to cart again
3. Check console logs

---

## 📋 What If Console Shows Issues?

### Issue 1: Price is "1" instead of "399"
**Cause**: Product data not being captured correctly
**Fix**: Let me check your product structure

### Issue 2: No console logs appearing
**Cause**: Something is preventing logs from showing
**Fix**: Try in a fresh incognito window

### Issue 3: localStorage is empty
**Cause**: Cart not being saved
**Fix**: Check if browser allows localStorage

---

## 🆘 Tell Me What You See
Please report:
1. What console logs appear (copy-paste them)
2. What localStorage shows (run the command above)
3. What values display on checkout page
