import React from 'react';
import logo from '../assets/logo.png';
import './Header.css';
import { useNavigate } from "react-router-dom"

function Header() {

  const navigate = useNavigate();

  return (
    <header className = 'header' style = {{ backgroundColor: 'blue' }}>
      <div className = 'header-container'>
        <img src = {logo} alt = 'Logo' className = 'logo' onClick = {()=>navigate("/")} />
        <div>
          <h1 className = 'heading'>Trust Care System – Health Care</h1>
          <p className = 'sentences'>Connecting Hearts with Helping Hands</p>
        </div>
      </div>
    </header>
  );
}

export default Header;