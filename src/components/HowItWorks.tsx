import React from 'react'
import { motion } from 'framer-motion';
import icon_1 from '../assets/create-icon.svg';
import icon_2 from '../assets/share-icon.svg';
import icon_3 from '../assets/addplayer-icon.svg';

const HowItWorks = () => {
  return (
    <section id='Works' className="py-20 bg-[#C4FF00] max-md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-[40px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it <span className="text-[#0593fe]">works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          It's easy and simple to use our app
          </p>
        </motion.div>
         <motion.div>
   <div className=" flex gap-[24px] justify-center flex-wrap">
     <div className=" bg-white rounded-[16px] p-[24px] max-w-[420px]">
        <img className='w-[40px] mb-[6px]' src={icon_1} alt="" />
        <h4 className='text-[24px] font-bold'>Create a Session</h4>
        <p className='text-[18px]'>Create your game, complete with confirmed players and skill ratings.</p>
    </div>
     <div className=" bg-white rounded-[16px] p-[24px] max-w-[420px]">
        <img className='w-[40px] mb-[6px]' src={icon_2} alt="" />
        <h4 className='text-[24px] font-bold'>Share the Link</h4>
        <p className='text-[18px]'>Send an invite to your friend you want to play with.</p>
    </div>
     <div className=" bg-white rounded-[16px] p-[24px] max-w-[420px]">
        <img className='w-[40px] mb-[6px]' src={icon_1} alt="" />
        <h4 className='text-[24px] font-bold'>Fill Your Game</h4>
        <p className='text-[18px]'>Gather responses and hit the court! We’ll automatically maintain a waitlist in case someone bails.</p>
    </div>
   </div>

         </motion.div>

       

      
      </div>
    </section>
  )
}

export default HowItWorks
