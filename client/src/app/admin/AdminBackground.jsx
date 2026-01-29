'use client'
import { motion } from 'framer-motion'

export default function AdminBackground({ children }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none sticky top-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-custom-accent/10 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -45, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]"
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
