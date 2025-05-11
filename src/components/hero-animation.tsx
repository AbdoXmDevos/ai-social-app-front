"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

const HeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation for floating elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  }

  // Animation for rotating elements
  const rotatingAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  }

  return (
    <div className="relative h-[500px] w-full" ref={containerRef}>
      {/* Main dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] max-w-[500px]"
      >
        <div className="bg-gray-900 rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-4 h-6 w-40 bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="h-10 bg-gray-800 rounded-lg mb-4"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-6 bg-purple-800/40 rounded"></div>
                  <div className="h-6 bg-blue-800/40 rounded"></div>
                  <div className="h-6 bg-green-800/40 rounded"></div>
                </div>
              </div>

              <div className="col-span-2 mt-4">
                <div className="h-40 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg flex items-center justify-center">
                  <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="h-24 bg-gray-800 rounded-lg"></div>
              <div className="h-24 bg-gray-800 rounded-lg"></div>

              <div className="col-span-2 mt-2">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2 mt-2"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-[15%] left-[10%] h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 blur-sm"
      ></motion.div>

      <motion.div
        animate={floatingAnimation}
        transition={{ delay: 0.5, ...floatingAnimation.transition }}
        className="absolute bottom-[20%] right-[15%] h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-60 blur-sm"
      ></motion.div>

      <motion.div
        animate={floatingAnimation}
        transition={{ delay: 1, ...floatingAnimation.transition }}
        className="absolute top-[60%] left-[15%] h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 opacity-70 blur-sm"
      ></motion.div>

      {/* Rotating background elements */}
      <motion.div
        animate={rotatingAnimation}
        className="absolute top-[10%] right-[20%] h-40 w-40 rounded-full border-4 border-dashed border-purple-500/20 opacity-30"
      ></motion.div>

      <motion.div
        animate={rotatingAnimation}
        transition={{ delay: 0.5, ...rotatingAnimation.transition }}
        className="absolute bottom-[10%] left-[20%] h-60 w-60 rounded-full border-4 border-dashed border-blue-500/20 opacity-20"
      ></motion.div>

      {/* Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              opacity: Math.random() * 0.5 + 0.3,
              scale: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute h-2 w-2 rounded-full bg-purple-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  )
}

export default HeroAnimation
