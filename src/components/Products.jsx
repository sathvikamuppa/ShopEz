import React, { useEffect, useState } from 'react';
import '../styles/Products.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = (props) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props.category]);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(
        'http://localhost:6001/api/products/fetch-products'
      );

      const catRes = await axios.get(
        'http://localhost:6001/api/products/fetch-categories'
      );

      const filtered =
        props.category === 'all'
          ? prodRes.data
          : prodRes.data.filter(
              product =>
                product.category.toLowerCase() ===
                props.category.toLowerCase()
            );

      setProducts(filtered);
      setVisibleProducts(filtered);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;

    setCategoryFilter((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((c) => c !== value)
    );
  };

  const handleGenderCheckBox = (e) => {
    const value = e.target.value;

    setGenderFilter((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((g) => g !== value)
    );
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);

    let sorted = [...visibleProducts];

    if (value === 'low-price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'high-price') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === 'discount') {
      sorted.sort((a, b) => b.discount - a.discount);
    }

    setVisibleProducts(sorted);
  };

  useEffect(() => {
    let filtered = [...products];

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((p) =>
        categoryFilter.includes(p.category)
      );
    }

    if (genderFilter.length > 0) {
      filtered = filtered.filter((p) =>
        genderFilter.includes(p.gender)
      );
    }

    setVisibleProducts(filtered);
  }, [categoryFilter, genderFilter, products]);

  return (
    <div className="products-container">

      <div className="products-filter">

        <h4>Filters</h4>

        <div className="product-filters-body">

          <div className="filter-sort">

            <h6>Sort By</h6>

            <div className="filter-sort-body sub-filter-body">

              {['popularity', 'low-price', 'high-price', 'discount'].map(
                (type) => (
                  <div className="form-check" key={type}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      id={type}
                      value={type}
                      checked={sortFilter === type}
                      onChange={handleSortFilterChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor={type}
                    >
                      {type.replace('-', ' ')}
                    </label>
                  </div>
                )
              )}

            </div>

          </div>

          {props.category === 'all' && (
            <div className="filter-categories">

              <h6>Categories</h6>

              <div className="filter-categories-body sub-filter-body">

                {categories.map((category) => (
                  <div className="form-check" key={category}>

                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={category}
                      id={category}
                      checked={categoryFilter.includes(category)}
                      onChange={handleCategoryCheckBox}
                    />

                    <label
                      className="form-check-label"
                      htmlFor={category}
                    >
                      {category}
                    </label>

                  </div>
                ))}

              </div>

            </div>
          )}

          {props.category === 'fashion' && (
            <div className="filter-gender">

              <h6>Gender</h6>

              <div className="filter-gender-body sub-filter-body">

                {['Men', 'Women', 'Unisex'].map((gender) => (
                  <div className="form-check" key={gender}>

                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={gender}
                      id={gender}
                      checked={genderFilter.includes(gender)}
                      onChange={handleGenderCheckBox}
                    />

                    <label
                      className="form-check-label"
                      htmlFor={gender}
                    >
                      {gender}
                    </label>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

      <div className="products-body">

        <h3>All Products</h3>

        <div className="products">

          {visibleProducts.map((product) => {

            const finalUrl = product.imageUrl || product.image || '';

            const completeSrc = finalUrl.startsWith('http')
              ? finalUrl
              : `http://localhost:6001/${finalUrl}`;

            return (
              <div
                className="product-item"
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >

                <div className="product">

                  <img
                    src={completeSrc}
                    alt={product.title}
                  />

                  <div className="product-data">

                    <h6>{product.title}</h6>

                    <p>
                      {product.description
                        ? product.description.slice(0, 30)
                        : ''}
                      ...
                    </p>

                    <h5>
                      ₹{' '}
                      {parseInt(
                        product.price -
                          (product.price * product.discount) / 100
                      )}

                      <s>{product.price}</s>

                      <small>
                        ({product.discount}% off)
                      </small>
                    </h5>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default Products;