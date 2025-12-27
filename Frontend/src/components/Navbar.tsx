import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/services/Auth/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  GraduationCap,
} from 'lucide-react';
import { GetStarted } from "./GetStarted";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  
  // Check if currently on any dashboard page (including sub-routes)
  const isDashboardPage = location.pathname.startsWith('/student') || 
                          location.pathname.startsWith('/alumni');

  // Check if user has authentication
  const hasAuth = isAuthenticated;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar entrance animation - drop from top with opacity
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
      );

      // Stagger animation for navbar items
      tl.fromTo(
        logoRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.5"
      )
      .fromTo(
        navLinksRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        authRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );

      // Subtle navbar background effect on scroll
      // ScrollTrigger.create({
      //   trigger: "body",
      //   start: "top -50",
      //   end: "top -50",
      //   onEnter: () => {
      //     gsap.to(navbarRef.current, {
      //       backgroundColor: "rgba(var(--background), 0.8)",
      //       backdropFilter: "blur(12px)",
      //       duration: 0.3,
      //     });
      //   },
      //   onLeaveBack: () => {
      //     gsap.to(navbarRef.current, {
      //       backgroundColor: "transparent",
      //       backdropFilter: "blur(0px)",
      //       duration: 0.3,
      //     });
      //   },
      // });
    });

    return () => ctx.revert();
  }, []);

  const handleDashboardClick = () => {
    if (hasAuth && user) {
      const userRole = user.accountType.toLowerCase();
      navigate(`/${userRole}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header ref={navbarRef} className="fixed top-0 mx-auto z-40 w-full h-16 pt-6 transition-all" style={{ opacity: 0 }}>
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-0"></div>
      <div className="container px-4 flex items-center justify-between relative z-10">
        <div ref={logoRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
          <div className="w-8 h-8 rounded-sm gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="font-bold text-[#979797] text-2xl">
              NextRef.
            </h1>
          </div>
        </div>
        <div ref={navLinksRef} className="absolute left-1/2 -translate-x-1/2 mt-2 flex items-center space-x-8 bg-secondary px-5 py-[10px] rounded-lg border" style={{ opacity: 0 }}>
          {hasAuth ? (
            <button
              onClick={handleDashboardClick}
              className={`text-md font-medium transition-colors cursor-pointer ${
                isDashboardPage
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
          ) : (
            <NavLink 
              to="/" 
              className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Home
            </NavLink>
          )}
          <NavLink 
            to="/about" 
            className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-primary font-semibold"
          >
            About
          </NavLink>
        </div>

        <div ref={authRef} className="flex items-center gap-3" style={{ opacity: 0 }}>
          {/* Show user info if authenticated via backend */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <GetStarted />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
