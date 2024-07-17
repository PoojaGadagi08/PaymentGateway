import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import './App.css'; 

function App() {
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const initializeSDK = async () => {
      const cashfreeInstance = await load({
        mode: 'sandbox',
      });
      setCashfree(cashfreeInstance);
    };

    initializeSDK();
  }, []);

  const getSessionId = async () => {
    try {
      const res = await axios.get('http://localhost:8000/payment');

      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async () => {
    try {
      const res = await axios.post('http://localhost:8000/verify', {
        orderId: orderId,
      });

      if (res && res.data) {
        alert('payment verified');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const sessionId = await getSessionId();
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log('payment initialized');
        verifyPayment(orderId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Cashfree Payment Gateway</h1>
      <div className="card">
        <div className="card-header">
          <img
            src="https://www.weddingsonline.in/blog/wp-content/uploads/2018/02/layers.jpg"
            alt="Wedding Dress"
          />
        </div>
        <div className="card-body">
          <h2>Wedding Dress For Bride</h2>
          <p className="price">
            ₹350 <span>₹699</span>
          </p>
          <button className="buy-button" onClick={handleClick}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
