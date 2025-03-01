// This file contains the filter implementation using TensorFlow.js
// For simplicity, we're using Canvas API filters in this demo
// In a production app, you would use TensorFlow.js for more advanced AI filters

export async function applyFilter(
  canvas: HTMLCanvasElement,
  filterType: string,
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Create a temporary canvas to store the original image
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Copy the original image to the temporary canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Clear the original canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply the selected filter
  switch (filterType) {
    case "normal":
      ctx.filter = "none";
      break;
    case "grayscale":
      ctx.filter = "grayscale(100%)";
      break;
    case "sepia":
      ctx.filter = "sepia(100%)";
      break;
    case "vintage":
      ctx.filter = "sepia(50%) contrast(110%) brightness(110%) saturate(130%)";
      break;
    case "cartoon":
      ctx.filter = "saturate(150%) contrast(140%)";
      break;
    case "blur":
      ctx.filter = "blur(5px)";
      break;
    case "brightness":
      ctx.filter = "brightness(150%)";
      break;
    case "contrast":
      ctx.filter = "contrast(180%)";
      break;
    case "neon":
      ctx.filter =
        "brightness(150%) contrast(150%) saturate(150%) hue-rotate(45deg)";
      break;
    case "pixelate":
      // Pixelate effect will be applied after drawing
      ctx.filter = "none";
      break;
    case "rainbow":
      // Rainbow effect will be applied after drawing
      ctx.filter = "none";
      break;
    // New filters
    case "90s":
      ctx.filter = "saturate(130%) contrast(110%) brightness(110%) sepia(20%)";
      break;
    case "2000s":
      ctx.filter =
        "saturate(150%) contrast(120%) brightness(105%) hue-rotate(5deg)";
      break;
    case "noir":
      ctx.filter = "grayscale(100%) contrast(150%) brightness(90%)";
      break;
    case "fisheye":
      ctx.filter = "none";
      break;
    case "rainbowAura":
      ctx.filter = "brightness(110%) contrast(110%)";
      break;
    case "glitch":
      ctx.filter = "none";
      break;
    case "crosshatch":
      ctx.filter = "grayscale(100%) contrast(120%)";
      break;
    default:
      ctx.filter = "none";
      break;
  }

  // Draw the image from the temp canvas back to the original canvas with the filter applied
  ctx.drawImage(tempCanvas, 0, 0);

  // Apply post-processing effects
  switch (filterType) {
    case "cartoon":
      applyCartoonEffect(ctx, canvas.width, canvas.height);
      break;
    case "pixelate":
      applyPixelateEffect(ctx, canvas.width, canvas.height);
      break;
    case "rainbow":
      applyRainbowEffect(ctx, canvas.width, canvas.height);
      break;
    // New filter post-processing
    case "90s":
      apply90sEffect(ctx, canvas.width, canvas.height);
      break;
    case "2000s":
      apply2000sEffect(ctx, canvas.width, canvas.height);
      break;
    case "noir":
      applyNoirEffect(ctx, canvas.width, canvas.height);
      break;
    case "fisheye":
      applyFisheyeEffect(ctx, tempCanvas, canvas);
      break;
    case "rainbowAura":
      applyRainbowAuraEffect(ctx, canvas.width, canvas.height);
      break;
    case "glitch":
      applyGlitchEffect(ctx, canvas.width, canvas.height);
      break;
    case "crosshatch":
      applyCrosshatchEffect(ctx, canvas.width, canvas.height);
      break;
  }
}

// Existing effect functions
function applyCartoonEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.3)";

  const gridSize = 20;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      const w = Math.min(gridSize, width - x);
      const h = Math.min(gridSize, height - y);
      ctx.strokeRect(x, y, w, h);
    }
  }
}

function applyPixelateEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const pixelSize = 10;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const red = data[(width * y + x) * 4];
      const green = data[(width * y + x) * 4 + 1];
      const blue = data[(width * y + x) * 4 + 2];

      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const index = (width * (y + py) + (x + px)) * 4;
          data[index] = red;
          data[index + 1] = green;
          data[index + 2] = blue;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyRainbowEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    const hue = (y / height) * 360;
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const [r, g, b] = hslToRgb(hue / 360, 0.5, 0.5);
      data[index] = (data[index] + r) / 2;
      data[index + 1] = (data[index + 1] + g) / 2;
      data[index + 2] = (data[index + 2] + b) / 2;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// New effect functions
function apply90sEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  // Add slightly blurry vignette
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.3,
    width / 2,
    height / 2,
    height * 0.8,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.4)");

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add color noise
  ctx.globalCompositeOperation = "screen";
  const noiseData = ctx.getImageData(0, 0, width, height);
  const noise = noiseData.data;

  for (let i = 0; i < noise.length; i += 4) {
    const grainAmount = Math.random() * 20 - 10;
    noise[i] = Math.min(255, Math.max(0, noise[i] + grainAmount));
    noise[i + 1] = Math.min(255, Math.max(0, noise[i + 1] + grainAmount));
    noise[i + 2] = Math.min(255, Math.max(0, noise[i + 2] + grainAmount));
  }

  ctx.putImageData(noiseData, 0, 0);

  // Add date stamp in bottom right
  ctx.globalCompositeOperation = "source-over";
  ctx.font = "16px monospace";
  ctx.fillStyle = "rgba(255, 165, 0, 0.8)";

  const date = new Date();
  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.99`;
  ctx.fillText(formattedDate, width - 80, height - 20);
}

function apply2000sEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  // Add subtle glow effect
  ctx.globalCompositeOperation = "overlay";
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add bright colored border
  ctx.globalCompositeOperation = "source-over";
  const borderSize = 15;

  ctx.strokeStyle = "#FF00FF";
  ctx.lineWidth = borderSize;
  ctx.strokeRect(
    borderSize / 2,
    borderSize / 2,
    width - borderSize,
    height - borderSize,
  );

  // Add retro digital corners
  ctx.fillStyle = "rgba(255, 0, 255, 0.7)";
  const cornerSize = 30;

  // Top left corner
  ctx.beginPath();
  ctx.moveTo(0, cornerSize);
  ctx.lineTo(cornerSize, cornerSize);
  ctx.lineTo(cornerSize, 0);
  ctx.fill();

  // Bottom right corner
  ctx.beginPath();
  ctx.moveTo(width, height - cornerSize);
  ctx.lineTo(width - cornerSize, height - cornerSize);
  ctx.lineTo(width - cornerSize, height);
  ctx.fill();
}

function applyNoirEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  // Add film grain
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 25 - 12.5;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);

  // Add vignette
  ctx.globalCompositeOperation = "multiply";
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.3,
    width / 2,
    height / 2,
    height * 0.7,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.8)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle scratch lines
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function applyFisheyeEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  destCanvas: HTMLCanvasElement,
) {
  const width = destCanvas.width;
  const height = destCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  const strength = 2.5; // Distortion strength

  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) return;

  const destCtx = destCanvas.getContext("2d");
  if (!destCtx) return;

  const sourceData = sourceCtx.getImageData(0, 0, width, height);
  const destData = destCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate normalized coordinates from center
      const nx = (x - centerX) / radius;
      const ny = (y - centerY) / radius;
      const distSq = nx * nx + ny * ny;

      if (distSq > 1) {
        // Outside of lens, copy directly
        const destIndex = (y * width + x) * 4;
        const sourceIndex = destIndex;

        destData.data[destIndex] = sourceData.data[sourceIndex];
        destData.data[destIndex + 1] = sourceData.data[sourceIndex + 1];
        destData.data[destIndex + 2] = sourceData.data[sourceIndex + 2];
        destData.data[destIndex + 3] = sourceData.data[sourceIndex + 3];
      } else {
        // Apply fisheye distortion inside lens
        const dist = Math.sqrt(distSq);
        const newDist = Math.pow(dist, 1.0 / strength); // Adjust power for strength

        const newNx = (newDist * nx) / dist;
        const newNy = (newDist * ny) / dist;

        // Map back to image coordinates
        const newX = Math.round(newNx * radius + centerX);
        const newY = Math.round(newNy * radius + centerY);

        // Ensure coordinates are in bounds
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          const destIndex = (y * width + x) * 4;
          const sourceIndex = (newY * width + newX) * 4;

          destData.data[destIndex] = sourceData.data[sourceIndex];
          destData.data[destIndex + 1] = sourceData.data[sourceIndex + 1];
          destData.data[destIndex + 2] = sourceData.data[sourceIndex + 2];
          destData.data[destIndex + 3] = sourceData.data[sourceIndex + 3];
        }
      }
    }
  }

  destCtx.putImageData(destData, 0, 0);

  // Add circular border to emphasize the fisheye effect
  destCtx.globalCompositeOperation = "source-over";
  destCtx.strokeStyle = "rgba(0,0,0,0.7)";
  destCtx.lineWidth = 10;
  destCtx.beginPath();
  destCtx.arc(centerX, centerY, radius * 0.98, 0, Math.PI * 2);
  destCtx.stroke();
}

function applyRainbowAuraEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  // Create a temporary canvas to apply the effect
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Copy the image
  tempCtx.drawImage(ctx.canvas, 0, 0);

  // Get image data for edge detection
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Create a copy for the original image
  const origCanvas = document.createElement("canvas");
  origCanvas.width = width;
  origCanvas.height = height;
  const origCtx = origCanvas.getContext("2d");
  if (!origCtx) return;
  origCtx.drawImage(ctx.canvas, 0, 0);

  // Clear the original canvas for rebuilding
  ctx.clearRect(0, 0, width, height);

  // First apply a slight blur to the subject
  ctx.filter = "blur(1px)";
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = "none";

  // Extract subject edges for the aura effect
  const edgeCanvas = document.createElement("canvas");
  edgeCanvas.width = width;
  edgeCanvas.height = height;
  const edgeCtx = edgeCanvas.getContext("2d");
  if (!edgeCtx) return;

  // Draw original image
  edgeCtx.drawImage(tempCanvas, 0, 0);

  // Apply edge detection
  const edgeData = edgeCtx.getImageData(0, 0, width, height);
  const edgePixels = edgeData.data;

  // Simple edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const idxLeft = (y * width + (x - 1)) * 4;
      const idxRight = (y * width + (x + 1)) * 4;
      const idxUp = ((y - 1) * width + x) * 4;
      const idxDown = ((y + 1) * width + x) * 4;

      // Calculate differences
      const diffX =
        Math.abs(pixels[idxLeft] - pixels[idxRight]) +
        Math.abs(pixels[idxLeft + 1] - pixels[idxRight + 1]) +
        Math.abs(pixels[idxLeft + 2] - pixels[idxRight + 2]);

      const diffY =
        Math.abs(pixels[idxUp] - pixels[idxDown]) +
        Math.abs(pixels[idxUp + 1] - pixels[idxDown + 1]) +
        Math.abs(pixels[idxUp + 2] - pixels[idxDown + 2]);

      const diff = diffX + diffY;

      if (diff > 100) {
        // Threshold for edge detection
        edgePixels[idx] = 255;
        edgePixels[idx + 1] = 255;
        edgePixels[idx + 2] = 255;
        edgePixels[idx + 3] = 255;
      } else {
        edgePixels[idx] = 0;
        edgePixels[idx + 1] = 0;
        edgePixels[idx + 2] = 0;
        edgePixels[idx + 3] = 0;
      }
    }
  }

  edgeCtx.putImageData(edgeData, 0, 0);

  // Apply dilate operation to thicken edges
  const dilatedCanvas = document.createElement("canvas");
  dilatedCanvas.width = width;
  dilatedCanvas.height = height;
  const dilatedCtx = dilatedCanvas.getContext("2d");
  if (!dilatedCtx) return;

  // Draw edges
  dilatedCtx.drawImage(edgeCanvas, 0, 0);

  // Apply multiple color glows around the edges
  // Yellow glow
  dilatedCtx.globalCompositeOperation = "source-over";
  dilatedCtx.shadowColor = "rgba(255, 255, 0, 0.8)";
  dilatedCtx.shadowBlur = 15;
  dilatedCtx.shadowOffsetX = 0;
  dilatedCtx.shadowOffsetY = 0;
  dilatedCtx.drawImage(edgeCanvas, 0, 0);

  // Red glow
  dilatedCtx.shadowColor = "rgba(255, 0, 0, 0.7)";
  dilatedCtx.shadowBlur = 12;
  dilatedCtx.drawImage(edgeCanvas, 0, 0);

  // Blue glow
  dilatedCtx.shadowColor = "rgba(0, 0, 255, 0.6)";
  dilatedCtx.shadowBlur = 10;
  dilatedCtx.drawImage(edgeCanvas, 0, 0);

  // Now blend this glow with the original image
  ctx.globalCompositeOperation = "screen";
  ctx.drawImage(dilatedCanvas, 0, 0);

  // Draw the original image on top, slightly enhanced
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "contrast(110%) brightness(105%)";
  ctx.drawImage(origCanvas, 0, 0);
  ctx.filter = "none";

  // Add final color boost
  ctx.globalCompositeOperation = "color-dodge";
  const finalGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    height / 2,
  );
  finalGradient.addColorStop(0, "rgba(255, 255, 100, 0.1)");
  finalGradient.addColorStop(0.7, "rgba(255, 100, 100, 0.05)");
  finalGradient.addColorStop(1, "rgba(100, 100, 255, 0)");

  ctx.fillStyle = finalGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";
}

function applyGlitchEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Create a copy of the original image
  const original = new Uint8ClampedArray(pixels);

  // Number of glitch blocks
  const numGlitches = 20;

  // Create RGB shift
  for (let i = 0; i < pixels.length; i += 4) {
    // Random RGB channel shift
    if (Math.random() < 0.03) {
      pixels[i] = original[i + (8 % pixels.length)]; // Red channel shift
    }
    if (Math.random() < 0.03) {
      pixels[i + 2] = original[i + (4 % pixels.length)]; // Blue channel shift
    }
  }

  // Create random glitch blocks
  for (let i = 0; i < numGlitches; i++) {
    // Random block position and size
    const blockX = Math.floor(Math.random() * width);
    const blockY = Math.floor(Math.random() * height);
    const blockWidth = Math.floor(Math.random() * 100) + 20;
    const blockHeight = Math.floor(Math.random() * 50) + 10;

    // Random shift amount for the block
    const shiftX = Math.floor(Math.random() * 20) - 10;
    const shiftY = 0; // Keep vertical to maintain a realistic glitch look

    // Apply the block shift
    for (let y = blockY; y < blockY + blockHeight && y < height; y++) {
      for (let x = blockX; x < blockX + blockWidth && x < width; x++) {
        const sourceIndex = (y * width + x) * 4;

        // Make sure target is within bounds
        const targetX = x + shiftX;
        const targetY = y + shiftY;

        if (
          targetX >= 0 &&
          targetX < width &&
          targetY >= 0 &&
          targetY < height
        ) {
          const targetIndex = (targetY * width + targetX) * 4;

          // Color tint for glitch blocks
          const tint = Math.random();
          if (tint < 0.33) {
            // Red tint
            pixels[targetIndex] = Math.min(255, original[sourceIndex] * 1.2);
            pixels[targetIndex + 1] = original[sourceIndex + 1] * 0.8;
            pixels[targetIndex + 2] = original[sourceIndex + 2] * 0.8;
          } else if (tint < 0.66) {
            // Green tint
            pixels[targetIndex] = original[sourceIndex] * 0.8;
            pixels[targetIndex + 1] = Math.min(
              255,
              original[sourceIndex + 1] * 1.2,
            );
            pixels[targetIndex + 2] = original[sourceIndex + 2] * 0.8;
          } else {
            // Blue tint
            pixels[targetIndex] = original[sourceIndex] * 0.8;
            pixels[targetIndex + 1] = original[sourceIndex + 1] * 0.8;
            pixels[targetIndex + 2] = Math.min(
              255,
              original[sourceIndex + 2] * 1.2,
            );
          }

          pixels[targetIndex + 3] = original[sourceIndex + 3];
        }
      }
    }
  }

  // Add horizontal lines
  for (let i = 0; i < 10; i++) {
    const lineY = Math.floor(Math.random() * height);
    const lineHeight = Math.floor(Math.random() * 5) + 1;
    const lineOpacity = Math.random() * 0.7 + 0.3;

    for (let y = lineY; y < lineY + lineHeight && y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        pixels[index] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        pixels[index + 3] = 255 * lineOpacity;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyCrosshatchEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  // Store the original image
  const originalData = ctx.getImageData(0, 0, width, height);
  const data = originalData.data;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // Define line parameters
  const lineSpacing = 6;
  const threshold1 = 200;
  const threshold2 = 150;
  const threshold3 = 100;
  const threshold4 = 50;

  // Set line style
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;

  // First set of lines (/)
  ctx.beginPath();
  for (let y = -height; y < height; y += lineSpacing) {
    for (let x = 0; x < width + height; x += 1) {
      const xpos = x;
      const ypos = y + x;

      if (ypos >= 0 && ypos < height && xpos >= 0 && xpos < width) {
        const index = (ypos * width + xpos) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;

        if (brightness < threshold1) {
          if (!((x + y) % lineSpacing)) {
            ctx.moveTo(xpos - 0.5, ypos - 0.5);
            ctx.lineTo(xpos + 0.5, ypos + 0.5);
          }
        }
      }
    }
  }
  ctx.stroke();

  // Second set of lines (\)
  ctx.beginPath();
  for (let y = -height; y < height; y += lineSpacing) {
    for (let x = 0; x < width + height; x += 1) {
      const xpos = x;
      const ypos = y + x;

      if (ypos >= 0 && ypos < height && xpos >= 0 && xpos < width) {
        const index = (ypos * width + xpos) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;

        if (brightness < threshold2) {
          if (!((x + y + lineSpacing / 2) % lineSpacing)) {
            ctx.moveTo(xpos + 0.5, ypos - 0.5);
            ctx.lineTo(xpos - 0.5, ypos + 0.5);
          }
        }
      }
    }
  }
  ctx.stroke();

  // Third set of lines (horizontal)
  ctx.beginPath();
  for (let y = 0; y < height; y += lineSpacing / 2) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;

      if (brightness < threshold3) {
        if (!(x % lineSpacing)) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + lineSpacing / 2, y);
        }
      }
    }
  }
  ctx.stroke();

  // Fourth set of lines (vertical)
  ctx.beginPath();
  for (let x = 0; x < width; x += lineSpacing / 2) {
    for (let y = 0; y < height; y += 1) {
      const index = (y * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;

      if (brightness < threshold4) {
        if (!(y % lineSpacing)) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + lineSpacing / 2);
        }
      }
    }
  }
  ctx.stroke();
}

// In a real application, you would implement AI-powered filters using TensorFlow.js
// For example, to implement a real cartoon filter:
/*
import * as tf from '@tensorflow/tfjs'

export async function applyCartoonFilter(canvas: HTMLCanvasElement): Promise<void> {
  // Load the pre-trained model
  const model = await tf.loadGraphModel('path/to/cartoon_model/model.json')
  
  // Get image data from canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // Convert image data to tensor
  const tensor = tf.browser.fromPixels(imageData)
  
  // Normalize and reshape tensor for the model
  const normalized = tensor.div(255).expandDims(0)
  
  // Run inference
  const result = model.predict(normalized) as tf.Tensor
  
  // Convert result back to canvas
  const processedImageData = await tf.browser.toPixels(result.squeeze())
  
  // Put processed image data back to canvas
  const uint8Array = new Uint8ClampedArray(processedImageData)
  const newImageData = new ImageData(uint8Array, canvas.width, canvas.height)
  ctx.putImageData(newImageData, 0, 0)
  
  // Clean up tensors
  tensor.dispose()
  normalized.dispose()
  result.dispose()
}
*/
