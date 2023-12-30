import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative bg-cover bg-center bg-no-repeat sm:h-full"
      style={{ backgroundImage: 'url(https://a0.muscache.com/im/pictures/df193444-09e7-4c34-b9e1-d706166c21a2.jpg?im_w=1200)', height: '70vh' }} 
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
        <motion.h1
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center"
        >
          Making a Difference Together
        </motion.h1>
        <motion.p
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center"
        >
          Join our community of donors, volunteers, and advocates to support those in need.
        </motion.p>
        {/* Call to Action Button */}
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-6"
        >
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-center"
          >
            <FiHeart className="mr-2" />
            Donate Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
