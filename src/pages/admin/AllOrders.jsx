import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/AllOrders.css'

const AllOrders = () => {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        "http://localhost:6001/api/orders/fetch-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setOrders(res.data || [])

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="all-orders-page">

      <h3>All Orders</h3>

      <div className="all-orders">

        {orders.length === 0 && <p>No orders found</p>}

        {orders.map((order) => {

          const src = order.imageUrl

          return (
            <div className="all-orders-order" key={order._id}>

              <img
                src={src}
                alt="product"
                onError={(e) => {
                  console.log("Image failed:", src)
                }}
              />

              <div className="all-orders-order-data">

                <h4>{order.title}</h4>
                <p>{order.description}</p>

                <div>

                  <span>
                    <p><b>Price:</b> ₹ {order.price}</p>
                  </span>

                  <span>
                    <h5><b>Status:</b> {order.orderStatus}</h5>
                  </span>

                  <span>
                    <p><b>Name:</b> {order.name}</p>
                  </span>

                </div>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default AllOrders