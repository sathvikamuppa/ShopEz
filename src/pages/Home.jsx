import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import HomeBanner from "../images/home-banner-2.png";
import Products from "../components/Products";
import Footer from "../components/Footer";
import FlashSale from "../components/FlashSale";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [bannerImg, setBannerImg] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6001/api/banners"
      );

      if (response.data) {
        setBannerImg(response.data);
      }
    } catch (err) {
      console.log(
        "Banner storage unconfigured, skipping safely:",
        err.message
      );
      setBannerImg(null);
    }
  };

  const categories = [
    {
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
    },
    {
      name: "Electronics",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
    },
    {
      name: "Mobiles",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    },
    {
      name: "Groceries",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
    },
    {
      name: "Sports Equipments",
      img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
    },
  ];

  return (
    <div className="HomePage">

      {/* Banner Section */}
      <div className="home-banner">
        {bannerImg ? (
          <img src={bannerImg} alt="Dynamic Banner" />
        ) : (
          <img src={HomeBanner} alt="Default Banner" />
        )}
      </div>

      {/* Categories */}
      <div className="home-categories-container">
        {categories.map((category, index) => (
          <div
            className="home-category-card"
            key={index}
            onClick={() => navigate(`/category/${category.name}`)}
          >
            <img src={category.img} alt={category.name} />
            <h5>{category.name}</h5>
          </div>
        ))}
      </div>

      {/* Flash Sale */}
      <FlashSale />

      {/* Products */}
      <div id="products-body">
        <Products category="all" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;