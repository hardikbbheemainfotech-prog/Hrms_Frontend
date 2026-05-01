"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CompanySpinner = () => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="w-18 h-18 border-3 border-[#f0e5df] border-t-[#5A0F2E] border-b-[#5A0F2E] border-r-[#5A0F2E]  rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute w-8 h-8 bg-[#5A0F2E] rounded-lg flex items-center justify-center shadow-lg shadow-[#5A0F2E]/10"
      >
        <span className="text-white font-bold text-lg">B</span>
      </motion.div>
    </div>
  );
};

export default CompanySpinner;