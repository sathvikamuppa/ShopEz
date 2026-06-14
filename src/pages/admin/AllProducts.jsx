import React, { useEffect, useState } from 'react'
import '../../styles/AllProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(()=>{
        fetchData();
    }, [])

    const fetchData = async() =>{
        try {
            const productRes = await axios.get('http://localhost:6001/api/products/fetch-products')
            setProducts(productRes.data || []);
            setVisibleProducts(productRes.data || []);

            const categoryRes = await axios.get('http://localhost:6001/api/products/fetch-categories')
            setCategories(categoryRes.data || []);
        } catch (err) {
            console.log(err);
        }
    }

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    const handleCategoryCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setCategoryFilter([...categoryFilter, value]);
        }else{
            setCategoryFilter(categoryFilter.filter(size=> size !== value));
        }
    }

    const handleGenderCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setGenderFilter([...genderFilter, value]);
        }else{
            setGenderFilter(genderFilter.filter(size=> size !== value));
        }
    }

    const handleSortFilterChange = (e) =>{
        const value = e.target.value;
        setSortFilter(value);

        let sorted = [...visibleProducts];

        if(value === 'low-price'){
            sorted.sort((a,b)=> (a.price || 0) - (b.price || 0))
        } 
        else if (value === 'high-price'){
            sorted.sort((a,b)=> (b.price || 0) - (a.price || 0))
        }
        else if (value === 'discount'){
            sorted.sort((a,b)=> (b.discount || 0) - (a.discount || 0))
        }

        setVisibleProducts(sorted);
    }

    useEffect(()=>{
        if (categoryFilter.length > 0 && genderFilter.length > 0){
            setVisibleProducts(products.filter(product=> 
                categoryFilter.includes(product?.category) && genderFilter.includes(product?.gender)
            ));
        } 
        else if(categoryFilter.length === 0 && genderFilter.length > 0){
            setVisibleProducts(products.filter(product=> 
                genderFilter.includes(product?.gender)
            ));
        } 
        else if(categoryFilter.length > 0 && genderFilter.length === 0){
            setVisibleProducts(products.filter(product=> 
                categoryFilter.includes(product?.category)
            ));
        } 
        else{
            setVisibleProducts(products);
        }
    }, [categoryFilter, genderFilter, products])

    return (
        <div className="all-products-page">
            <div className="all-products-container">

                {/* FILTER */}
                <div className="all-products-filter">
                    <h4>Filters</h4>

                    <div className="all-product-filters-body">

                        {/* SORT */}
                        <div className="all-product-filter-sort">
                            <h6>Sort By</h6>

                            <div className="all-product-filter-sort-body all-product-sub-filter-body">
                                {['popularity','low-price','high-price','discount'].map((type)=>(
                                    <div className="form-check" key={type}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="sortFilter"
                                            value={type}
                                            checked={sortFilter === type}
                                            onChange={handleSortFilterChange}
                                        />
                                        <label className="form-check-label">{type}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CATEGORY */}
                        <div>
                            <h6>Categories</h6>
                            <div className="all-product-sub-filter-body">
                                {categories?.map((category)=>(
                                    <div className="form-check" key={category}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category}
                                            checked={categoryFilter.includes(category)}
                                            onChange={handleCategoryCheckBox}
                                        />
                                        <label>{category}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GENDER */}
                        <div>
                            <h6>Gender</h6>
                            <div className="all-product-sub-filter-body">
                                {['Men','Women','Unisex'].map((gender)=>(
                                    <div className="form-check" key={gender}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={gender}
                                            checked={genderFilter.includes(gender)}
                                            onChange={handleGenderCheckBox}
                                        />
                                        <label>{gender}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="all-products-body">
                    <h3>All Products</h3>

                    <div className="all-products">

                        {visibleProducts?.map((product)=>{

                            const rawImg = product?.imageUrl || product?.image;
                            const imgSrc = rawImg
                                ? (rawImg.startsWith('http')
                                    ? rawImg
                                    : `http://localhost:6001/${rawImg}`)
                                : "/placeholder.png";

                            return(
                                <div className='all-product-item' key={product?._id}>
                                    <div className="all-product">

                                        <img
                                            src={imgSrc}
                                            alt={product?.title || "product"}
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                backgroundColor: "#f3f3f3"
                                            }}
                                        />

                                        <div className="all-product-data">
                                            <h6>{product?.title || "No Title"}</h6>

                                            <p>
                                                {(product?.description || "No description")
                                                    .toString()
                                                    .slice(0,30)}...
                                            </p>

                                            <h5>
                                                ₹{parseInt((product?.price || 0) - ((product?.price || 0) * (product?.discount || 0))/100)}
                                                <s>{product?.price || 0}</s>
                                                <p>({product?.discount || 0}% off)</p>
                                            </h5>
                                        </div>

                                        <button onClick={()=> navigate(`/update-product/${product?._id}`)}>
                                            Update
                                        </button>

                                    </div>
                                </div>
                            )
                        })}

                    </div>

                </div>

            </div>
        </div>
    )
}

export default AllProducts