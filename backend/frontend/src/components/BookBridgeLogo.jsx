import React from 'react';

export default function BookBridgeLogo({ size = 'default', showTagline = false }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSize = isLarge ? 54 : isSmall ? 32 : 42;

  return (
    <div className="flex items-center gap-3">
      {/* Custom Vector Icon: Open Book forming an arching bridge between two students */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#147D64] via-[#0E5B48] to-[#2357A5] p-2 text-white shadow-md shadow-[#147D64]/20"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Student Silhouette */}
          <circle cx="24" cy="34" r="8" fill="#F5F7F4" opacity="0.95" />
          <path d="M12 54 C12 46, 20 44, 24 44 C28 44, 36 46, 36 54" stroke="#F5F7F4" strokeWidth="4" strokeLinecap="round" />

          {/* Right Student Silhouette */}
          <circle cx="76" cy="34" r="8" fill="#F5F7F4" opacity="0.95" />
          <path d="M64 54 C64 46, 72 44, 76 44 C80 44, 88 46, 88 54" stroke="#F5F7F4" strokeWidth="4" strokeLinecap="round" />

          {/* The Arching Bridge of Open Book Pages */}
          {/* Main Bridge Arch in Hope Yellow */}
          <path 
            d="M 26 58 C 38 42, 62 42, 74 58" 
            stroke="#F2B544" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          
          {/* Open Book Spine & Lower Arch in Clean White */}
          <path 
            d="M 22 68 Q 50 56 78 68" 
            stroke="#FFFFFF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />

          {/* Center Book Spine Notch */}
          <path 
            d="M 50 49 L 50 63" 
            stroke="#F2B544" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />

          {/* Small star of inspiration above the bridge */}
          <circle cx="50" cy="30" r="3" fill="#F2B544" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display font-extrabold tracking-tight text-[#147D64] ${isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-xl'}`}>
            BOOK<span className="text-[#2357A5]">BRIDGE</span>
          </span>
          <span className="rounded-md bg-[#F2B544] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#162220]">
            AI
          </span>
        </div>
        {(showTagline || isLarge) && (
          <span className="text-[11px] font-semibold tracking-wide text-[#5F736C]">
            Read. Reuse. Rise.
          </span>
        )}
      </div>
    </div>
  );
}
