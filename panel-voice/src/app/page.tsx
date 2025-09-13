"use client";
import { useEffect, useRef, useState } from 'react';

// Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.3 3.14C6.83 2.82 7.5 3.21 7.5 3.82V16.18C7.5 16.79 6.83 17.18 6.3 16.86L.7 13.59A1.5 1.5 0 010 12.32V7.68C0 6.61.7 5.93.7 5.93L6.3 3.14z"></path></svg>
);

const DownloadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

// NEW Chevron Icon for our custom dropdown
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
);


const TextToSpeechTab = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // NEW state for managing the custom dropdown's visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const handlePlay = async () => {
    setError('');
    setIsPlaying(true);
    try {
      const response = await fetch(`/api/audio?lang=${selectedLanguage.toLowerCase()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Audio not found');
      }
      const data = await response.json();
      if (audioRef.current) {
        audioRef.current.src = data.url;
        audioRef.current.play();
      }
    } catch (err: any) {
      console.error("Failed to play audio:", err);
      setError(err.message);
      setIsPlaying(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const onEnded = () => {
    setIsPlaying(false);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  }

  const languages = ['English', 'Arabic'];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-1 md:p-2 border border-gray-300 w-full max-w-4xl mx-auto relative overflow-hidden">
      <div className="p-4 md:p-6">
        <textarea
          className="w-full h-48 p-4 border border-pink-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
          defaultValue="In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind… [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Speaker buttons... */}
          <button className="text-xs bg-gray-100 text-pink-700 px-3 py-1 rounded-full hover:bg-gray-300">Samara</button>
          <button className="text-xs bg-gray-100 text-pink-700 px-3 py-1 rounded-full hover:bg-gray-300">Spuds</button>
          <button className="text-xs bg-gray-100 text-pink-700 px-3 py-1 rounded-full hover:bg-gray-300">Jessica</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

          {/* === REFINED CUSTOM DROPDOWN === */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-36 bg-gray-100 border border-gray-200 rounded-md py-2 px-5 text-sm font-medium text-slate-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <span>{selectedLanguage}</span>
              <ChevronDownIcon />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full text-left px-4 py-2 text-sm ${selectedLanguage === lang ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* === END OF CUSTOM DROPDOWN === */}

          <div className="flex items-center space-x-3">
            <button onClick={handlePlay} disabled={isPlaying} className="bg-black text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              <PlayIcon />
              <span className="text-sm font-semibold">{isPlaying ? 'Playing...' : 'PLAY'}</span>
            </button>
            <button className="text-slate-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200">
              <DownloadIcon />
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
      </div>
      <div className="px-6 py-3 bg-white flex justify-center items-center border-t border-gray-300">
        <p className="text-xs text-slate-600">Powered by Eleven v3 (alpha)</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-200 via-purple-100 to-transparent opacity-30 blur-2xl pointer-events-none"></div>
      <audio ref={audioRef} onEnded={onEnded} onError={() => {
        setError('Error playing audio file.');
        setIsPlaying(false);
      }} />
    </div>
  );
};


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Text to Speech');
  const tabs: string[] = ['Text to Speech', 'Agents', 'Music', 'Speech to Text', 'Dubbing', 'Voice Cloning', 'ElevenReader'];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter">PanelVoices</div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black">Creative Platform</a>
            <a href="#" className="hover:text-black">Agents Platform</a>
            <a href="#" className="hover:text-black">Developers</a>
            <a href="#" className="hover:text-black">Resources</a>
            <a href="#" className="hover:text-black">Enterprise</a>
            <a href="#" className="hover:text-black">Pricing</a>
          </nav>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200">Log In</button>
            <button className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800">Sign Up</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          The most realistic voice AI platform
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
          AI voice models and products powering millions of developers, creators, and enterprises. From low-latency conversational agents to the leading AI voice generator for voiceovers and audiobooks.
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <button className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800">SIGN UP</button>
          <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-200">CONTACT SALES</button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors focus:outline-none ${activeTab === tab
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full">
          {activeTab === 'Text to Speech' ? <TextToSpeechTab /> : <div className="p-12 bg-white rounded-lg shadow-lg"><p>Content for {activeTab}</p></div>}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold">EXPERIENCE THE FULL AUDIO AI PLATFORM</h2>
          <button className="mt-4 bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800">SIGN UP</button>
        </div>
      </main>
    </div>
  );
}

