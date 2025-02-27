"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PhotoStripProps {
  photos: string[]
  layout: string
}

export default function PhotoStrip({ photos, layout }: PhotoStripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && photos.length > 0) {
      generatePhotoStrip()
    }
  }, [photos])

  const generatePhotoStrip = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions based on layout
    let width, height

    if (layout === "vertical") {
      width = 800
      height = 200 * photos.length + 100 // Add some padding
      canvas.width = width
      canvas.height = height

      // Draw background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Draw border
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 10
      ctx.strokeRect(5, 5, width - 10, height - 10)

      // Draw photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = photos[i]
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const photoWidth = width - 40
            const photoHeight = 180
            const x = 20
            const y = 20 + i * 200

            // Draw photo frame
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 2
            ctx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight)
            resolve()
          }
        })
      }

      // Add title
      ctx.fillStyle = "#000000"
      ctx.font = "bold 30px Arial"
      ctx.textAlign = "center"
      ctx.fillText("AI PHOTO BOOTH", width / 2, height - 40)
    } else if (layout === "horizontal") {
      width = 200 * photos.length + 100
      height = 800
      canvas.width = width
      canvas.height = height

      // Draw background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Draw border
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 10
      ctx.strokeRect(5, 5, width - 10, height - 10)

      // Draw photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = photos[i]
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const photoWidth = 180
            const photoHeight = height - 200
            const x = 20 + i * 200
            const y = 100

            // Draw photo frame
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 2
            ctx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight)
            resolve()
          }
        })
      }

      // Add title
      ctx.fillStyle = "#000000"
      ctx.font = "bold 30px Arial"
      ctx.textAlign = "center"
      ctx.fillText("AI PHOTO BOOTH", width / 2, 60)
    } else if (layout === "grid") {
      width = 800
      height = 800
      canvas.width = width
      canvas.height = height

      // Draw background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Draw border
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 10
      ctx.strokeRect(5, 5, width - 10, height - 10)

      // Draw photos in a grid
      const cols = Math.ceil(Math.sqrt(photos.length))
      const rows = Math.ceil(photos.length / cols)

      const photoWidth = (width - 60) / cols
      const photoHeight = (height - 120) / rows

      for (let i = 0; i < photos.length; i++) {
        const row = Math.floor(i / cols)
        const col = i % cols

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = photos[i]
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const x = 30 + col * (photoWidth + 10)
            const y = 80 + row * (photoHeight + 10)

            // Draw photo frame
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 2
            ctx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10)

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight)
            resolve()
          }
        })
      }

      // Add title
      ctx.fillStyle = "#000000"
      ctx.font = "bold 30px Arial"
      ctx.textAlign = "center"
      ctx.fillText("AI PHOTO BOOTH", width / 2, 50)
    }
  }

  const downloadPhotoStrip = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "photo-strip.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border p-4 bg-white rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{
            maxHeight: "70vh",
            width: layout === "horizontal" ? "auto" : "400px",
            height: layout === "vertical" ? "auto" : "400px",
          }}
        />
      </div>

      <Button className="mt-4" onClick={downloadPhotoStrip}>
        <Download className="h-4 w-4 mr-2" />
        Download Photo Strip
      </Button>
    </div>
  )
}

