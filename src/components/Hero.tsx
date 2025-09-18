'use client';

import { useEffect, useRef } from 'react';
import imgImage42 from '/public/logo-icon.png';
import imgVector from '/public/3a350fc98a1573882d7a0516b185c7d3a51786a5.svg';

export default function Hero() {
  const tickerRef = useRef<HTMLDivElement>(null);

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
  return (
    <div className="bg-black box-border content-stretch flex flex-col items-center justify-between pb-[60px] pt-[40px] px-[30px] relative rounded-[30px] size-full min-h-[400px] mb-8 overflow-hidden">
      {/* Navigation */}
      <div className="gap-[13px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[50px] relative rounded-[120px] shrink-0 w-full">
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
          <a href="https://fiberonyx.com/apply" className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors">
            <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
              <p className="leading-[normal] whitespace-pre">Apply</p>
            </div>
          </a>
          <a href="/" className="backdrop-blur-[25px] backdrop-filter bg-[rgba(233,233,233,0.18)] box-border content-stretch flex gap-[10px] items-center justify-center px-[23px] py-[15px] relative rounded-[120px] shrink-0 hover:bg-[rgba(233,233,233,0.25)] transition-colors">
            <div className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
              <p className="leading-[normal] whitespace-pre">Leaderboard</p>
            </div>
          </a>
        </div>
        
        {/* Logo */}
        <div className="[grid-area:1_/_2] box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative shrink-0">
          <img alt="" className="h-[auto] shrink-0 w-[100px]" src={imgImage42.src} />
        </div>
      </div>
      
      {/* Main Title - Ticker Animation */}
      <div className="font-sans font-bold leading-[0.9] not-italic relative shrink-0 text-[16vw] text-center text-white overflow-hidden">
        <div ref={tickerRef} className="whitespace-nowrap">
          <span className="inline-block px-8">Leaderboard</span>
          <span className="inline-block px-8">Leaderboard</span>
          <span className="inline-block px-8">Leaderboard</span>
        </div>
      </div>
      
      {/* Decorative Vector */}
      {/* <div className="absolute bottom-0 h-[29.2px] left-1/2 transform -translate-x-1/2 w-[136.6px]">
        <img alt="" className="block max-w-none size-full" src={imgVector} />
      </div> */}
    </div>
  );
}
