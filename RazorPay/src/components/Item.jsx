import React, { useState } from "react";
import axios from "axios";
import {load} from '@cashfreepayments/cashfree-js'

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter, 
    Typography,
    Button,
} from "@material-tailwind/react";

export default function Item() {

    let cashfree;

    let insitialzeSDK = async function () {
  
      cashfree = await load({
        mode: "sandbox",
      })
    }
  
    insitialzeSDK()
  
    const [orderId, setOrderId] = useState("")

    const getSessionId=async()=>{
        try {
            let res=await axios.get('https://localhost:8000/payment')
            if(res.data && res.data.Payment_session_id){
                console.log(res.data)
                setOrderId(res.data.order_id)
                return res.data.payment_session_id
            }
        } catch (error) {
            console.log(error);
        }
    }

    const HandelClick = async (e) => {
        e.preventDefault();
        try {

            let sessionId = await getSessionId()
            let checkoutOptions = {
              paymentSessionId : sessionId,
              redirectTarget:"_modal",
            }
      
            cashfree.checkout(checkoutOptions).then((res) => {
              console.log("payment initialized")
      
              verifyPayment(orderId)
            })
      
      
          } catch (error) {
            console.log(error)
          }
      
    }
    return (
        <>
            <style>
                {`
                    .card-container {
                        margin-top: 1.5rem;
                        width: 24rem;
                        background-color: #222f3e;
                        color: white;
                        border-radius: 0.5rem;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    }

                    .card-container:hover {
                        transform: translateY(-0.5rem);
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                    }

                    .card-header {
                        position: relative;
                        height: 30rem;
                        background-color: #2c3a47;
                        overflow: hidden;
                    }

                    .card-header img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease-in-out;
                    }

                    .card-header:hover img {
                        transform: scale(1.1);
                    }

                    .card-body {
                        padding: 1rem;
                        flex-grow: 1;
                    }

                    .card-body .title {
                        margin-bottom: 0.5rem;
                        font-size: 1.25rem;
                        font-weight: 600;
                    }

                    .card-body .price {
                        font-size: 1rem;
                        font-weight: 400;
                    }

                    .card-body .price span {
                        margin-left: 0.5rem;
                        text-decoration: line-through;
                        color: #ff6b6b;
                    }

                    .card-footer {
                        padding-top: 0;
                        padding-bottom: 1rem;
                    }

                    .card-footer .buy-button {
                        width: 100%;
                        background-color: #1b9cfc;
                        color: white;
                        font-size: 1rem;
                        font-weight: 500;
                        padding: 0.75rem;
                        border: none;
                        border-radius: 0.25rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
                    }

                    .card-footer .buy-button:hover {
                        background-color: #1a8fd9;
                        transform: translateY(-0.25rem);
                    }
                `}
            </style>
            <Card className="card-container">
                {/* CardHeader */}
                <CardHeader color="" className="card-header">
                    {/* Image  */}
                    <img
                        src="https://www.weddingsonline.in/blog/wp-content/uploads/2018/02/layers.jpg"
                        alt="card-image"
                    />
                </CardHeader>

                {/* CardBody */}
                <CardBody className="card-body">
                    {/* Typography For Title */}
                    <Typography variant="h5" className="title">
                        Wedding Dress For Bride
                    </Typography>

                    {/* Typography For Price  */}
                    <Typography className="price">
                        ₹350 <span>₹699</span>
                    </Typography>
                </CardBody>

                {/* CardFooter  */}
                <CardFooter className="card-footer">
                    {/* Buy Now Button  */}
                    <Button className="buy-button" onClick={HandelClick()}>Buy Now</Button>
                </CardFooter>
            </Card>
        </>
    );
}
