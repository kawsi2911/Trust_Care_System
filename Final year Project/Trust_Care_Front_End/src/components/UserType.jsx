import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import './UserType.css';


function UserType(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <div className = 'User-Home'>
                <div className = 'user-contain'>
                    <p className = 'para'>Select Account Type</p>
        
                    <div className = 'User-body'>
                        <button className = 'Body1' onClick={() => navigate("/serviceprovider1")}>
                            <div className = 'emoji'>👩‍⚕️</div>
                            <p className = 'head'>Service Provider</p>
                            <p className = 'small'>I want to provide the Services</p>
                        </button>
                        <button className = 'Body2'onClick ={() =>navigate("/familyregister")}>
                            <div className = 'emoji'>👨‍👩‍👦</div>
                            <p className = 'head2'>Service Taker</p>
                            <p className = 'small2'>I need the Services</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserType;