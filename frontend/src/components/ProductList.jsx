import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, addToCart , loading}) => {
    if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return 
    <div className="container">
      <p>No products available</p></div>;
  }

  return (
    <div className="container">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id || product._id} 
            product={product} 
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;