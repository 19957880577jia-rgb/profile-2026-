"use client";

import Link from "next/link";

type ProjectDetailPageProps = {
  title: string;
  images: string[];
  layers?: {
    src: string;
    left: number;
    top: number;
    width: number;
  }[];
  videoLayers?: {
    src: string;
    left: number;
    top: number;
    width: number;
    height: number;
  }[];
};

export default function ProjectDetailPage({
  title,
  images,
  layers = [],
  videoLayers = [],
}: ProjectDetailPageProps) {
  const hasLayeredCover =
    (layers.length > 0 || videoLayers.length > 0) && images.length > 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/82 px-5 py-4 backdrop-blur md:px-10">
        <Link
          href="/?view=projects"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/82 transition hover:text-[#f5a623]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ←
          </span>
          Back to Contents
        </Link>
      </header>

      <section aria-label={title} className="mx-auto w-full max-w-[1920px]">
        <h1 className="sr-only">{title}</h1>
        {hasLayeredCover ? (
          <>
            <div className="relative mx-auto w-full max-w-full">
              {layers.map((layer) => (
                <img
                  key={layer.src}
                  src={layer.src}
                  alt=""
                  className="pointer-events-none absolute z-0 h-auto"
                  style={{
                    left: `${layer.left}%`,
                    top: `${layer.top}%`,
                    width: `${layer.width}%`,
                  }}
                />
              ))}
              {videoLayers.map((layer) => (
                <video
                  key={layer.src}
                  src={layer.src}
                  className="absolute z-20 object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.defaultMuted = false;
                    event.currentTarget.muted = false;
                    event.currentTarget.volume = 1;
                  }}
                  style={{
                    left: `${layer.left}%`,
                    top: `${layer.top}%`,
                    width: `${layer.width}%`,
                    height: `${layer.height}%`,
                  }}
                />
              ))}
              <img
                src={images[0]}
                alt={`${title} 1`}
                className="relative z-10 mx-auto block h-auto w-full max-w-full"
              />
            </div>
            {images.slice(1).map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`${title} ${index + 2}`}
                className="mx-auto block h-auto w-full max-w-full"
              />
            ))}
          </>
        ) : (
          images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${title} ${index + 1}`}
              className="mx-auto block h-auto w-full max-w-full"
            />
          ))
        )}
      </section>
    </main>
  );
}
