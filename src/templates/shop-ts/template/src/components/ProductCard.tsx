import React from 'react';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    originalPrice: number;
    imageUrl: string;
    salePrice: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.originalPrice.toFixed(2)}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
