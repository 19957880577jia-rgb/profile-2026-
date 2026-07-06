"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type DemoId = 1 | 2;

const mediaLayers = [
  {
    id: 1 as const,
    normal: "/project2/normal1.png",
    hover: "/project2/hover1.png",
    click: "/project2/click1.png",
    left: 1555 / 1920,
    top: 5681 / 7512,
    width: 247 / 1920,
  },
  {
    id: 2 as const,
    normal: "/project2/normal2.png",
    hover: "/project2/hover2.png",
    click: "/project2/click2.png",
    left: 1556 / 1920,
    top: 5957 / 7512,
    width: 246 / 1920,
  },
];

const videoFrame = {
  left: 147 / 1920,
  top: 5604 / 7512,
  width: 1364 / 1920,
  height: 767 / 7512,
};

export default function Project2DetailPage() {
  const gameVideoRef = useRef<HTMLVideoElement | null>(null);
  const animationVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hoveredDemo, setHoveredDemo] = useState<DemoId | null>(null);
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);

  const resetVideos = () => {
    [gameVideoRef.current, animationVideoRef.current].forEach((video) => {
      if (!video) {
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  };

  const handlePlay = async (id: DemoId) => {
    const activeVideo = id === 1 ? gameVideoRef.current : animationVideoRef.current;
    const idleVideo = id === 1 ? animationVideoRef.current : gameVideoRef.current;

    idleVideo?.pause();
    if (idleVideo) {
      idleVideo.currentTime = 0;
    }

    if (!activeVideo) {
      return;
    }

    setActiveDemo(id);
    setHoveredDemo(null);
    activeVideo.defaultMuted = false;
    activeVideo.muted = false;
    activeVideo.volume = 1;
    activeVideo.currentTime = 0;

    try {
      await activeVideo.play();
    } catch {
      setActiveDemo(null);
    }
  };

  const handleEnded = () => {
    resetVideos();
    setActiveDemo(null);
  };

  const enableAudio = (video: HTMLVideoElement) => {
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
  };

  const getLayerSrc = (id: DemoId) => {
    const layer = mediaLayers.find((item) => item.id === id);

    if (!layer) {
      return "";
    }

    if (activeDemo === id) {
      return layer.click;
    }

    if (!activeDemo && hoveredDemo === id) {
      return layer.hover;
    }

    return layer.normal;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/82 px-5 py-4 backdrop-blur md:px-10">
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

      <section
        aria-label="被困在时间里的美食家"
        className="mx-auto w-full max-w-[1920px]"
      >
        <h1 className="sr-only">被困在时间里的美食家</h1>
        <div className="relative mx-auto w-full max-w-full">
          <video
            ref={gameVideoRef}
            className={`absolute object-cover ${
              activeDemo === 2
                ? "pointer-events-none z-0 opacity-0"
                : "pointer-events-auto z-[2] opacity-100"
            }`}
            src="/project2/video-game.mp4"
            preload="metadata"
            controls
            playsInline
            onLoadedMetadata={(event) => enableAudio(event.currentTarget)}
            onEnded={handleEnded}
            style={{
              left: `${videoFrame.left * 100}%`,
              top: `${videoFrame.top * 100}%`,
              width: `${videoFrame.width * 100}%`,
              height: `${videoFrame.height * 100}%`,
            }}
          />

          <video
            ref={animationVideoRef}
            className={`absolute object-cover ${
              activeDemo === 2
                ? "pointer-events-auto z-[2] opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            src="/project2/video.mp4"
            preload="metadata"
            controls
            playsInline
            onLoadedMetadata={(event) => enableAudio(event.currentTarget)}
            onEnded={handleEnded}
            style={{
              left: `${videoFrame.left * 100}%`,
              top: `${videoFrame.top * 100}%`,
              width: `${videoFrame.width * 100}%`,
              height: `${videoFrame.height * 100}%`,
            }}
          />

          {mediaLayers.map((layer) => (
            <img
              key={layer.id}
              src={getLayerSrc(layer.id)}
              alt=""
              className="pointer-events-none absolute z-[1] h-auto"
              style={{
                left: `${layer.left * 100}%`,
                top: `${layer.top * 100}%`,
                width: `${layer.width * 100}%`,
              }}
            />
          ))}

          <img
            src="/project2/project2.png"
            alt="被困在时间里的美食家"
            className="pointer-events-none relative z-10 mx-auto block h-auto w-full max-w-full"
          />

          {mediaLayers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              aria-label={`Play project 2 demo ${layer.id}`}
              className="absolute z-20 cursor-pointer bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623]"
              onClick={() => handlePlay(layer.id)}
              onMouseEnter={() => setHoveredDemo(layer.id)}
              onMouseLeave={() => setHoveredDemo(null)}
              onFocus={() => setHoveredDemo(layer.id)}
              onBlur={() => setHoveredDemo(null)}
              style={{
                left: `${layer.left * 100}%`,
                top: `${layer.top * 100}%`,
                width: `${layer.width * 100}%`,
                aspectRatio: layer.id === 1 ? "247 / 140" : "246 / 140",
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
