"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { text } from 'stream/consumers';

const BheemaLoader = () => {
  const companyName = "BheemaInfotech";
  
  const letterVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
   
      <div className="flex space-x-1">
        {companyName.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
            className="text-2x font-medium tracking-tight text-[#5A0F2E]"
          >
            {char}
          </motion.span>
        ))}
      </div>
  );
};

export default BheemaLoader;