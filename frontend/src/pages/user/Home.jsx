const Home = () => {
    return (
      <div className="min-h-screen relative">
        {/* Background avec grille */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Étoiles animées */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
        
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 md:px-8">
          <div className="w-full max-w-[90%] md:max-w-5xl bg-white/[0.03] backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-12 border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] text-center">
            <h1 className="mb-4 md:mb-8 text-4xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">
              Welcome to <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-white block md:inline mt-2 md:mt-0">Night Novels</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 mt-4 md:mt-6 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
              Your journey into the world of literature begins here.
            </p>
  
            <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <button className="w-full md:w-auto px-6 md:px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30">
                Start Reading
              </button>
              <button className="w-full md:w-auto px-6 md:px-8 py-3 bg-transparent text-white border border-white/20 rounded-xl font-medium hover:bg-white/5 transition-all duration-300">
                Explore Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home; 