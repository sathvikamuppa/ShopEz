import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FlashSale.css';

const FlashSale = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFlashProducts();
  }, []);

  const fetchFlashProducts = async () => {
    try {
      const res = await axios.get(
        'http://localhost:6001/api/products/fetch-products'
      );

      const flashProducts = [...res.data]
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 6);

      setProducts(flashProducts);
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
    }
  };

  return (
    <div className="flashSaleContainer">
      <h3>Flash Sale</h3>

      <div className="flashSale-body">
        {products.map((product) => (
          <div className="flashSaleCard" key={product._id}>
            <img
              src={product.imageUrl}
              alt={product.title}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30d?auto=format&fit=crop&w=800&q=80';
              }}
            />

            <div className="flashSaleCard-data">
              <h6>{product.title}</h6>

              <p>
                {product.description
                  ? product.description.slice(0, 40)
                  : ''}
              </p>

              <h5>{product.discount}% OFF</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;