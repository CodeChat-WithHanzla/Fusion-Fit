import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0A1128] text-[#FFD700] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold mb-4">
              <span className="text-[#FFD700]">Fusion Fit</span>
            </div>
            <p className="max-w-sm w-[80%] mx-auto md:mx-0">
              Fusion Fit is a fashion-forward e-commerce platform designed to help women find the perfect outfits based on their unique body types. Discover curated clothing selections tailored to enhance your natural style and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li className="hover:text-yellow-700 cursor-pointer transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-yellow-700 cursor-pointer transition-colors">
                Terms of Service
              </li>
              <li className="hover:text-yellow-700 cursor-pointer transition-colors">
                FAQs
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Phone: +92-300-0000000</li>
              <li>Email: contact@fusionfit.com</li>
              <li className="mt-4">
                <div className="flex justify-center md:justify-start space-x-6">
                  <span className="hover:text-green-400 cursor-pointer transition-colors">
                    Facebook
                  </span>
                  <span className="hover:text-green-400 cursor-pointer transition-colors">
                    Instagram
                  </span>
                  <span className="hover:text-green-400 cursor-pointer transition-colors">
                    Twitter
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 pt-4 border-t border-purple-700 text-sm">
        © {new Date().getFullYear()} Fusion Fit. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
