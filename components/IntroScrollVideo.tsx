"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INTRO_END_PROGRESS = 0.42;
const ABOUT_REVEAL_START = 0.43;
const ABOUT_REVEAL_END = 0.49;
const PROJECTS_START = 0.66;
const PROJECTS_FADE_END = 0.72;
const PROJECTS_END = 0.96;
const PROJECTS_MENU_REVEAL_START = 0.86;
const PROJECTS_MENU_REVEAL_END = 0.98;

export default function IntroScrollVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const titleOverlayRef = useRef<HTMLDivElement | null>(null);
  const scrollOverlayRef = useRef<HTMLDivElement | null>(null);
  const aboutStageRef = useRef<HTMLDivElement | null>(null);
  const projectsVideoRef = useRef<HTMLVideoElement | null>(null);
  const projectsMenuRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const projectsVideo = projectsVideoRef.current;

    if (!section || !video || !projectsVideo) {
      return;
    }

    let duration = 0;
    let projectsDuration = 0;
    let rafId = 0;
    let projectsRafId = 0;

    const updateOverlayMotion = (progress: number) => {
      const titleOverlay = titleOverlayRef.current;
      const scrollOverlay = scrollOverlayRef.current;
      const aboutStage = aboutStageRef.current;
      const projectsMenu = projectsMenuRef.current;
      const mediaProgress = gsap.utils.clamp(0, 1, progress / INTRO_END_PROGRESS);
      const projectsProgress = gsap.utils.clamp(
        0,
        1,
        (progress - PROJECTS_START) / (PROJECTS_END - PROJECTS_START),
      );
      const projectsFadeProgress = gsap.utils.clamp(
        0,
        1,
        (progress - PROJECTS_START) / (PROJECTS_FADE_END - PROJECTS_START),
      );

      gsap.set(video, {
        scale: 1 + mediaProgress * 0.14,
      });

      gsap.set(projectsVideo, {
        autoAlpha: projectsFadeProgress,
      });

      if (projectsMenu) {
        const projectsMenuProgress = gsap.utils.clamp(
          0,
          1,
          (projectsProgress - PROJECTS_MENU_REVEAL_START) /
            (PROJECTS_MENU_REVEAL_END - PROJECTS_MENU_REVEAL_START),
        );

        gsap.set(projectsMenu, {
          autoAlpha: projectsMenuProgress,
        });
      }

      if (aboutStage) {
        const aboutProgress = gsap.utils.clamp(
          0,
          1,
          (progress - ABOUT_REVEAL_START) / (ABOUT_REVEAL_END - ABOUT_REVEAL_START),
        );

        gsap.set(aboutStage, {
          autoAlpha: aboutProgress,
        });
      }

      if (!titleOverlay || !scrollOverlay) {
        return;
      }

      if (progress < 0.01) {
        gsap.set([titleOverlay, scrollOverlay], {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      const overlayProgress = gsap.utils.clamp(0, 1, (progress - 0.01) / 0.22);

      gsap.set(titleOverlay, {
        autoAlpha: 1 - overlayProgress,
        xPercent: -18 * overlayProgress,
        yPercent: -38 * overlayProgress,
        scale: 1 + 0.2 * overlayProgress,
      });

      gsap.set(scrollOverlay, {
        autoAlpha: 1 - overlayProgress,
        xPercent: 18 * overlayProgress,
        yPercent: 44 * overlayProgress,
        scale: 1 + 0.16 * overlayProgress,
      });
    };

    const updateVideoTime = (progress: number) => {
      if (!duration || Number.isNaN(duration)) {
        return;
      }

      const mediaProgress = gsap.utils.clamp(0, 1, progress / INTRO_END_PROGRESS);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        video.currentTime = gsap.utils.clamp(0, duration, mediaProgress * duration);
      });
    };

    const updateProjectsVideoTime = (progress: number) => {
      if (!projectsDuration || Number.isNaN(projectsDuration)) {
        return;
      }

      const projectsProgress = gsap.utils.clamp(
        0,
        1,
        (progress - PROJECTS_START) / (PROJECTS_END - PROJECTS_START),
      );

      cancelAnimationFrame(projectsRafId);
      projectsRafId = requestAnimationFrame(() => {
        projectsVideo.currentTime = gsap.utils.clamp(
          0,
          projectsDuration,
          projectsProgress * projectsDuration,
        );
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        updateVideoTime(self.progress);
        updateProjectsVideoTime(self.progress);
        updateOverlayMotion(self.progress);
      },
    });

    if (window.location.search.includes("view=projects")) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: section.scrollHeight - window.innerHeight,
          behavior: "auto",
        });
      });
    }

    const handleMetadata = () => {
      duration = video.duration;
      video.pause();
      video.currentTime = 0;
      setIsReady(true);
      trigger.refresh();
    };

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleMetadata, { once: true });
    }

    const handleCanPlay = () => setIsReady(true);
    video.addEventListener("canplay", handleCanPlay);

    const handleProjectsMetadata = () => {
      projectsDuration = projectsVideo.duration;
      projectsVideo.pause();
      projectsVideo.currentTime = 0;
      trigger.refresh();
    };

    if (projectsVideo.readyState >= 1) {
      handleProjectsMetadata();
    } else {
      projectsVideo.addEventListener("loadedmetadata", handleProjectsMetadata, {
        once: true,
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(projectsRafId);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      projectsVideo.removeEventListener("loadedmetadata", handleProjectsMetadata);
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[900vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full origin-center object-cover will-change-transform"
          src="/intro.mp4.mp4"
          poster="/intro-poster.png"
          preload="auto"
          muted
          playsInline
          aria-label="Intro video"
        />

        <div
          className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-700 ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        />

        <div
          ref={aboutStageRef}
          className="pointer-events-none absolute inset-0 opacity-0"
        >
          <img
            src="/about-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <video
          ref={projectsVideoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          src="/intro-to-projects.mp4"
          preload="auto"
          muted
          playsInline
          aria-label="Projects intro video"
        />

        <div
          ref={projectsMenuRef}
          className="absolute inset-0 opacity-0"
        >
          <div className="absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.777778vh)] -translate-x-1/2 -translate-y-1/2 [container-type:size]">
            <img
              src="/projects-menu.png"
              alt="Projects menu"
              className="absolute inset-0 h-full w-full object-fill"
            />

            {[1, 2, 3, 4, 5].map((project) => (
              <img
                key={project}
                src={`/projects-hover-${project}.png`}
                alt=""
                className={`pointer-events-none absolute inset-0 h-full w-full object-fill transition-opacity duration-100 ease-out ${
                  hoveredProject === project ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {[
              { id: 1, href: "/projects1", left: 5.8854, top: 23.3333, width: 12.1354, height: 54.0741 },
              { id: 2, href: "/projects2", left: 22.3438, top: 23.3333, width: 12.1354, height: 54.0741 },
              { id: 3, href: "/projects3", left: 38.8021, top: 23.3333, width: 12.1354, height: 54.0741 },
              { id: 4, href: "/projects4", left: 55.2604, top: 23.3333, width: 12.1354, height: 54.0741 },
              { id: 5, href: "/projects5", left: 71.7188, top: 23.3333, width: 12.1354, height: 54.0741 },
            ].map((hotspot) => (
              <Link
                key={hotspot.id}
                aria-label={`Project ${hotspot.id}`}
                href={hotspot.href}
                className="absolute z-30 cursor-pointer bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{
                  left: `${hotspot.left}%`,
                  top: `${hotspot.top}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                  clipPath: "ellipse(50% 50% at 50% 50%)",
                }}
                onMouseEnter={() => setHoveredProject(hotspot.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(hotspot.id)}
                onBlur={() => setHoveredProject(null)}
              >
                <span className="sr-only">Open project {hotspot.id}</span>
              </Link>
            ))}
          </div>
        </div>

        <div
          ref={titleOverlayRef}
          className="pointer-events-none absolute left-[clamp(24px,6.5vw,128px)] top-[clamp(56px,10.8vh,118px)] w-[min(74vw,1077px)] origin-left md:w-[min(56vw,1077px)]"
        >
          <img
            src="/title-overlay.png"
            alt=""
            className="block h-auto w-full animate-[overlayFadeIn_1.1s_ease-out_0.12s_both] object-contain"
          />
        </div>

        <div
          ref={scrollOverlayRef}
          className="pointer-events-none absolute bottom-[clamp(36px,7.8vh,92px)] right-[clamp(22px,6vw,116px)] w-[min(64vw,520px)] origin-right md:w-[min(38vw,701px)]"
        >
          <img
            src="/scroll-overlay.png"
            alt=""
            className="block h-auto w-full animate-[overlayFadeIn_1.1s_ease-out_0.28s_both] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
