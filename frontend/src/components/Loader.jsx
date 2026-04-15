import { motion } from "framer-motion";

function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[100] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl flex flex-col justify-center items-center" 
    : "flex flex-col justify-center items-center w-full py-24 min-h-[400px]";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer Glowing Ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-t-4 border-b-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] mix-blend-screen"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        
        {/* Middle Accent Ring */}
        <motion.div 
          className="absolute inset-3 rounded-full border-r-4 border-l-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] mix-blend-screen"
          animate={{ rotate: -360, scale: [1, 0.85, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Inner Solid Core Pulse */}
        <motion.div
           className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.8)] z-10"
           animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
           transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      {/* Futuristic Branding Subtext */}
      <motion.p 
        className="mt-8 font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-sm filter drop-shadow-sm"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        Loading
      </motion.p>
    </div>
  );
}

export default Loader;
