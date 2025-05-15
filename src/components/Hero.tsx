import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import app_img from '../assets/splash-screen.png';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="relative inline-block mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* <span className="absolute -inset-1 bg-gradient-to-r from-[#0593fe] to-[#c4ff00] blur opacity-30 rounded-lg"></span> */}
              <h1 className="relative text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                Find pickleball  <br />{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0593fe] to-[#c4ff00]">
                 near you
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover pickleball courts, <br /> join and create games near you.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="group relative px-8 py-4 overflow-hidden rounded-full bg-[#0593fe] text-white text-lg font-medium transition-all duration-300 ease-out hover:bg-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                Download App
              </motion.button>
              
              {/* <motion.button
                className="group relative px-8 py-4 overflow-hidden rounded-full bg-transparent border-2 border-[#0593fe] text-[#0593fe] text-lg font-medium transition-all duration-300 ease-out hover:bg-blue-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-[#0593fe] opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                Learn More
              </motion.button> */}
            </motion.div>

            <motion.div
              className="mt-12 flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">50K+</span>
                <span className="text-gray-600">Active Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">100+</span>
                <span className="text-gray-600">Cities</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">4.9★</span>
                <span className="text-gray-600">App Rating</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[640px]">
              <motion.div 
                className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-[#0593fe] to-[#c4ff00] p-1 shadow-2xl"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full rounded-[35px] bg-white overflow-hidden">
                  <img 
                    src={app_img}
                    alt="Plink App Screen" 
                    className="w-full h-full object-cover object-[0_-40px]"
                  />
                </div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -right-8 -top-8 w-20 h-20 bg-[#c4ff00] rounded-full opacity-20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -left-8 -bottom-8 w-24 h-24 bg-[#0593fe] rounded-full opacity-20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <a href="#features" className="text-gray-400 flex flex-col items-center">
          <span className="mb-2">Scroll Down</span>
          <div className="w-5 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </a>
      </motion.div>
    </div>
  );
};

export default Hero;