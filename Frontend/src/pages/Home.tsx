import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHero from '@/components/Home/LandingHero';
import { useAuth } from '@/Auth/AuthContext';
import Navbar from '@/components/Navbar';
import Features from '@/components/Home/Features';
import WorkProcess from '@/components/Home/WorkProcess';
import Footer from '@/components/Footer';



const Home = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      // Wait for auth to load
      if (isLoading) return;

      // Redirect if authenticated via backend
      if (isAuthenticated && user) {
        const userRole = user.accountType.toLowerCase();
        navigate(`/${userRole}`);
      }
    }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <LandingHero />

          {/* Features */}
          <Features />

          {/* How it works */}
          <WorkProcess />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home

