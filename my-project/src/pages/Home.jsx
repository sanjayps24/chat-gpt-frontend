import React from "react";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          What can I help with?
        </h1>

        <div className="relative group mx-auto">
          {/* Glowing effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000"></div>
          
          <div className="relative flex items-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-6 py-5 shadow-2xl focus-within:ring-2 focus-within:ring-white/50 transition-all">
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 outline-none text-xl text-white placeholder-white/60 bg-transparent font-medium"
            />
            <button className="ml-4 p-3 bg-white text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          {["Analyze Data", "Build a Plan", "Draft Email", "Code Helper"].map((item) => (
            <button
              key={item}
              className="px-6 py-2.5 text-sm font-bold backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 hover:border-white/40 transition-all shadow-lg"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <footer className="mt-20">
        <p className="text-xs font-medium text-white/50 text-center max-w-md drop-shadow-md">
          ChatGPT can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
};

export default Home;