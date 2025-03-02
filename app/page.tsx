"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useAnimation,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, HelpCircle } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function Home() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const coinSlotRef = useRef<HTMLDivElement>(null);
  const curtainControls = useAnimation();
  const dragControls = useDragControls();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);

    if (coinSlotRef.current) {
      const slotRect = coinSlotRef.current.getBoundingClientRect();
      const coinX = info.point.x;
      const coinY = info.point.y;

      // Check if coin is dropped in slot
      if (
        coinX >= slotRect.left &&
        coinX <= slotRect.right &&
        coinY >= slotRect.top &&
        coinY <= slotRect.bottom
      ) {
        setIsDropped(true);
        // Animate curtains opening
        await curtainControls.start({
          x: "100%",
          transition: { duration: 2, ease: "easeInOut" },
        });
        // Navigate to photo booth
        setTimeout(() => {
          router.push("/booth");
        }, 200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
      {/* Info Button */}
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="absolute top-4 left-4 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <AlertDialog.Title className="text-lg font-bold text-[#FACC14] text-center">
              Welcome to the Photobooth!
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              Hello! Hope you have fun with the photobooth. All the photos you
              take here are local, which means no one else can see them but you.
              You can save them and then print them out! Snap some cute pics!
              Insert a coin to start your photo session. Enjoy capturing
              memories!
            </AlertDialog.Description>
            <AlertDialog.Action asChild>
              <button className="mt-4 w-full bg-[#FACC14] text-primary-foreground py-2 rounded-lg hover:bg-[#FACC14]/90 transition-colors">
                Got it!
              </button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 left-16 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
      >
        {mounted &&
          (theme === "dark" ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          ))}
      </button>

      {/* Made by Mihir Button */}
      <a
        href="https://www.instagram.com/the_mi_here/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 px-4 py-2 rounded-full bg-[#FACC14] text-primary-foreground hover:bg-[#FACC14]/90 transition-colors font-vt323"
      >
        Made by Mihir
      </a>

      <div className="relative w-full max-w-4xl aspect-[4/3] rounded-xl border-4 border-neutral-700 bg-neutral-900">
        {/* Neon Sign */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50">
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-wider text-red-500 animate-pulse">
            <span className="neon-text">PHOTOS</span>
          </h1>
        </div>

        <div className="absolute inset-0 flex">
          {/* Coin Slot Section */}
          <div className="w-1/5 bg-neutral-800 flex items-center justify-center relative">
            <div
              ref={coinSlotRef}
              className="w-16 h-24 bg-neutral-900 rounded-lg border-2 border-neutral-700 flex flex-col items-center justify-start p-2"
            >
              <span className="text-yellow-500 text-xs mb-2 text-center font-vt323">
                INSERT
                <br />
                COIN HERE
              </span>
              <div className="w-12 h-2 bg-black rounded-sm" />
            </div>

            {/* Draggable Coin */}
            {!isDropped && (
              <motion.div
                drag
                dragControls={dragControls}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-yellow-400 cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center"
                style={{ touchAction: "none" }}
              >
                <span className="text-yellow-800 font-bold">$1</span>
              </motion.div>
            )}
          </div>

          {/* Curtains Section */}
          <div className="relative flex-1 overflow-hidden">
            <motion.div
              animate={curtainControls}
              initial={{ x: 0 }}
              className="absolute inset-0 flex"
            >
              {/* Curtain pleats */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-red-800"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(153,27,27,1) 50%, rgba(0,0,0,0.3) 100%)",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
