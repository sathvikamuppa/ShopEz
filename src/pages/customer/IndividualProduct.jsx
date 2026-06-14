import React, { useContext, useEffect, useState } from 'react'
import '../../styles/IndividualProduct.css'
import { HiOutlineArrowSmLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { GeneralContext } from '../../context/GeneralContext'

const IndividualProduct = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const { fetchCartCount } = useContext(GeneralContext)

  const [product, setProduct] = useState(null)

  const [productQuantity, setProductQuantity] = useState(1)
  const [size, setSize] = useState('')

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:6001/api/products/fetch-product-details/${id}`
      )
      setProduct(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const buyNow = async () => {
    try {
      await axios.post(
        'http://localhost:6001/api/orders/buy-product',
        {
          name,
          email,
          mobile,
          address,
          pincode,

          title: product?.title,
          description: product?.description,

          mainImg: product?.imageUrl || product?.image || "",

          size,
          quantity: productQuantity,
          price: product?.price,
          discount: product?.discount,

          paymentMethod,
          orderDate: new Date()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Order placed successfully!")

      document
        .querySelectorAll('.modal-backdrop')
        .forEach(el => el.remove())

      document.body.classList.remove('modal-open')
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'

      navigate('/profile')

    } catch (err) {
      console.log(err)
      alert("Order failed")
    }
  }

  const handleAddToCart = async () => {
    try {
     await axios.post(
  'http://localhost:6001/api/cart/add-to-cart',
  {
    title: product?.title,
    description: product?.description,
    mainImg: product?.imageUrl || product?.image || "",
    size,
    quantity: productQuantity,
    price: product?.price,
    discount: product?.discount
  }
)

      fetchCartCount()

      alert("Added to cart")
      navigate('/cart')

    } catch (err) {
      console.log(err)
      alert("Failed")
    }
  }

  if (!product) return <h2>Loading...</h2>

  const imageSrc =
    product.imageUrl?.startsWith("http")
      ? product.imageUrl
      : `http://localhost:6001/${product.imageUrl || product.image}`

  return (
    <div className="IndividualProduct-page">

      <span onClick={() => navigate(-1)}>
        <HiOutlineArrowSmLeft />
        <p>back</p>
      </span>

      <div className="IndividualProduct-body">

        <img
          src={imageSrc}
          alt="product"
          style={{ width: "40%", margin: "0 5%" }}
        />

        <div className="IndividualProduct-data">

          <h3>{product.title}</h3>
          <p>{product.description}</p>

          <span>
            <label>Choose size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value=""></option>
              {product.sizes?.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </span>

          <span>
            <label>Quantity</label>
            <select
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </span>

          <span>
            <h5>
              <b>Price:</b> ₹ {parseInt(product.price - (product.price * product.discount) / 100)}
            </h5>
            <s>{product.price}</s>
            <p>({product.discount}% off)</p>
          </span>

          <h6><b>Rating:</b> 3.4/5</h6>

          <p className="delivery-date">
            Free delivery in 5 days
          </p>

          <div className="productBuyingButtons">

            <button
              data-bs-toggle="modal"
              data-bs-target="#buyModal"
            >
              Buy Now
            </button>

            <button onClick={handleAddToCart}>
              Add To Cart
            </button>

          </div>

        </div>

      </div>

      <div
        className="modal fade"
        id="buyModal"
        tabIndex="-1"
      >

        <div className="modal-dialog">

          <div className="modal-content">

            <div className="modal-header">
              <h5>Checkout</h5>
            </div>

            <div className="modal-body">

              <input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Mobile"
                onChange={(e) => setMobile(e.target.value)}
              />

              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                placeholder="Pincode"
                onChange={(e) => setPincode(e.target.value)}
              />

              <select
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment</option>
                <option value="cod">COD</option>
                <option value="upi">UPI</option>
              </select>

            </div>

            <div className="modal-footer">

              <button
                data-bs-dismiss="modal"
                onClick={buyNow}
              >
                Place Order
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default IndividualProduct