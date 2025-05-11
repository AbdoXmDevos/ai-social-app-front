"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, PenToolIcon as Tool, Award, Zap } from "lucide-react"

const stats = [
  {
    id: 1,
    title: "Active Users",
    value: 25000,
    icon: <Users className="h-6 w-6" />,
    suffix: "+",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    title: "AI Tools Listed",
    value: 1200,
    icon: <Tool className="h-6 w-6" />,
    suffix: "+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Weekly Highlights",
    value: 50,
    icon: <Award className="h-6 w-6" />,
    suffix: "",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 4,
    title: "Tools Discovered Daily",
    value: 300,
    icon: <Zap className="h-6 w-6" />,
    suffix: "+",
    color: "from-green-500 to-emerald-500",
  },
]

const StatsCounter = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const duration = 2000 // 2 seconds
        const increment = stat.value / (duration / 16) // 60fps
        let currentCount = 0

        const timer = setInterval(() => {
          currentCount += increment
          if (currentCount >= stat.value) {
            currentCount = stat.value
            clearInterval(timer)
          }

          setCounts((prevCounts) => {
            const newCounts = [...prevCounts]
            newCounts[index] = Math.floor(currentCount)
            return newCounts
          })
        }, 16)

        return () => clearInterval(timer)
      })
    }
  }, [isInView])

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="border-gray-800 hover:border-gray-700 transition-all duration-300 h-full overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-400">{stat.title}</h3>
                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl md:text-4xl font-bold">{counts[index].toLocaleString()}</span>
                <span className="text-xl md:text-2xl font-bold ml-1">{stat.suffix}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCounter
