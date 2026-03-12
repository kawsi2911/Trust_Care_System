import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./MakePayment.css";


function MakePayment(){

    const navigate = useNavigate();

    return(
        <>
            <Header />

            <div className = "ServiceProviderSection">
                <div className = "ServiceProviderSection2">

                    <div className = "name">
                        
                        <div className="heading-head">
                            <p className = "Head">Make the Payment</p>
                        </div>

                        <div className = "Logout">
                            <button onClick = {()=>navigate("/")}>➜] Logout</button>
                        </div>
                    </div>

                    <div className = "booking-container">
                            
                        <p className = "provider-name"><strong>Service Summary</strong></p>

                        <div className="summary">
                            <p><strong>Service Type : </strong>Hospital Patient Care</p>
                            <p><strong>Provider : </strong>Mr.kaerhick</p>
                            <p><strong>Duration : </strong>1 week </p>
                            <p><strong>Rate : </strong>Rs.24000/week</p>
                        </div>

                        <div className="cost">
                            <span>Total Cost:</span>
                            <span className="price">Rs. 24,000 / month</span>
                        </div>
                           
                    </div>

                    <div className = "options">
                        
                        <p className = "heading-options">Preferred Caregiver Payment</p>
                        
                        <div className = 'card-options'>
                            <input type = 'radio' id = 'card' name = 'payment' /> <label htmlFor = 'card'>Credit / Debit Card</label>
                            <input type = 'radio' id = 'online' name = 'payment' /> <label htmlFor = 'online'>Bank Transfer</label>
                            <input type = 'radio' id = 'cash' name = 'payment' /> <label htmlFor = 'cash'>Cash on Services</label>
                        </div>

                    </div>

                    <div className = "options">

                        <div className="form-group">
                            <p className = "heading-options">Card Number</p>
                            <input type = 'text' id = 'cardnumber' name = 'cardnumber' placeholder = '1234 5678 0972 3456' /> 
                        </div>

                        <div className="form-groups">

                            <div className = "firstgroup">
                                <p className = "heading-options">Expiry Date</p>
                                <input type="text" id="E-date" name="E-date" placeholder="MM/YY" pattern="\d{2}/\d{2}" maxLength="5"/>
                            </div>  

                            <div className = "secondgroup">
                                <p className = "heading-options">CVV</p>
                                <input type="text" id="cvv" name ="seconds" placeholder="123" maxLength={3}/>   
                            </div>                          
                        
                        </div>

                        <div className="form-group">
                            <p className = "heading-options">Card Holder Name</p>
                            <input type = 'text' id = 'cardnumber' name = 'cardnumber' placeholder = 'name of the card' /> 
                        </div>

                        <div className = "QServices">
                            <button className = "confirms" onClick = {()=>navigate("/bookingconfirm")}> 💳Pay Rs.75000.00</button>
                        </div>

                        <p className = "paymenthead">🔒Secure Payment Powered by PayHere</p>
                        
                    </div>

                </div>
            </div>
        </>
    )
}

export default MakePayment;