"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BrainCircuit,
  ImageIcon,
  MessageSquare,
  Code,
  FileText,
  Music,
  Video,
  Database,
  ArrowRight,
} from "lucide-react"

const categories = [
  { id: "all", name: "All Tools", icon: <BrainCircuit className="h-5 w-5" /> },
  { id: "image", name: "Image Generation", icon: <ImageIcon className="h-5 w-5" /> },
  { id: "chat", name: "Chatbots", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "code", name: "Code Assistants", icon: <Code className="h-5 w-5" /> },
  { id: "text", name: "Text & Writing", icon: <FileText className="h-5 w-5" /> },
  { id: "audio", name: "Audio & Music", icon: <Music className="h-5 w-5" /> },
  { id: "video", name: "Video Creation", icon: <Video className="h-5 w-5" /> },
  { id: "data", name: "Data Analysis", icon: <Database className="h-5 w-5" /> },
]

const tools = [
  {
    id: 1,
    name: "PixelMind AI",
    description: "Generate stunning images from text descriptions with advanced AI",
    category: "image",
    likes: 1243,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Image", "Art", "Design"],
  },
  {
    id: 2,
    name: "CodeCraft",
    description: "AI-powered code assistant that helps you write better code faster",
    category: "code",
    likes: 987,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Coding", "Development", "Productivity"],
  },
  {
    id: 3,
    name: "ChatGenius",
    description: "Build conversational AI chatbots for your website or application",
    category: "chat",
    likes: 756,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Chatbot", "Customer Service", "NLP"],
  },
  {
    id: 4,
    name: "ScriptForge",
    description: "Generate scripts, stories, and marketing copy with AI assistance",
    category: "text",
    likes: 632,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Writing", "Content", "Marketing"],
  },
  {
    id: 5,
    name: "MelodyMaker",
    description: "Create original music and audio with AI composition tools",
    category: "audio",
    likes: 521,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Music", "Audio", "Creative"],
  },
  {
    id: 6,
    name: "VideoVortex",
    description: "Transform text into engaging video content with AI",
    category: "video",
    likes: 489,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Video", "Content Creation", "Marketing"],
  },
]

const ToolsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredTool, setHoveredTool] = useState<number | null>(null)

  const filteredTools = activeCategory === "all" ? tools : tools.filter((tool) => tool.category === activeCategory)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`rounded-full ${
              activeCategory === category.id ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-100/10"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <Card className="overflow-hidden border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48 overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                <img
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  style={{
                    transform: hoveredTool === tool.id ? "scale(1.05)" : "scale(1)",
                  }}
                />
                <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800/80 text-gray-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{tool.name}</h3>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {tool.likes} likes
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4 flex-grow">{tool.description}</p>
                <Button variant="ghost" className="w-full justify-between hover:bg-purple-500/10 group">
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" size="lg" className="border-purple-500/30 hover:bg-purple-500/10">
          View All Tools <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ToolsShowcase
