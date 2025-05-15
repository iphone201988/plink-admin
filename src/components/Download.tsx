import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Play } from 'lucide-react';
import img_1 from '../assets/img-1.webp'
import img_2 from '../assets/img-2.jpg'

const Download = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0593fe] to-blue-600 text-white overflow-hidden relative max-md:py-10">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 bg-cover bg-center"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Download Plink Today
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">
              Get started with Plink and transform how you organize and play sports. Available on iOS and Android.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#" 
                className="bg-white text-[#0593fe] font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Apple className="mr-2" />
                App Store
              </motion.a>
              
              <motion.a
                href="#"
                className="bg-white text-[#0593fe] font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="mr-2" />
                Google Play
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.img 
                src={img_1} 
                alt="App Screenshot" 
                className="rounded-lg shadow-2xl w-full h-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.img 
                src={img_2} 
                alt="App Screenshot" 
                className="rounded-lg shadow-2xl w-full h-auto mt-10"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Download;