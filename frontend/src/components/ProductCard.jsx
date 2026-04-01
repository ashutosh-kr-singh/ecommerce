
import React ,{useState} from 'react';

const ProductCard = ({ product, addToCart }) => {
  const [imageError, setImageError] =useState(false);

  const handleImageError = (e) => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    console.log('ProductCard clicking add to cart with:', {
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    addToCart(product);
  };

  return (
    <div className="product-card">
      <img 
        src={imageError ? '/images/placeholder.jpg' : product.image} 
        alt={product.name} 
        className="product-image"
        onError={handleImageError}
      />
      <h3>{product.name}</h3>
      <p className="description">{product.description}</p>
      <p className="price">₹{product.price}</p>
      <p className="stock">Stock: {product.stock}</p>
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;