"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, CameraIcon, RefreshCw, Film, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CameraComponent from "@/components/camera";
import FilterSelector from "@/components/filter-selector";
import PhotoStrip from "@/components/photo-strip";
import SocialShare from "@/components/social-share";

export default function PhotoBooth() {
  const [activeTab, setActiveTab] = useState("camera");
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [selectedLayout, setSelectedLayout] = useState("vertical");
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPhotoLimitAlert, setShowPhotoLimitAlert] = useState(false);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, []);

  const handlePhotoCapture = (photoDataUrl: string) => {
    setCapturedPhotos((prev) => [...prev, photoDataUrl]);

    // If we have captured 3 photos, move to selection tab and stop capturing
    if (capturedPhotos.length === 2) {
      setIsCapturing(false);
      setCountdown(null);
      setTimeout(() => {
        setActiveTab("selection");
      }, 500); // Short delay before switching tabs
    }
  };

  const startCountdown = () => {
    setCountdown(3);

    // Create recursive countdown function
    const countdownStep = (count: number) => {
      setCountdown(count);

      if (count > 0) {
        captureTimeoutRef.current = setTimeout(
          () => countdownStep(count - 1),
          1000,
        );
      } else {
        // When countdown reaches 0, trigger the capture
        // This would normally call a method on the camera component
        // For now we'll simulate it with a timeout
        captureTimeoutRef.current = setTimeout(() => {
          console.log("Capturing photo...");
          // After capture is complete, either start a new countdown or stop
          if (capturedPhotos.length < 2) {
            // We've taken 1 or 2 photos so far
            startCountdown();
          } else {
            setIsCapturing(false);
            setCountdown(null);
          }
        }, 500);
      }
    };

    // Start the countdown
    countdownStep(3);
  };

  const handleTakeMorePhotos = () => {
    if (capturedPhotos.length >= 3) {
      setShowPhotoLimitAlert(true);
    } else {
      setActiveTab("camera");
    }
  };

  const handleReset = () => {
    setCapturedPhotos([]);
    setActiveTab("camera");
    setIsCapturing(false);
    setCountdown(null);

    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Get Out From Photobooth</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-4 sm:py-6 px-2 sm:px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera" disabled={capturedPhotos.length > 2}>
              Camera
            </TabsTrigger>
            <TabsTrigger
              value="selection"
              disabled={capturedPhotos.length === 0}
            >
              Selection
            </TabsTrigger>
            <TabsTrigger value="strip" disabled={capturedPhotos.length < 3}>
              Photo Strip
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-4 sm:mt-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="w-full lg:w-2/3">
                {/* Camera takes full width on mobile but 2/3 on desktop */}
                <CameraComponent
                  onCapture={handlePhotoCapture}
                  selectedFilter={selectedFilter}
                />
              </div>

              <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Filters
                  </h3>
                  <FilterSelector
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                  />
                </div>

                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    Captured Photos ({capturedPhotos.length}/3)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {capturedPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Captured photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {Array.from({
                      length: Math.max(0, 3 - capturedPhotos.length),
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square bg-muted rounded-md flex items-center justify-center"
                      >
                        <CameraIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selection" className="mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            setCapturedPhotos(
                              capturedPhotos.filter((_, i) => i !== index),
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                  <Button
                    onClick={handleTakeMorePhotos}
                    className="w-full sm:w-auto"
                    variant="outline"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Take More Photos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("strip")}
                    disabled={capturedPhotos.length < 3}
                    className="w-full sm:w-auto"
                  >
                    <Film className="h-4 w-4 mr-2" />
                    Continue to Photo Strip
                  </Button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Layout Options
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={
                        selectedLayout === "vertical" ? "default" : "outline"
                      }
                      className="h-auto py-3 sm:py-4 flex flex-col"
                      onClick={() => setSelectedLayout("vertical")}
                    >
                      <div className="w-6 sm:w-8 h-16 sm:h-20 bg-primary-foreground border flex flex-col gap-1 p-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-primary flex-1" />
                        ))}
                      </div>
                      <span className="mt-2 text-xs sm:text-sm">Vertical</span>
                    </Button>
                    <Button
                      variant={
                        selectedLayout === "horizontal" ? "default" : "outline"
                      }
                      className="h-auto py-3 sm:py-4 flex flex-col"
                      onClick={() => setSelectedLayout("horizontal")}
                    >
                      <div className="w-16 sm:w-20 h-6 sm:h-8 bg-primary-foreground border flex gap-1 p-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-primary flex-1" />
                        ))}
                      </div>
                      <span className="mt-2 text-xs sm:text-sm">
                        Horizontal
                      </span>
                    </Button>
                    <Button
                      variant={
                        selectedLayout === "grid" ? "default" : "outline"
                      }
                      className="h-auto py-3 sm:py-4 flex flex-col"
                      onClick={() => setSelectedLayout("grid")}
                    >
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary-foreground border grid grid-cols-2 gap-1 p-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-primary"
                            style={i === 3 ? { gridColumn: "span 2" } : {}}
                          />
                        ))}
                      </div>
                      <span className="mt-2 text-xs sm:text-sm">Grid</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strip" className="mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 flex justify-center">
                <PhotoStrip photos={capturedPhotos} layout={selectedLayout} />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Start Over
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Photo Session
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alert Dialog for Photo Limit */}
        <AlertDialog
          open={showPhotoLimitAlert}
          onOpenChange={setShowPhotoLimitAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Photo Limit Reached</AlertDialogTitle>
              <AlertDialogDescription>
                You already have 3 photos. Please delete one to add a new photo
                or reset the whole process by clicking the reset button.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Reset All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
