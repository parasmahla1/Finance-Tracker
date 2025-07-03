"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-violet-50/50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-violet-950/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50 mb-8">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">✨ AI-Powered Financial Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl pb-6 gradient-title leading-tight">
          Your Money, <br />
          <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Simplified</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Experience the future of financial management with intelligent insights, 
          automated tracking, and personalized recommendations that help you achieve your financial goals.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Journey
            </Button>
          </Link>
          <Link href="">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300">
              Watch Demo
            </Button>
          </Link>
        </div>
        
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <div className="relative">
              <Image
                src="/banner.jpeg"
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="rounded-2xl shadow-2xl border border-white/20 mx-auto backdrop-blur-sm"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
