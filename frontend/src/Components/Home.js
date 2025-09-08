import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { FaExchangeAlt, FaBook, FaLaptop, FaTshirt, FaTicketAlt, FaComments, FaFilter, FaShieldAlt, FaIdCard, FaSearch, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const categories = [
    { icon: <FaBook className="text-4xl" />, title: 'Textbooks', description: 'Buy and sell course materials' },
    { icon: <FaLaptop className="text-4xl" />, title: 'Electronics', description: 'Laptops, tablets, and gadgets' },
    { icon: <FaTshirt className="text-4xl" />, title: 'Dorm Essentials', description: 'Furniture, appliances, and more' },
    { icon: <FaTicketAlt className="text-4xl" />, title: 'Event Tickets', description: 'Sports, concerts, and campus events' },
  ];
  
  const features = [
    { icon: <FaIdCard className="text-2xl" />, title: 'Student ID Verification', description: 'Trade with verified college students only' },
    { icon: <FaComments className="text-2xl" />, title: 'Real-Time Chat', description: 'Message buyers and sellers directly' },
    { icon: <FaFilter className="text-2xl" />, title: 'Smart Filters', description: 'Find exactly what you need with filters' },
    { icon: <FaShieldAlt className="text-2xl" />, title: 'Secure Transactions', description: 'Trade with confidence on our secure platform' },
  ];
  
  const steps = [
    { number: 1, title: 'Create Account', description: 'Sign up with your student email and verify your ID' },
    { number: 2, title: 'List Items', description: 'Post what you want to sell with photos and details' },
    { number: 3, title: 'Connect & Chat', description: 'Message buyers/sellers to arrange details' },
    { number: 4, title: 'Meet & Exchange', description: 'Complete the transaction safely on campus' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  const handleVerificationClick = () => {
    navigate('/signup');
  };

 const handleBrowseClick = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    navigate("/finditem");
  } else {
    navigate("/login"); 
  }
};

const sell = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    navigate("/reportitem");
  } else {
    navigate("/login");
  }
};


  // Animation variants for the moving text
  const movingTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Redesigned */}
      <section className="py-12 text-white bg-gradient-to-r from-blue-400 to-blue-600 md:py-16 lg:py-24">
        <div className="container flex flex-col items-center px-4 mx-auto md:flex-row">
          {/* Left side - Text content with animations */}
          <div className="flex flex-col mb-10 md:w-1/2 md:mb-0 md:pr-10">
            <motion.h1 
              className="mb-6 text-4xl font-bold md:text-5xl"
              initial="hidden"
              animate="visible"
              variants={movingTextVariants}
              custom={0}
            >
              Buy & Sell Within Your <span className="text-yellow-300">Campus Community</span>
            </motion.h1>
            
            <motion.p 
              className="max-w-2xl mb-8 text-xl"
              initial="hidden"
              animate="visible"
              variants={movingTextVariants}
              custom={1}
            >
              The hyperlocal marketplace exclusively for college students. Trade textbooks, gadgets, and dorm essentials safely and easily.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 mt-4"
              initial="hidden"
              animate="visible"
              variants={movingTextVariants}
              custom={2}
            >
              <button 
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleBrowseClick}
              >
                Browse Items
              </button>
              <button 
                className="px-6 py-3 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-blue-50"
                onClick={sell}
              >
                Start Selling
              </button>
            </motion.div>
          </div>
          
          {/* Right side - Image */}
          <div className="md:w-1/2">
            <motion.div 
              className="overflow-hidden shadow-2xl rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <img 
                src="banner.JPG" 
                alt="Students on campus exchanging items" 
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-blue-600">Why Choose UniBazzar?</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Designed specifically for college students by college students</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="p-6 text-center transition-shadow bg-blue-50 rounded-xl hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-600 bg-blue-100 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-blue-600">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-blue-600">Popular Categories</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div 
                key={index} 
                className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center h-32 text-blue-600 bg-blue-100">
                  {category.icon}
                </div>
                <div className="p-6 text-center">
                  <h3 className="mb-2 text-xl font-semibold">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-blue-600">How It Works</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Get started in just a few simple steps</p>
          </div>
          
          <div className="flex flex-col justify-between max-w-4xl mx-auto md:flex-row">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative flex flex-col items-center flex-1 px-4 mb-10 text-center md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center w-10 h-10 mb-4 font-bold text-white bg-blue-500 rounded-full">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-blue-200 -z-10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Verified Student Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Our secure student ID verification ensures that you're trading exclusively with members of your campus community. 
            Enjoy peace of mind knowing that every user is a verified student.
          </p>
          <button 
            className="px-6 py-3 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-blue-50"
            onClick={handleVerificationClick}
          >
            Verify Your Student ID Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 text-white bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center mb-6 space-x-2">
                <FaExchangeAlt className="text-xl text-blue-400" />
                <span className="text-xl font-bold">CampusSwap</span>
              </div>
              <p className="mb-6 text-gray-400">
                The hyperlocal marketplace designed exclusively for college students to buy and sell within their campus community.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-700 rounded-full hover:bg-blue-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-700 rounded-full hover:bg-blue-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-700 rounded-full hover:bg-blue-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Browse Items</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Sell Items</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">My Account</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Chat</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-6 text-lg font-semibold">Help & Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Safety Guidelines</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-6 text-lg font-semibold">Newsletter</h3>
              <p className="mb-4 text-gray-400">Subscribe to get updates on new features and campus events</p>
              <form onSubmit={handleSubscribe} className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 text-white bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
                <button type="submit" className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-r-lg hover:bg-blue-600">
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 text-center text-gray-400 border-t border-gray-700">
            <p>&copy; 2025 CampusSwap. All rights reserved. Designed for college students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;