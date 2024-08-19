import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#090617] text-white py-4">
      <div className=" mx-auto text-center">
        <p className="text-sm mb-2">© {new Date().getFullYear()} KrayIN. All rights reserved.</p>
        <p className="text-sm">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> | 
          <a href="/terms-of-service" className="hover:underline"> Terms of Service</a>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
