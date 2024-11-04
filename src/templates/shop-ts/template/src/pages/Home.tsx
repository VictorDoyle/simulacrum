import React from 'react';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

const Home: React.FC = () => {
  const products: Product[] = [
    { id: 1, title: 'Product 1', price: 29.99, imageUrl: '/path/to/image1.jpg' },
    { id: 2, title: 'Product 2', price: 49.99, imageUrl: '/path/to/image2.jpg' },
  ];

  return (
    <div>
      <h2>Welcome to Shop Template</h2>
      <div className="heroBanner">
        <img src='https://example.com/path/to/hero-image.jpg' alt='Welcome to our shop!' />
      </div>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
