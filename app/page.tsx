import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Share2, Image } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Photo Booth",
  description: "Take photos with AI filters and create custom photo strips",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Camera className="h-6 w-6" />
            <span>AI Photo Booth</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Amazing Photo Strips with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Take photos, apply real-time AI filters, and generate high-quality photo strips to share with
                    friends.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/booth">
                    <Button size="lg" className="gap-1">
                      <Camera className="h-5 w-5" />
                      Start Photo Booth
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 relative">
                <div className="relative w-full max-w-[400px] aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 grid-rows-4 h-full gap-2 p-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-background rounded-md overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=200&width=300`}
                          alt={`Sample photo ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                  <Share2 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create stunning photo strips in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Take Photos</h3>
                <p className="text-muted-foreground text-center">
                  Use your camera to take multiple photos with real-time AI filters
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Image className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Create Strip</h3>
                <p className="text-muted-foreground text-center">
                  Arrange your photos into a custom strip with borders and effects
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Share2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Share</h3>
                <p className="text-muted-foreground text-center">
                  Download your photo strip or share directly to social media
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Photo Booth. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

