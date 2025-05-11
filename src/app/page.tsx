import { ArrowRight, Award, Heart, Search, Star, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import HeroAnimation from "@/components/hero-animation"
import ToolsShowcase from "@/components/tools-showcase"
import FeaturedTools from "@/components/featured-tools"
import TestimonialSection from "@/components/testimonial-section"
import StatsCounter from "@/components/stats-counter"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-purple-950 text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 text-sm rounded-full">
                100% Free • No Ads • Developer Friendly
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover & Share the Best{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">
                  AI Tools
                </span>{" "}
                for Creators
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Your community-driven platform to find, share, and promote cutting-edge AI tools. Get discovered, gain
                visibility, and connect with AI enthusiasts worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-purple-500 text-white hover:bg-purple-900/20">
                  Submit Your Tool <Zap className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <HeroAnimation />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <StatsCounter />
        </div>
      </section>

      {/* Top Tools of the Week */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
              <Award className="mr-1 h-4 w-4" /> Weekly Highlights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top AI Tools This Week</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Voted by the community. Get your tool featured here by receiving the most likes and engagement.
            </p>
          </div>
          <FeaturedTools />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 rounded-3xl mx-4 my-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our platform makes it easy to discover and promote AI tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Discover</h3>
                <p className="text-gray-500">
                  Browse through our curated collection of AI tools categorized for easy discovery
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Vote & Share</h3>
                <p className="text-gray-500">
                  Like your favorite tools and share them with your network to help them gain visibility
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Featured</h3>
                <p className="text-gray-500">
                  Submit your own AI tool and get featured on our platform to reach thousands of potential users
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20">Explore</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Find the perfect AI tool for your specific needs</p>
          </div>
          <ToolsShowcase />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-500/10 text-green-500 hover:bg-green-500/20">Community Love</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Creators Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Hear from developers and AI enthusiasts who've found success with our platform
            </p>
          </div>
          <TestimonialSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl mx-4 my-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the AI Tools Community?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Create an account today to submit your tools, like and save your favorites, and become part of our growing
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-300">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} AI Tools Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
