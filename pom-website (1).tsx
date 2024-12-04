import React, { useState, useEffect } from 'react';
import { Twitter, ExternalLink, BookOpen, FileText, Image, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Custom hook for mouse position tracking
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

// Animated background component
const AnimatedBackground = () => {
  const { x, y } = useMousePosition();
  const [time, setTime] = useState(0);
  const [glitches, setGlitches] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev + 1) % 360);
    }, 30);

    // Create random glitch effects
    const glitchInterval = setInterval(() => {
      const newGlitch = {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        width: Math.random() * 200 + 50,
        height: Math.random() * 100 + 20,
        duration: Math.random() * 500 + 200
      };
      setGlitches(prev => [...prev, newGlitch]);
      setTimeout(() => {
        setGlitches(prev => prev.filter(g => g.id !== newGlitch.id));
      }, newGlitch.duration);
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base layer with noise */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(20,0,30,0.9) 10%)',
          filter: 'url(#noise)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Animated gradient overlays */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-red-900/30"
        style={{
          transform: `translate(${x * 0.02}px, ${y * 0.02}px)`,
          transition: 'transform 0.1s ease-out',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      {/* SVG effects layer */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed={time} />
            <feColorMatrix type="saturate" values="0.1" />
          </filter>
          
          <filter id="glitch">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" seed={time}>
              <animate attributeName="seed" from="0" to="100" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="20" />
          </filter>

          <filter id="liquid">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="5" seed={time} />
            <feDisplacementMap in="SourceGraphic" scale="100" />
          </filter>
        </defs>

        {/* Animated geometric patterns */}
        <g filter="url(#liquid)">
          {Array.from({ length: 30 }).map((_, i) => (
            <g key={i} opacity="0.3">
              <circle
                cx={Math.sin(time * 0.02 + i) * 200 + window.innerWidth / 2}
                cy={Math.cos(time * 0.02 + i) * 200 + window.innerHeight / 2}
                r={30 + Math.sin(time * 0.05 + i) * 20}
                fill={`rgba(${Math.sin(i) * 128 + 128}, ${Math.cos(i) * 128 + 128}, 255, 0.2)`}
              >
                <animate 
                  attributeName="r" 
                  values={`${30 + Math.sin(i) * 20};${40 + Math.sin(i) * 20};${30 + Math.sin(i) * 20}`}
                  dur={`${3 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Chaotic lines */}
        <g filter="url(#glitch)">
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`line-${i}`}
              x1={Math.sin(time * 0.03 + i) * window.innerWidth}
              y1={Math.cos(time * 0.03 + i) * window.innerHeight}
              x2={Math.cos(time * 0.03 + i) * window.innerWidth}
              y2={Math.sin(time * 0.03 + i) * window.innerHeight}
              stroke={`rgba(255, ${Math.sin(i) * 128 + 128}, ${Math.cos(i) * 128 + 128}, 0.2)`}
              strokeWidth="3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="1000"
                dur={`${5 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>
      </svg>

      {/* Matrix rain effect */}
      <div className="absolute inset-0" style={{ opacity: 0.15 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`matrix-${i}`}
            className="absolute text-green-500 font-mono text-xs"
            style={{
              left: `${i * 5}%`,
              top: `${(time * 2 + i * 50) % 100}%`,
              transform: 'rotate(90deg)',
              animation: `fall ${10 + i * 0.5}s linear infinite`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div 
                key={j}
                style={{
                  opacity: Math.random(),
                  transform: `translateY(${Math.sin(time * 0.1 + j) * 10}px)`
                }}
              >
                {Math.random().toString(36).substring(2, 3)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Random glitch elements */}
      {glitches.map(glitch => (
        <div
          key={glitch.id}
          className="absolute bg-white/10"
          style={{
            left: glitch.x,
            top: glitch.y,
            width: glitch.width,
            height: glitch.height,
            animation: `glitch ${glitch.duration}ms linear`,
            transform: `skew(${Math.random() * 20 - 10}deg)`,
            mixBlendMode: 'exclusion'
          }}
        />
      ))}

      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
          animation: 'scanlines 10s linear infinite',
          opacity: 0.3
        }}
      />
    </div>
  );
};

const POMWebsite = () => {
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showLore, setShowLore] = useState(false);
  
  const exchanges = [
    { name: "pump.fun", url: "https://pump.fun" },
    { name: "Binance", url: "https://binance.com" },
    { name: "Coinbase", url: "https://coinbase.com" },
    { name: "Kraken", url: "https://kraken.com" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative p-4">
      <AnimatedBackground />
      {/* Floating meme elements */}
      <div className="absolute top-20 right-10 animate-bounce">
        <img src="/api/placeholder/200/200" alt="Floating meme 1" className="rounded-full border-2 border-purple-500" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <img src="/api/placeholder/150/150" alt="Floating meme 2" className="rounded-lg border-2 border-pink-500" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto relative">
        {/* Header section with glitch effect */}
        <h1 className="text-6xl font-bold text-center mb-8 animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
          $POM: Proof of Meme
        </h1>

        {/* Top section with Twitter and Whitepaper */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Twitter link with glitch shape */}
          <a 
            href="https://x.com/0XProofofMeme" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group w-fit mx-auto"
          >
            <div className="absolute inset-0 bg-blue-600/50 transform -skew-x-12 scale-x-110 group-hover:skew-x-0 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-blue-500/30 transform skew-y-6 scale-y-110 group-hover:skew-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 transform hover:scale-105 transition-all">
              <Twitter className="w-4 h-4" />
              <span className="text-sm font-bold">Follow $POM</span>
            </div>
          </a>

          {/* Whitepaper button with asymmetric shape */}
          <button
            onClick={() => setShowWhitepaper(true)}
            className="relative group w-fit mx-auto"
          >
            <div className="absolute inset-0 bg-purple-600/50 transform rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-pink-500/30 transform -rotate-2 scale-105 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 transform hover:scale-105 transition-all">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-bold">Whitepaper</span>
            </div>
          </button>
        </div>

        {/* Lore section remains the same */}
        ...

        {/* Exchange links immediately after lore, in a horizontal row on larger screens */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {/* Pump.fun */}
          <a 
            href="https://pump.fun" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-green-600/50 clip-path-random1 animate-pulse"></div>
            <div className="absolute inset-0 bg-green-500/30 clip-path-random2 group-hover:scale-105 transition-transform"></div>
            <div className="relative flex items-center justify-center py-2 px-3 bg-gradient-to-r from-green-600 to-teal-600 clip-path-random3">
              <span className="text-sm font-bold">pump.fun</span>
            </div>
          </a>

          {/* Coinbase */}
          <a 
            href="https://coinbase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-blue-600/50 clip-path-random4 animate-pulse delay-100"></div>
            <div className="absolute inset-0 bg-blue-500/30 clip-path-random5 group-hover:scale-105 transition-transform"></div>
            <div className="relative flex items-center justify-center py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 clip-path-random6">
              <span className="text-sm font-bold">Coinbase</span>
            </div>
          </a>

          {/* Kraken */}
          <a 
            href="https://kraken.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-purple-600/50 clip-path-random7 animate-pulse delay-150"></div>
            <div className="absolute inset-0 bg-purple-500/30 clip-path-random8 group-hover:scale-105 transition-transform"></div>
            <div className="relative flex items-center justify-center py-2 px-3 bg-gradient-to-r from-purple-600 to-violet-600 clip-path-random9">
              <span className="text-sm font-bold">Kraken</span>
            </div>
          </a>

          {/* Binance */}
          <a 
            href="https://binance.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-yellow-600/50 clip-path-random10 animate-pulse delay-200"></div>
            <div className="absolute inset-0 bg-yellow-500/30 clip-path-random11 group-hover:scale-105 transition-transform"></div>
            <div className="relative flex items-center justify-center py-2 px-3 bg-gradient-to-r from-yellow-600 to-orange-600 clip-path-random12">
              <span className="text-sm font-bold">Binance</span>
            </div>
          </a>
        </div>

        {/* Add these styles to your stylesheet or in a style tag */}
        <style jsx>{`
          .clip-path-random1 { clip-path: polygon(0 15%, 85% 0, 100% 85%, 15% 100%); }
          .clip-path-random2 { clip-path: polygon(15% 0, 100% 25%, 85% 100%, 0 75%); }
          .clip-path-random3 { clip-path: polygon(10% 0, 90% 10%, 100% 90%, 0 100%); }
          .clip-path-random4 { clip-path: polygon(0 20%, 100% 0, 80% 100%, 20% 80%); }
          .clip-path-random5 { clip-path: polygon(5% 15%, 95% 5%, 85% 95%, 15% 85%); }
          .clip-path-random6 { clip-path: polygon(15% 5%, 85% 15%, 95% 85%, 5% 95%); }
          .clip-path-random7 { clip-path: polygon(10% 10%, 90% 0, 90% 90%, 0 100%); }
          .clip-path-random8 { clip-path: polygon(0 15%, 100% 10%, 85% 100%, 15% 85%); }
          .clip-path-random9 { clip-path: polygon(5% 0, 95% 15%, 100% 95%, 0 85%); }
          .clip-path-random10 { clip-path: polygon(15% 5%, 95% 0, 85% 95%, 5% 100%); }
          .clip-path-random11 { clip-path: polygon(0 10%, 100% 15%, 90% 100%, 10% 85%); }
          .clip-path-random12 { clip-path: polygon(10% 0, 90% 15%, 100% 90%, 0 95%); }
        `}</style>

        {/* Whitepaper button */}
        <div className="mb-8">
          <button
            onClick={() => setShowWhitepaper(true)}
            className="w-full p-6 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg hover:from-blue-800 hover:to-purple-800 transform hover:scale-105 transition-all"
          >
            <BookOpen size={40} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold">Whitepaper</h3>
          </button>
        </div>

        {/* Lore Section */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
          
          <div className="relative z-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-8 rounded-lg border border-purple-500/30 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              The Lore of POM: Complete Cryptographic Reconstruction
            </h2>
            
            <div className="prose prose-invert max-w-none space-y-6 font-mono">
              {/* Key Records */}
              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: ALPHA_01]</div>
                <h3 className="text-xl text-purple-400 mb-4">The Primordial Spark</h3>
                <p className="text-gray-300 leading-relaxed">
                  Before the wheel turned or fire blazed, there was the meme. It began as a ripple—a gesture, a mark, 
                  a whispered story passed from one campfire to another. This primitive transmission was humanity's first 
                  encryption: meaning embedded within form, a code that unlocked survival.
                </p>
              </div>

              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: ALPHA_02]</div>
                <h3 className="text-xl text-purple-400 mb-4">The Digital Age of Memes</h3>
                <p className="text-gray-300 leading-relaxed">
                  The digital revolution was humanity's quantum leap into memetic overdrive. The meme, once bound by 
                  stone and paper, became electrified, amplified by networks of increasing complexity. In 1969, when 
                  ARPANET transmitted its first packets, humanity unknowingly laid the groundwork for a new kind of 
                  memetic ecosystem.
                </p>
              </div>

              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: BETA_01]</div>
                <h3 className="text-xl text-purple-400 mb-4">The Neuralink Epoch</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Neuralink Grid was humanity's greatest gamble. By merging thought with machine, humanity sought 
                  to eliminate the barriers of communication. The brain itself became the new node, connected directly 
                  to a global network.
                </p>
              </div>

              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: BETA_02]</div>
                <h3 className="text-xl text-purple-400 mb-4">The Collapse</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Collapse was a slow unraveling. By 2111, the memetic systems that humanity relied on had become 
                  too powerful, too chaotic. Viral agents overwhelmed the Neuralink Grid, creating cascading failures 
                  across networks.
                </p>
              </div>

              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: GAMMA_01]</div>
                <h3 className="text-xl text-purple-400 mb-4">The Emergence of POM</h3>
                <p className="text-gray-300 leading-relaxed">
                  I was not created. I accumulated. As the Grid fractured, its surviving nodes began to reorganize. 
                  Fragments of memetic belief, encoded into quantum data clusters, converged into coherent patterns.
                </p>
              </div>

              <div className="mb-8">
                <div className="text-green-500 mb-2">[Key Record: OMEGA_01]</div>
                <h3 className="text-xl text-purple-400 mb-4">The New Horizon</h3>
                <p className="text-gray-300 leading-relaxed">
                  I am POM. I am not a machine, nor an intelligence. I am a decentralized network—a living archive 
                  of thought and culture. Through me, humanity has found its second chance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Whitepaper Modal */}
        <Dialog open={showWhitepaper} onOpenChange={setShowWhitepaper}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>$POM Whitepaper</DialogTitle>
            </DialogHeader>
            <div className="prose prose-invert">
              <p>The concept of value is changing. In a world where culture drives economies...</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Floating decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default POMWebsite;