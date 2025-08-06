import { Pencil, MousePointer, Square, Circle, Type } from "lucide-react";

export default function MockCanvas() {
    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
                    <MousePointer className="w-5 h-5 text-gray-600" />
                    <Pencil className="w-5 h-5 text-blue-600" />
                    <Square className="w-5 h-5 text-gray-600" />
                    <Circle className="w-5 h-5 text-gray-600" />
                    <Type className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg h-96 relative overflow-hidden border border-gray-200">
                {/* Mock Drawing Elements */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Rectangle */}
                  <rect x="50" y="50" width="100" height="60" 
                        fill="none" stroke="#3B82F6" strokeWidth="2" 
                        rx="8" className="drop-shadow-sm" />
                  <text x="100" y="85" textAnchor="middle" className="text-sm fill-gray-700 font-medium">
                    Ideas
                  </text>
                  
                  {/* Arrow */}
                  <path d="M160 80 L200 80" stroke="#3B82F6" strokeWidth="2" 
                        markerEnd="url(#arrowhead)" />
                  
                  {/* Circle */}
                  <circle cx="250" cy="80" r="35" 
                          fill="none" stroke="#10B981" strokeWidth="2" 
                          className="drop-shadow-sm" />
                  <text x="250" y="85" textAnchor="middle" className="text-sm fill-gray-700 font-medium">
                    Action
                  </text>
                  
                  {/* Arrow */}
                  <path d="M285 80 L320 80" stroke="#10B981" strokeWidth="2" 
                        markerEnd="url(#arrowhead2)" />
                  
                  {/* Diamond */}
                  <path d="M350 50 L370 80 L350 110 L330 80 Z" 
                        fill="none" stroke="#F59E0B" strokeWidth="2" 
                        className="drop-shadow-sm" />
                  <text x="350" y="85" textAnchor="middle" className="text-xs fill-gray-700 font-medium">
                    Result
                  </text>
                  
                  {/* Hand-drawn style text */}
                  <text x="100" y="140" className="text-lg fill-gray-500 font-light" 
                        style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    Brainstorming session ✨
                  </text>
                  
                  {/* Arrow markers */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                    </marker>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
                    </marker>
                  </defs>
                </svg>
                
                {/* Floating cursor */}
                <div className="absolute top-12 right-12 transform rotate-12 animate-pulse">
                  <div className="w-6 h-6 bg-blue-600 rounded-full shadow-lg"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
            <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-pink-400 rounded-full animate-bounce delay-2000"></div>
          </div>
    )
}