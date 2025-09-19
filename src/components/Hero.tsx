'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import imgImage42 from '/public/logo-icon.png';

interface HeroProps {
  title?: string;
}

export default function Hero({ title = 'Leaderboard' }: HeroProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.className = 'scroll-controlled-ticker whitespace-nowrap';
      
      // Add scroll event listener to toggle scroll animation
      let scrollTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        if (tickerRef.current) {
          // Add scroll-active class during scrolling
          tickerRef.current.classList.add('scroll-ticker-active');
          tickerRef.current.classList.remove('scroll-controlled-ticker');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (tickerRef.current) {
            // Remove scroll-active class when scrolling stops
            tickerRef.current.classList.remove('scroll-ticker-active');
            tickerRef.current.classList.add('scroll-controlled-ticker');
          }
        }, 100);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isLeaderboardOpen && leaderboardRef.current && !leaderboardRef.current.contains(e.target as Node)) {
        setIsLeaderboardOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLeaderboardOpen]);
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-between pb-[60px] pt-[40px] px-[30px] relative rounded-[30px] size-full min-h-[200px] mb-8 overflow-hidden"
      style={{
        backgroundImage: "url('/noise.png')",
        background: `url('/noise.png'), radial-gradient(122.97% 109.34% at 13.09% 100%, #494949 0%, #282828 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', 
        backgroundPosition: '0% 0%'
      }}
    >
      {/* Navigation */}
      <div className="relative w-full h-[50px]">
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between w-full h-full">
          {/* Logo on left */}
          <div className="flex items-center">
            <img alt="Onyx Logo" className="h-[40px] w-auto" src={imgImage42.src} />
          </div>
          
          {/* Hamburger menu on right */}
          <button
            onClick={toggleMobileMenu}
            className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex flex-col gap-[4px] items-center justify-center p-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className={`w-[20px] h-[2px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></div>
            <div className={`w-[20px] h-[2px] bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-[20px] h-[2px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:grid gap-[13px] grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[50px] rounded-[120px] w-full">
          <div className="[grid-area:1_/_1] content-stretch flex gap-[4px] items-center justify-start relative shrink-0">
            <a href="https://fiberonyx.com" className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors">
              <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                <p className="leading-[normal] whitespace-pre">Home</p>
              </div>
            </a>
            <a href="https://fiberonyx.com/about" className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors">
              <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                <p className="leading-[normal] whitespace-pre">About us</p>
              </div>
            </a>
            <a href="https://fiberonyx.com/contact" className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors">
              <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                <p className="leading-[normal] whitespace-pre">Apply</p>
              </div>
            </a>
            {/* Leaderboard Dropdown (Desktop) */}
            <div className="relative" ref={leaderboardRef}>
              <button
                className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors"
                onClick={() => setIsLeaderboardOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isLeaderboardOpen}
              >
                <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
                  <p className="leading-[normal] whitespace-pre">Leaderboard ▾</p>
                </div>
              </button>
              {isLeaderboardOpen && (
                <div className="absolute left-0 mt-2 min-w-[200px] z-50 backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] rounded-[16px] overflow-hidden shadow-lg">
                  <div className="flex flex-col">
                    <Link href="/" className="px-4 py-3 hover:bg-[rgba(233,233,233,0.25)] transition-colors" onClick={() => setIsLeaderboardOpen(false)}>
                      <span className="font-sans text-white">Reps</span>
                    </Link>
                    <Link href="/teams" className="px-4 py-3 hover:bg-[rgba(233,233,233,0.25)] transition-colors" onClick={() => setIsLeaderboardOpen(false)}>
                      <span className="font-sans text-white">Teams</span>
                    </Link>
                    <Link href="/products" className="px-4 py-3 hover:bg-[rgba(233,233,233,0.25)] transition-colors" onClick={() => setIsLeaderboardOpen(false)}>
                      <span className="font-sans text-white">Products</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Logo */}
          <div className="[grid-area:1_/_2] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0">
            <img alt="Onyx Logo" className="h-[auto] shrink-0 w-[100px]" src={imgImage42.src} />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full mt-2 backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] rounded-[20px] transition-all duration-300 overflow-hidden z-50 ${isMobileMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-4 gap-2">
            <a 
              href="https://fiberonyx.com" 
              className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                <p className="leading-[normal]">Home</p>
              </div>
            </a>
            <a 
              href="https://fiberonyx.com/about" 
              className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                <p className="leading-[normal]">About us</p>
              </div>
            </a>
            <a 
              href="https://fiberonyx.com/contact" 
              className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                <p className="leading-[normal]">Apply</p>
              </div>
            </a>
            {/* Mobile Leaderboard Dropdown Options */}
            <div className="grid grid-cols-1 gap-2">
              <Link 
                href="/" 
                className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                  <p className="leading-[normal]">Reps</p>
                </div>
              </Link>
              <Link 
                href="/teams" 
                className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                  <p className="leading-[normal]">Teams</p>
                </div>
              </Link>
              <Link 
                href="/products" 
                className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border flex items-center justify-center px-[23px] py-[15px] rounded-[120px] hover:bg-[rgba(233,233,233,0.25)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="font-sans font-semibold leading-[0] not-italic text-[16px] text-white">
                  <p className="leading-[normal]">Products</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Title - Ticker Animation */}
      <div className="font-sans font-semibold leading-[0.9] not-italic relative shrink-0 text-[30vw] md:text-[16vw] text-center text-white overflow-hidden">
        <div ref={tickerRef} className="whitespace-nowrap">
          <span className="inline-block px-8">{title}</span>
          <span className="inline-block px-8">{title}</span>
          <span className="inline-block px-8">{title}</span>
        </div>
      </div>
      
      {/* Decorative Vector */}
      {/* <div className="absolute bottom-0 h-[29.2px] left-1/2 transform -translate-x-1/2 w-[136.6px]">
        <img alt="" className="block max-w-none size-full" src={imgVector} />
      </div> */}
    </div>
  );
}
