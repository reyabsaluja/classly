"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap, 
  Star,
  Play,
  ChevronRight,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profiles with grades, notes, and intelligent grouping"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Grade predictions, risk assessments, and personalized intervention strategies"
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Deep insights into student engagement, progress, and learning patterns"
    },
    {
      icon: MessageSquare,
      title: "Parent Communications",
      description: "AI-generated personalized updates and communication templates"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "GDPR compliant with enterprise-grade security and data protection"
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Live updates and seamless collaboration across your teaching team"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Mathematics Teacher",
      content: "Classly has transformed how I manage my classroom. The AI insights help me identify struggling students before they fall behind.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Elementary School Principal",
      content: "The parent communication features alone have saved our teachers hours each week. The AI-generated updates are professional and personalized.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Middle School Science Teacher",
      content: "The group optimization feature is incredible. Students are more engaged when they're in the right learning groups.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Classly</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">
              Demo
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/setup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            🏆 #1 AI-Powered Classroom Management
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Classly is where educators and{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI collaborate
            </span>{" "}
            to enhance learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your classroom with intelligent student management, AI-powered insights, 
            and seamless collaboration tools designed for modern educators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-3 text-lg">
                Get started for free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Watch demo
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Classly in Action
          </h2>
          <p className="text-xl text-gray-600">
            Watch how Classly transforms classroom management with AI-powered insights
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-900">
                {!isVideoPlaying ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <video 
                      className="w-full h-full object-cover"
                      preload="metadata"
                      poster=""
                    >
                      <source src="/ClasslyDemo.mp4#t=0.1" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-all duration-200">
                      <Play className="w-12 h-12 text-blue-600 ml-1" />
                    </div>
                  </div>
                ) : (
                  <video 
                    className="w-full h-full object-cover" 
                    controls 
                    autoPlay
                    onEnded={() => setIsVideoPlaying(false)}
                  >
                    <source src="/ClasslyDemo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to excel in education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help educators make data-driven decisions 
              and improve student outcomes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to transform your classroom?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of educators using Classly to improve student outcomes 
              with AI-powered insights and intelligent classroom management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Get started for free
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Setup Database
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Classly</span>
              </div>
              <p className="text-gray-400">
                AI-powered classroom management for modern educators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/setup" className="hover:text-white transition-colors">Setup</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Classly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
