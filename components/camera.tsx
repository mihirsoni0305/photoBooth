"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Loader2 } from "lucide-react";
import { applyFilter } from "@/lib/filters";

interface CameraComponentProps {
  onCapture: (photoDataUrl: string) => void;
  selectedFilter: string;
}

export default function CameraComponent({
  onCapture,
  selectedFilter,
}: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize to maintain proper dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Updated: Use 70% of viewport height instead of 50%
        const height = window.innerHeight * 0.7;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isFrontCamera]);

  useEffect(() => {
    if (isCameraReady) {
      const intervalId = setInterval(applyRealTimeFilter, 1000 / 30); // 30 FPS
      return () => clearInterval(intervalId);
    }
  }, [isCameraReady, selectedFilter, dimensions]);

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const applyRealTimeFilter = () => {
    if (videoRef.current && canvasRef.current && dimensions.width > 0) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        applyFilter(canvas, selectedFilter);
      }
    }
  };

  const capturePhoto = async () => {
    if (!isCameraReady || isCapturing) return;

    setIsCapturing(true);

    // Start countdown
    setCountdown(3);
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(null);

    if (canvasRef.current) {
      const photoDataUrl = canvasRef.current.toDataURL("image/png");
      onCapture(photoDataUrl);
    }

    setIsCapturing(false);
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div
        className="relative bg-black rounded-lg overflow-hidden"
        style={{
          height: `${dimensions.height}px`,
          maxHeight: "80vh", // Increased max height to accommodate 70% viewport
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-7xl font-bold">{countdown}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={toggleCamera}
          disabled={isCapturing}
          className="py-2 px-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Switch Camera
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={capturePhoto}
          disabled={!isCameraReady || isCapturing}
          className={`${isCapturing ? "animate-pulse" : ""} py-2 px-4`}
        >
          {isCapturing ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Camera className="h-5 w-5 mr-2" />
          )}
          Take Photo
        </Button>
      </div>
    </div>
  );
}
