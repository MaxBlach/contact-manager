"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [displayedText, setDisplayedText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const typingSpeed = 100

  const texts = ["Contact manager", "Maxime Blachere"]
  const erasingSpeed = 50
  const waitTime = 2000

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayedText.length < texts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText(texts[currentTextIndex].slice(0, displayedText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => setIsTyping(false), waitTime)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, erasingSpeed)
      } else {
        timeout = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setIsTyping(true)
        }, 500)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, currentTextIndex, isTyping, texts])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold min-h-[1.2em]">
          {displayedText}
          {displayedText.length < texts[currentTextIndex].length && <span className="animate-pulse">|</span>}
        </h1>

        <Link href="/contacts">
          <Button
            variant="outline"
            size="lg"
            className="border-white cursor-pointer"
          >
            Ouvrir
          </Button>
        </Link>
      </div>
    </div>
  )
}
