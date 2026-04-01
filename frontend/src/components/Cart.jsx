import React from 'react';

const Cart = ({ cart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <p>Items: {cart.length}</p>
      <p className="total">Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default Cart;