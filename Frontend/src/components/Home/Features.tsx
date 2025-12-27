import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "../ui/magic-card";
// import { Shield, Link2, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    image: "/F1.png",
    title: "Verified Credentials",
    description: "Resume authenticity verified by College Authority",
  },
  {
    image: "/F2.png",
    title: "Transparent Hiring",
    description: "Every action recorded with immutable proof",
  },
  {
    image: "/F3.png",
    title: "Trust Network",
    description: "Connect with verified alumni for referrals",
  },
];

const Features = React.memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Force hardware acceleration for all elements
      gsap.set([headingRef.current, descRef.current], {
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.set(cardsRef.current.filter(Boolean), {
        force3D: true,
        willChange: "transform, opacity",
      });

      // Heading and description entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
        },
        defaults: {
          force3D: true,
        },
        onComplete: () => {
          // Clear will-change after animation
          gsap.set([headingRef.current, descRef.current], {
            willChange: "auto",
          });
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // Staggered cards entrance - optimized
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            fastScrollEnd: true,
          },
          onComplete: () => {
            // Clear will-change for cards after entrance
            gsap.set(cardsRef.current.filter(Boolean), {
              willChange: "transform",
            });
          },
        }
      );

      // Parallax effects disabled for better performance
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mb-36 min-h-[600px] w-full px-4 mx-auto text-center relative"
    >
      <img 
        ref={bgImageRef}
        src="/Side-BG2.png" 
        alt="Background decoration"
        className="absolute -bottom-[100%] left-[65%] pointer-events-none z-0"
        loading="lazy"
      />
      <h1
        ref={headingRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-foreground"
        style={{ opacity: 0 }}
      >
        Features <span className="gradient-text3">that Feels </span>Human
      </h1>
      <p
        ref={descRef}
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 tracking-tight"
        style={{ opacity: 0 }}
      >
        NextRef amplifies human insight and recommendations, to help incredible
        people find each other.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Image = feature.image;
          return (
              <div
                key={feature.title}
                ref={(el) => (cardsRef.current[index] = el)}
                style={{ opacity: 0, transform: "translateZ(0)" }}
                className="w-full h-96"
              >
                <MagicCard
                  className="w-full h-full rounded-xl p-2"
                  gradientSize={250}
                  gradientColor="oklch(74.443% 0.00008 271.152)"
                  gradientOpacity={0.6}
                  gradientFrom="oklch(0.2809 0 0)"
                  gradientTo="oklch(0.5841 0.1031 171.6359)"
                >
                  <div className="w-full min-h-full h-full rounded-lg relative overflow-hidden border">
                    <img
                      src={Image}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full rounded-lg object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 flex flex-col items-start justify-end px-4 pb-4">
                      <h3 className="font-bold text-2xl text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/90">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </div>
          );
        })}
      </div>
    </div>
  );
});

Features.displayName = "Features";

export default Features;
