"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CameraIcon, RefreshCw, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraComponent from "@/components/camera"
import FilterSelector from "@/components/filter-selector"
import PhotoStrip from "@/components/photo-strip"
import SocialShare from "@/components/social-share"

export default function PhotoBooth() {
  const [activeTab, setActiveTab] = useState("camera")
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [selectedFilter, setSelectedFilter] = useState("normal")
  const [selectedLayout, setSelectedLayout] = useState("vertical")

  const handlePhotoCapture = (photoDataUrl: string) => {
    setCapturedPhotos((prev) => [...prev, photoDataUrl])

    // Automatically move to the selection tab if we have 4 photos
    if (capturedPhotos.length === 3) {
      setActiveTab("selection")
    }
  }

  const handleReset = () => {
    setCapturedPhotos([])
    setActiveTab("camera")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="selection" disabled={capturedPhotos.length === 0}>
              Selection
            </TabsTrigger>
            <TabsTrigger value="strip" disabled={capturedPhotos.length < 2}>
              Photo Strip
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CameraComponent onCapture={handlePhotoCapture} selectedFilter={selectedFilter} />
              </div>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Filters</h3>
                  <FilterSelector selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Captured Photos ({capturedPhotos.length}/4)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {capturedPhotos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Captured photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - capturedPhotos.length) }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square bg-muted rounded-md flex items-center justify-center"
                      >
                        <CameraIcon className="h-8 w-8 text-muted-foreground opacity-30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selection" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  {capturedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Captured photo ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setCapturedPhotos(capturedPhotos.filter((_, i) => i !== index))
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setActiveTab("camera")} className="mr-2">
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Take More Photos
                  </Button>
                  <Button onClick={() => setActiveTab("strip")} disabled={capturedPhotos.length < 2}>
                    Continue to Photo Strip
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Layout Options</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedLayout === "vertical" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => setSelectedLayout("vertical")}
                    >
                      <div className="w-8 h-20 bg-primary-foreground border flex flex-col gap-1 p-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-primary flex-1" />
                        ))}
                      </div>
                      <span className="mt-2">Vertical</span>
                    </Button>
                    <Button
                      variant={selectedLayout === "horizontal" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => setSelectedLayout("horizontal")}
                    >
                      <div className="w-20 h-8 bg-primary-foreground border flex gap-1 p-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-primary flex-1" />
                        ))}
                      </div>
                      <span className="mt-2">Horizontal</span>
                    </Button>
                    <Button
                      variant={selectedLayout === "grid" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => setSelectedLayout("grid")}
                    >
                      <div className="w-12 h-12 bg-primary-foreground border grid grid-cols-2 gap-1 p-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-primary" />
                        ))}
                      </div>
                      <span className="mt-2">Grid</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strip" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 flex justify-center">
                <PhotoStrip photos={capturedPhotos} layout={selectedLayout} />
              </div>

              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Download & Share</h3>
                  <div className="space-y-4">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <SocialShare />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Start Over</h3>
                  <Button variant="outline" className="w-full" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Photo Session
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

