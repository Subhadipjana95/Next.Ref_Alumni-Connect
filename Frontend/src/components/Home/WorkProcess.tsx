import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WorkProcess = React.memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const connector1Ref = useRef<SVGPathElement>(null);
  const connector2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading and description entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // SVG Connector 1 - Scroll-based fill reveal animation using clipPath
      if (connector1Ref.current) {
        const svg1 = connector1Ref.current.closest('svg');
        const clipRect1 = svg1?.querySelector('#clip1Rect') as SVGRectElement;
        
        if (clipRect1) {
          gsap.set(clipRect1, {
            attr: { width: 0 }
          });

          gsap.to(clipRect1, {
            attr: { width: 356 },
            ease: "none",
            scrollTrigger: {
              trigger: connector1Ref.current,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 2,
              fastScrollEnd: true,
              invalidateOnRefresh: false,
            },
          });
        }
      }

      // SVG Connector 2 - Scroll-based fill reveal animation using clipPath (right to left)
      if (connector2Ref.current) {
        const svg2 = connector2Ref.current.closest('svg');
        const clipRect2 = svg2?.querySelector('#clip2Rect') as SVGRectElement;
        
        if (clipRect2) {
          gsap.set(clipRect2, {
            attr: { x: 356, width: 356 }
          });

          gsap.to(clipRect2, {
            attr: { x: 0 },
            ease: "none",
            scrollTrigger: {
              trigger: connector2Ref.current,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 2,
              fastScrollEnd: true,
              invalidateOnRefresh: false,
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl p-8 mb-20 relative overflow-visible"
    >      
    <img 
        src="/Side-BG3.png" 
        alt="Background decoration"
        className="absolute right-[55rem] top-[55%] -translate-y-1/2 pointer-events-none z-0"
        loading="lazy"
      />      
      <div className="mb-10 mx-auto text-center">
        <h1 
          ref={headingRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-foreground"
          style={{ opacity: 0 }}
        >
          How <span className="gradient-text3">NextRef </span>works
        </h1>
        <p 
          ref={descRef}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-20 tracking-tight"
          style={{ opacity: 0 }}
        >
          NextRef connects incredible people to opportunities. It's for
          people hiring, connecting others, or even job-seeking themselves.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {/* Process 1 */}
        <div className="process1 h-[28rem] grid grid-cols-2 gap-6">
          <div className="col-span-1 h-full w-[32rem] aspect-[4/5] rounded-lg relative overflow-hidden flex justify-end items-center ml-12">
            <img
              src={"/W1.png"}
              alt={"Student Build Profile and Upload Resume"}
              loading="lazy"
              decoding="async"
              className="absolute w-full h-full rounded-xl object-fill object-center z-0 border"
            />
          </div>
          <div className="col-span-1 w-[60%] flex flex-col justify-end items-start">
            <div className="h-12 w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-3xl mb-4">
              01
            </div>

            <h3 className="text-3xl font-semibold text-foreground mb-2">
              Student Build Profile and Upload Resume
            </h3>
            <p className="text-md text-muted-foreground">
              Resume PDF uploaded, parsed, and credentials submitted for verification
            </p>
          </div>
        </div>

        {/* Process Connectors */}
        <div className="svgConnector1 w-full flex justify-center items-center -my-8">
          <div className="w-[60%] max-w-[500px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 356 126.116"
              overflow="visible"
            >
              <g>
                <defs>
                  <linearGradient
                    id="connector1Gradient"
                    x1="0.49751243781094523"
                    x2="0.5024875621890548"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#145A4B" stopOpacity="1"></stop>
                    <stop
                      offset="0.4318869650900901"
                      stopColor="#838383"
                      stopOpacity="1"
                    ></stop>
                    <stop offset="1" stopColor="#020D0E" stopOpacity="1"></stop>
                  </linearGradient>
                  <clipPath id="clip1">
                    <rect id="clip1Rect" x="0" y="0" width="0" height="126.116" />
                  </clipPath>
                </defs>
                <path
                  ref={connector1Ref}
                  d="M 356 126.116 L 351.939 126.116 L 351.939 120.88 C 351.939 103.083 337.96 87.962 319.068 85.33 L 36.332 45.929 C 15.451 43.018 0 26.31 0 6.639 L 0 0 L 4.061 0 L 4.061 6.64 C 4.061 24.437 18.04 39.554 36.932 42.187 L 319.668 81.588 C 340.549 84.497 356 101.21 356 120.88 Z"
                  fill="url(#connector1Gradient)"
                  stroke="none"
                  clipPath="url(#clip1)"
                ></path>
              </g>
            </svg>
          </div>
        </div>

         {/* Process 2 */}
        <div className="process2 h-[28rem] grid grid-cols-2 gap-6">
          <div className="col-span-1 w-[60%] flex flex-col justify-end items-end text-right ml-48">
            <div className="h-12 w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-3xl mb-4">
              02
            </div>

            <h3 className="text-3xl font-semibold text-foreground mb-2">
              Verifier Approves and Verifies Credentials
            </h3>
            <p className="text-md text-muted-foreground">
              College authority verifies authenticity of credentials
            </p>
          </div>
          <div className="col-span-1 h-full w-[32rem] aspect-[4/5] relative overflow-hidden flex justify-end items-center border rounded-xl">
            <img
              src={"/W2.png"}
              alt={"Student Build Profile and Upload Resume"}
              loading="lazy"
              decoding="async"
              className="absolute w-full h-full rounded-lg object-fill object-center z-0"
            />
          </div>
        </div>

        {/* Process Connectors */}
        <div className="svgConnector2 w-full flex justify-center items-center -my-8">
          <div className="w-[60%] max-w-[500px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356 126.116" overflow="visible">
              <g>
                <defs>
                  <linearGradient id="connector2Gradient" x1="0.49751243781094523" x2="0.5024875621890548" y1="0" y2="1">
                    <stop offset="0" stopColor="#1B5C4A" stopOpacity="1"></stop>
                    <stop offset="0.45326576576576577" stopColor="#838383" stopOpacity="1"></stop>
                    <stop offset="1" stopColor="#051F1A" stopOpacity="1"></stop>
                  </linearGradient>
                  <clipPath id="clip2">
                    <rect id="clip2Rect" x="0" y="0" width="0" height="126.116" />
                  </clipPath>
                </defs>
                <path 
                  ref={connector2Ref}
                  d="M 356 6.64 C 356 26.31 340.549 43.019 319.668 45.929 L 36.933 85.33 C 18.04 87.962 4.061 103.081 4.061 120.877 L 4.061 126.116 L 0 126.116 L 0 120.877 C 0 101.207 15.451 84.497 36.331 81.588 L 319.068 42.187 C 337.96 39.554 351.939 24.437 351.939 6.64 L 351.939 0 L 356 0 Z" 
                  fill="url(#connector2Gradient)"
                  stroke="none"
                  clipPath="url(#clip2)"
                />
              </g>
            </svg>
          </div>
        </div>

         {/* Process 3 */}
        <div className="process3 h-[28rem] grid grid-cols-2 gap-6">
          <div className="col-span-1 h-full w-[32rem] aspect-[4/5] rounded-lg relative overflow-hidden flex justify-end items-center ml-12">
            <img
              src="/W3.png"
              alt={"Alumni Refers Based on Verified Credentials"}
              loading="lazy"
              decoding="async"
              className="border rounded-xl absolute w-full h-full object-fill object-center z-0"
            />
          </div>
          <div className="col-span-1 w-[60%] flex flex-col justify-end items-start">
            <div className="h-12 w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-3xl mb-4">
              03
            </div>

            <h3 className="text-3xl font-semibold text-foreground mb-2">
              Alumni Refers Based on Verified Credentials
            </h3>
            <p className="text-md text-muted-foreground">
              Trusted referrals based on verified credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

WorkProcess.displayName = 'WorkProcess';

export default WorkProcess;
