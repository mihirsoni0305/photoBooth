"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react"

export default function SocialShare() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out my AI Photo Booth strip!")}`,
      "_blank",
    )
  }

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent("Check out my AI Photo Booth strip! " + shareUrl)}`, "_blank")
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Photo Booth",
          text: "Check out my AI Photo Booth strip!",
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      alert("Web Share API not supported in your browser")
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={shareToFacebook}>
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      <Button variant="outline" onClick={shareToTwitter}>
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      <Button variant="outline" onClick={shareToWhatsApp}>
        <Instagram className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      <Button variant="outline" onClick={shareNative}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  )
}

