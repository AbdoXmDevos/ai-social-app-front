"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "AI Developer",
    company: "TechInnovate",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "This platform helped me discover amazing AI tools that significantly improved my workflow. My own tool gained over 5,000 new users after being featured in the weekly highlights!",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product Designer",
    company: "DesignFuture",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "As a designer working with AI, finding the right tools was always a challenge. This platform changed everything - now I can easily discover new AI tools and share my favorites with my team.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Startup Founder",
    company: "AIVentures",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "Launching our AI tool was challenging until we got featured here. The exposure helped us reach our target audience and gather valuable feedback to improve our product.",
  },
]

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl"></div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-gray-800 bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-purple-500/20 ring-offset-2 ring-offset-background">
                      <AvatarImage
                        src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                      />
                      <AvatarFallback>{testimonials[currentIndex].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{testimonials[currentIndex].name}</h3>
                    <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                    <p className="text-purple-400">{testimonials[currentIndex].company}</p>
                  </div>

                  <div className="md:w-2/3 relative">
                    <Quote className="absolute -top-6 -left-6 h-12 w-12 text-purple-500/20" />
                    <p className="text-lg md:text-xl text-gray-300 italic">{testimonials[currentIndex].content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8 gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2 items-center">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-purple-500" : "w-2 bg-gray-700"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TestimonialSection
