"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, TrendingUp } from "lucide-react"

const featuredTools = [
  {
    id: 1,
    name: "NeuralCanvas",
    description: "Create stunning artwork with AI-powered image generation",
    image: "/placeholder.svg?height=300&width=400",
    likes: 2456,
    category: "Image Generation",
    trending: true,
    new: false,
  },
  {
    id: 2,
    name: "CodePilot",
    description: "AI pair programmer that helps you write better code faster",
    image: "/placeholder.svg?height=300&width=400",
    likes: 1872,
    category: "Development",
    trending: true,
    new: false,
  },
  {
    id: 3,
    name: "VoiceForge",
    description: "Generate realistic text-to-speech in multiple languages and voices",
    image: "/placeholder.svg?height=300&width=400",
    likes: 1543,
    category: "Audio",
    trending: false,
    new: true,
  },
]

const FeaturedTools = () => {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredTools.map((tool) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -8 }}
          onMouseEnter={() => setHoveredTool(tool.id)}
          onMouseLeave={() => setHoveredTool(null)}
        >
          <Card className="overflow-hidden border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
              <img
                src={tool.image || "/placeholder.svg"}
                alt={tool.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                style={{
                  transform: hoveredTool === tool.id ? "scale(1.1)" : "scale(1)",
                }}
              />
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                {tool.trending && (
                  <Badge className="bg-orange-500/80 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" /> Trending
                  </Badge>
                )}
                {tool.new && <Badge className="bg-green-500/80 text-white">New</Badge>}
              </div>
              <div className="absolute bottom-3 left-3 z-20">
                <Badge variant="secondary" className="bg-gray-800/80 text-gray-200">
                  {tool.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <div className="flex items-center text-purple-400">
                  <Heart className="h-4 w-4 mr-1 fill-purple-400" />
                  <span className="text-sm">{tool.likes}</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 flex-grow">{tool.description}</p>
              <div className="flex gap-2 mt-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Try Now</Button>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default FeaturedTools
