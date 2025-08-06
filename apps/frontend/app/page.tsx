import React from 'react';
import { 
  Pencil, Square, Circle, ArrowRight, Zap, Users, Download, Palette, MousePointer, Type
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MockCanvas from '@/components/MockCanvas';
import Card from '@/components/Card';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Think, sketch, and
              <span className="text-blue-600"> collaborate</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A virtual whiteboard for sketching hand-drawn like diagrams. 
              Collaborative, end-to-end encrypted, and ready to use.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center">
                  Start Drawing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
                View Examples
              </button>
            </div>
          </div>

          <MockCanvas />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to visualize ideas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple tools, powerful features, and seamless collaboration 
              make it easy to bring your thoughts to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              icon={<Zap className="w-6 h-6 text-blue-600" />} 
              title="Lightning Fast" 
              description="Instant startup, smooth performance, and responsive drawing 
                that keeps up with your thoughts."
            />
            <Card
              icon={<Users className="w-6 h-6 text-green-600" />} 
              title="Real-time Collaboration" 
              description="Work together seamlessly with your team. See changes 
                in real-time and brainstorm together."
            />
            <Card
              icon={<Palette className="w-6 h-6 text-purple-600" />} 
              title="Hand-drawn Style" 
              description="Beautiful, sketchy aesthetic that makes your diagrams 
                feel natural and approachable."
            />
            <Card
              icon={<Download className="w-6 h-6 text-orange-600" />} 
              title="Export Anywhere" 
              description="Export your drawings as PNG, SVG, or share a link. 
                Your work, your way."
            />
            <Card
              icon={<Square className="w-6 h-6 text-red-600" />} 
              title="Rich Toolset" 
              description="Shapes, arrows, text, and freehand drawing. 
                Everything you need in one place."
            />
            <Card
              icon={<Circle className="w-6 h-6 text-cyan-600" />} 
              title="Privacy First" 
              description="End-to-end encrypted and privacy-focused. 
                Your ideas stay yours."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to start sketching?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators, designers, and teams who use DrawBoard 
            to bring their ideas to life.
          </p>
          <Link href="/signup">
            <button className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl">
              Launch DrawBoard
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}