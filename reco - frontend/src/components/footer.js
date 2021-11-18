import React from 'react';
import {Link} from 'react-router-dom';

const footerStyle = {
    padding: '1rem',
    width: '100%'
};

const lineStyle = {
    color: '#000000',
    border: '5px',
    opacity: '5',
    margin: "10px"
};

const linkStyle = {
    color: 'black',
    textAlign: 'center'
};

const dividerStyle = {
    textAlign: 'center',
    margin: "0px 10px"
};

const footerLinkStyle = {
    color: 'green',
    margin: "20px 0px"
};


const Footer = () => {
    return (
        <div style={footerStyle}>
        <hr  style={lineStyle} />
        <p style={footerLinkStyle} className="d-flex justify-content-center">  
            <Link style={linkStyle} to="/about-us">About Us</Link>
            <span style={dividerStyle}>|</span>
            <Link style={linkStyle} to="/privacy-policy">Privacy Policy</Link>
            <span style={dividerStyle}>|</span>
            <Link style={linkStyle} to="/contact-us">Contact Us</Link>
        </p>
        <hr style={lineStyle} />
      </div>
    );
};

export default Footer;