'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-8 z-50 animate-fade-in">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="w-14 h-14 p-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-lg mb-0.5 group-hover:scale-110 transition-transform duration-300">🌸</span>
          <ArrowUp className="w-3 h-3 group-hover:translate-y-[-2px] transition-transform duration-300" />
        </div>
        
        <span className="sr-only">Back to top</span>
      </Button>
    </div>
  )
}