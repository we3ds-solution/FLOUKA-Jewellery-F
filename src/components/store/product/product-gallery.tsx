import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type GalleryImage = { url: string; altText: string | null };

// SRP: product image gallery only. Keyed by handle from the parent so its
// internal index resets on navigation with no effects.
export function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [img, setImg] = useState(0);
  return (
    <>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
        <AnimatePresence mode="wait">
          {images[img] && (
            <motion.img
              key={images[img].url}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={images[img].url}
              alt={images[img].altText ?? title}
              className="size-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((im, i) => (
            <motion.button
              whileTap={{ scale: 0.92 }}
              key={im.url}
              onClick={() => setImg(i)}
              aria-label={`صورة ${i + 1}`}
              className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-20 ${i === img ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={im.url} alt="" className="size-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </>
  );
}
