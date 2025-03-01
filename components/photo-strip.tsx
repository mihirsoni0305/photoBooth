"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PhotoStripProps {
  photos: string[];
  layout: string;
}

export default function PhotoStrip({ photos, layout }: PhotoStripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && photos.length > 0) {
      generatePhotoStrip();
    }
  }, [photos, layout]);

  const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    return ctx;
  };

  const generatePhotoStrip = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions and properties based on layout
    let width, height;

    // Get current date for the timestamp
    const date = new Date();
    const formattedDate = date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
    const formattedTime =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
    const timestamp = formattedDate + " " + formattedTime;

    if (layout === "vertical") {
      // Improved dimensions for better quality
      width = 1200;
      height = 2400;
      canvas.width = width;
      canvas.height = height;

      // Draw white background with rounded corners
      ctx.fillStyle = "#ffffff";
      roundedRect(ctx, 0, 0, width, height, 30);
      ctx.fill();

      // Draw outer border with rounded corners
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 10;
      roundedRect(ctx, 10, 10, width - 20, height - 20, 25);
      ctx.stroke();

      // Determine photo dimensions and spacing
      const photoWidth = width - 80;
      const photoHeight = (height - 180) / photos.length - 40;
      const spacing = 40;

      // Draw photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = photos[i];
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const x = 40;
            const y = 40 + i * (photoHeight + spacing);

            // Draw photo frame with rounded corners
            ctx.fillStyle = "#ffffff";
            roundedRect(
              ctx,
              x - 10,
              y - 10,
              photoWidth + 20,
              photoHeight + 20,
              15,
            );
            ctx.fill();

            ctx.save();
            // Create clipping region for the photo (for rounded corners)
            roundedRect(ctx, x, y, photoWidth, photoHeight, 10);
            ctx.clip();

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            ctx.restore();

            resolve();
          };
        });
      }

      // Add title at bottom
      ctx.fillStyle = "#000000";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PHOTO BOOTH", width / 2, height - 80);

      // Add timestamp in vintage yellow at bottom right
      ctx.fillStyle = "#C9A648"; // Dark vintage yellow
      ctx.font = "28px monospace";
      ctx.textAlign = "right";
      ctx.fillText(timestamp, width - 40, height - 40);
    } else if (layout === "horizontal") {
      width = 2400;
      height = 900;
      canvas.width = width;
      canvas.height = height;

      // Draw white background with rounded corners
      ctx.fillStyle = "#ffffff";
      roundedRect(ctx, 0, 0, width, height, 30);
      ctx.fill();

      // Draw outer border with rounded corners
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 10;
      roundedRect(ctx, 10, 10, width - 20, height - 20, 25);
      ctx.stroke();

      // Determine photo dimensions with better spacing
      const photoWidth = (width - 100) / photos.length - 40;
      const photoHeight = height - 200;
      const spacing = 40;

      // Draw photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = photos[i];
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const x = 50 + i * (photoWidth + spacing);
            const y = 70;

            // Create clipping region for the photo (for rounded corners)
            ctx.save();
            roundedRect(ctx, x, y, photoWidth, photoHeight, 15);
            ctx.clip();

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            ctx.restore();

            resolve();
          };
        });
      }

      // Add title
      ctx.fillStyle = "#000000";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PHOTO BOOTH", width / 2, 45);

      // Add timestamp in vintage yellow at bottom right
      ctx.fillStyle = "#C9A648"; // Dark vintage yellow
      ctx.font = "28px monospace";
      ctx.textAlign = "right";
      ctx.fillText(timestamp, width - 40, height - 40);
    } else if (layout === "grid") {
      width = 1600;
      height = 1600;
      canvas.width = width;
      canvas.height = height;

      // Draw white background with rounded corners
      ctx.fillStyle = "#ffffff";
      roundedRect(ctx, 0, 0, width, height, 30);
      ctx.fill();

      // Draw outer border with rounded corners
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 10;
      roundedRect(ctx, 10, 10, width - 20, height - 20, 25);
      ctx.stroke();

      // Improved grid layout - if 3 photos, show 2 on first row and 1 centered on second row
      let rows, cols;

      if (photos.length <= 2) {
        rows = 1;
        cols = photos.length;
      } else if (photos.length === 3) {
        rows = 2;
        cols = 2; // 2 columns, but we'll only use one spot in the second row
      } else if (photos.length === 4) {
        rows = 2;
        cols = 2;
      } else {
        // Default grid calculation for more photos
        cols = Math.ceil(Math.sqrt(photos.length));
        rows = Math.ceil(photos.length / cols);
      }

      const photoWidth = (width - 160) / cols;
      const photoHeight = (height - 240) / rows;
      const horizontalSpacing = (width - photoWidth * cols) / (cols + 1);
      const verticalSpacing = 80;

      for (let i = 0; i < photos.length; i++) {
        let row, col, x, y;

        if (photos.length === 3 && i === 2) {
          // Center the third photo on the second row
          row = 1;
          col = 0.5; // Center position
          x = (width - photoWidth) / 2;
        } else {
          row = Math.floor(i / cols);
          col = i % cols;
          x = horizontalSpacing + col * (photoWidth + horizontalSpacing);
        }

        y = 100 + row * (photoHeight + verticalSpacing);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = photos[i];
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Create clipping region for the photo (for rounded corners)
            ctx.save();
            roundedRect(ctx, x, y, photoWidth, photoHeight, 20);
            ctx.clip();

            // Draw photo
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            ctx.restore();

            resolve();
          };
        });
      }

      // Add title
      ctx.fillStyle = "#000000";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PHOTO BOOTH", width / 2, 60);

      // Add timestamp in vintage yellow at bottom right
      ctx.fillStyle = "#C9A648"; // Dark vintage yellow
      ctx.font = "28px monospace";
      ctx.textAlign = "right";
      ctx.fillText(timestamp, width - 40, height - 40);
    } else if (layout === "classic-strip") {
      // Classic photo booth strip
      width = 800;
      height = photos.length * 280 + 100;
      canvas.width = width;
      canvas.height = height;

      // Draw white background with rounded corners
      ctx.fillStyle = "#ffffff";
      roundedRect(ctx, 0, 0, width, height, 20);
      ctx.fill();

      // Draw outer border with rounded corners
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 6;
      roundedRect(ctx, 6, 6, width - 12, height - 12, 15);
      ctx.stroke();

      // Draw photos in a vertical strip
      const photoWidth = width - 40;
      const photoHeight = 250;

      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = photos[i];
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const x = 20;
            const y = 20 + i * 280;

            // Create clipping region for the photo (for rounded corners)
            ctx.save();
            roundedRect(ctx, x, y, photoWidth, photoHeight, 10);
            ctx.clip();

            // Draw photo with better quality
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            ctx.restore();

            resolve();
          };
        });
      }

      // Add footer text centered at bottom
      ctx.fillStyle = "#000000";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PHOTO BOOTH", width / 2, height - 30);

      // Add timestamp in vintage yellow at bottom right
      ctx.fillStyle = "#C9A648"; // Dark vintage yellow
      ctx.font = "24px monospace";
      ctx.textAlign = "right";
      ctx.fillText(timestamp, width - 20, height - 20);
    }
  };

  const downloadPhotoStrip = () => {
    if (!canvasRef.current) return;

    // Set high quality for download
    const highQualityCanvas = document.createElement("canvas");
    const highQualityCtx = highQualityCanvas.getContext("2d");

    if (!highQualityCtx) return;

    // Copy from display canvas to high-quality canvas
    highQualityCanvas.width = canvasRef.current.width;
    highQualityCanvas.height = canvasRef.current.height;
    highQualityCtx.drawImage(canvasRef.current, 0, 0);

    // Create download link with high quality image
    const link = document.createElement("a");
    link.download = "photo-strip.png";
    link.href = highQualityCanvas.toDataURL("image/png", 1.0); // 1.0 = highest quality
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border p-4 bg-white rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{
            maxHeight: "80vh",
            width: "auto",
            height: "auto",
          }}
        />
      </div>

      <div className="mt-4 flex gap-4">
        <Button onClick={generatePhotoStrip} variant="outline">
          Preview
        </Button>
        <Button onClick={downloadPhotoStrip} variant="default">
          <Download className="h-4 w-4 mr-2" />
          Download Photo Strip
        </Button>
      </div>
    </div>
  );
}
