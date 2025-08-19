"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import clsx from "clsx"

interface LoadingButtonProps {
  onClick: () => void
}

export function LoadingButton({ onClick }: LoadingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (loading && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100))
      }, 120) // controls speed of percentage counting
    }
    return () => clearInterval(timer)
  }, [loading, progress])

  const handleClick = () => {
    setLoading(true)
    setProgress(0)
    onClick()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={clsx(
        "relative flex items-center justify-center w-40 h-40 rounded-full text-lg font-bold transition-all duration-300",
        loading
          ? "animate-spin-slow bg-black text-white"
          : "bg-gradient-to-r from-purple-600 via-blue-500 to-yellow-400 text-black"
      )}
      style={{
        boxShadow: loading
          ? "0 0 25px 5px rgba(255,215,0,0.8), 0 0 50px 10px rgba(0,0,255,0.7), 0 0 75px 15px rgba(128,0,128,0.8)"
          : "0 0 15px rgba(0,0,0,0.4)",
      }}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold animate-pulse text-yellow-300">
          {progress}%
        </span>
      ) : (
        "Generate"
      )}
    </Button>
  )
}
