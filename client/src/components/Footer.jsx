import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t bg-neutral-50">
      <div className="container mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-neutral-600 text-sm">
        <p className="text-center lg:text-left">© All Rights Reserved 2025</p>

        <div className="flex items-center gap-5 text-xl">
          <a href="" className="hover:text-primary-200 transition-colors duration-200">
            <FaFacebook />
          </a>
          <a href="" className="hover:text-primary-200 transition-colors duration-200">
            <FaInstagram />
          </a>
          <a href="" className="hover:text-primary-200 transition-colors duration-200">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
