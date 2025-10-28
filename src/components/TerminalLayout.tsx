
import React, { useState } from 'react';
import Terminal from './Terminal';
import CommandSidebar from './CommandSidebar';
import TutorialModal from './TutorialModal';
import NetworkGuide from './NetworkGuide';
import { Button } from '@/components/ui/button';
import { X, Menu, Book, HelpCircle, Server, Globe, Wifi, ServerCog, Network } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

const TerminalLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isNetworkGuideOpen, setIsNetworkGuideOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header/Toolbar */}
      <header className="bg-zinc-800 shadow-md">
        <div className="container mx-auto py-2 md:py-4 px-2 md:px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-lg">$_</span>
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">Ubuntu Terminal</h1>
          </div>
          <div className="flex space-x-1 md:space-x-3">
            <Button 
              onClick={() => setIsNetworkGuideOpen(true)}
              variant="ghost" 
              size={isMobile ? "sm" : "default"}
              className="text-white hover:bg-white/10 flex items-center gap-1 md:gap-2"
            >
              <Network size={isMobile ? 16 : 18} className="text-teal-400" />
              <span className="hidden sm:inline">Network Guide</span>
            </Button>
            <Button 
              onClick={() => setIsTutorialOpen(true)}
              variant="ghost" 
              size={isMobile ? "sm" : "default"}
              className="text-white hover:bg-white/10 flex items-center gap-1 md:gap-2"
            >
              <Book size={isMobile ? 16 : 18} />
              <span className="hidden sm:inline">Tutorial</span>
            </Button>
            <Button 
              onClick={toggleSidebar}
              variant="ghost" 
              size={isMobile ? "sm" : "default"}
              className="text-white hover:bg-white/10 flex items-center gap-1 md:gap-2"
            >
              {isSidebarOpen ? <X size={isMobile ? 16 : 18} /> : <Menu size={isMobile ? 16 : 18} />}
              <span className="hidden sm:inline">
                {isSidebarOpen ? 'Hide' : 'Commands'}
              </span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto my-3 md:my-6 px-2 md:px-4 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          {/* Feature cards - responsive grid */}
          <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10 shadow-lg flex items-center">
              <Wifi size={isMobile ? 18 : 24} className="text-teal-400 mr-2 md:mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-white font-medium text-sm md:text-base">Networking</h3>
                <p className="text-gray-300 text-xs md:text-sm truncate">ip, ping, ifconfig</p>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10 shadow-lg flex items-center">
              <ServerCog size={isMobile ? 18 : 24} className="text-teal-400 mr-2 md:mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-white font-medium text-sm md:text-base">System</h3>
                <p className="text-gray-300 text-xs md:text-sm truncate">ls, cd, mkdir, cat</p>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10 shadow-lg flex items-center sm:col-span-2 md:col-span-1">
              <Globe size={isMobile ? 18 : 24} className="text-teal-400 mr-2 md:mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-white font-medium text-sm md:text-base">Web Tools</h3>
                <p className="text-gray-300 text-xs md:text-sm truncate">curl, wget, traceroute</p>
              </div>
            </div>
          </div>
          
          {/* Quick start box */}
          <div className="mb-3 md:mb-4 bg-gray-800/50 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10 shadow-lg">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle size={isMobile ? 16 : 20} className="text-teal-400" />
              Quick Start
            </h2>
            <p className="text-gray-300 mt-1 md:mt-2 text-sm md:text-base">
              Start exploring Linux commands! Type <code className="bg-gray-700 px-1 rounded">help</code> to see available commands or <code className="bg-gray-700 px-1 rounded">tutorial</code> to begin learning.
            </p>
          </div>
          
          {/* Terminal window - adjust height based on screen size */}
          <div className="w-full shadow-2xl">
            <Terminal showHints={true} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-zinc-800 text-white py-3 md:py-4 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-gray-400">
            Ubuntu Terminal Simulator - Educational Tool<br />
            <span className="text-xs">Not affiliated with Canonical Ltd.</span>
          </p>
        </div>
      </footer>
      
      {/* Sidebar */}
      <CommandSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Tutorial Modal - adjust for different screen sizes */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      
      {/* Network Guide Dialog - improve responsive design */}
      <Dialog open={isNetworkGuideOpen} onOpenChange={setIsNetworkGuideOpen}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-6xl bg-gray-900 text-white border border-gray-700 p-0 dialog-scrollable">
          <NetworkGuide />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TerminalLayout;
