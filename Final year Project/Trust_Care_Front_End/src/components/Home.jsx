import React from 'react';
import { useNavigate } from "react-router-dom"; 
import Header from '../Header/Header.jsx';
import './Home.css';

function Home(){

  const navigate = useNavigate();

  return(
    <>
      <Header />

      <div className = 'HomeSection'>
        <div className = 'Home-Container'>

          {/* first box*/}
          <div className = 'Head-group'>
            <p className = 'para-01'>Connecting Hearts With Helping Hands</p>
            <p className = 'para-02'> Professional Care Services for your loved One</p>
          </div>

          {/*login button*/} 
          <div className = 'Button-group'>
            <button className = 'Login-service' onClick={()=>navigate("/serviceproviderloginpage")}>Login As a Service Provider</button>
            <button className = 'Login-family' onClick={()=>navigate("/familylogin")}>Login As a Family / Individual</button>
          </div>

          {/*Register button*/}
          <div className = 'Register'>
            <button className = 'Register-btn' onClick={() => navigate("/usertype")} >Register New Account </button>
          </div>

          {/* service */}
          <div className = 'Services'>
            <p className = 'Service-heading'>Our Services:</p>
            <p className = 'Service-body'>
              Elder Care<br/>
              Child Care<br/>
              Hospital Patient Care<br/>
              Home Patient Care<br/>
            </p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home;