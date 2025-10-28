
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Search, X } from 'lucide-react';

interface Command {
  name: string;
  syntax: string;
  description: string;
  example: string;
  category: string;
}

const commandsList: Command[] = [
  {
    name: 'help',
    syntax: 'help',
    description: 'Display available commands',
    example: 'help',
    category: 'General'
  },
  {
    name: 'ls',
    syntax: 'ls [options] [directory]',
    description: 'List directory contents',
    example: 'ls -la',
    category: 'Files & Directories'
  },
  {
    name: 'pwd',
    syntax: 'pwd',
    description: 'Print working directory',
    example: 'pwd',
    category: 'Files & Directories'
  },
  {
    name: 'cd',
    syntax: 'cd [directory]',
    description: 'Change directory',
    example: 'cd Documents',
    category: 'Files & Directories'
  },
  {
    name: 'mkdir',
    syntax: 'mkdir [options] directory',
    description: 'Create a new directory',
    example: 'mkdir new_folder',
    category: 'Files & Directories'
  },
  {
    name: 'touch',
    syntax: 'touch [file]',
    description: 'Create a new empty file',
    example: 'touch myfile.txt',
    category: 'Files & Directories'
  },
  {
    name: 'rm',
    syntax: 'rm [options] file',
    description: 'Remove files or directories',
    example: 'rm -r folder/',
    category: 'Files & Directories'
  },
  {
    name: 'cp',
    syntax: 'cp [options] source destination',
    description: 'Copy files and directories',
    example: 'cp file.txt backup/',
    category: 'Files & Directories'
  },
  {
    name: 'mv',
    syntax: 'mv [options] source destination',
    description: 'Move/rename files and directories',
    example: 'mv file.txt newname.txt',
    category: 'Files & Directories'
  },
  {
    name: 'cat',
    syntax: 'cat [options] file',
    description: 'Concatenate and display file contents',
    example: 'cat file.txt',
    category: 'File Content'
  },
  {
    name: 'grep',
    syntax: 'grep [pattern] [file]',
    description: 'Search for patterns in files',
    example: 'grep "hello" file.txt',
    category: 'File Content'
  },
  {
    name: 'head',
    syntax: 'head [-n lines] [file]',
    description: 'Output the first part of files',
    example: 'head -n 5 file.txt',
    category: 'File Content'
  },
  {
    name: 'tail',
    syntax: 'tail [-n lines] [file]',
    description: 'Output the last part of files',
    example: 'tail -n 5 file.txt',
    category: 'File Content'
  },
  {
    name: 'echo',
    syntax: 'echo [string]',
    description: 'Display a line of text',
    example: 'echo Hello World',
    category: 'File Content'
  },
  {
    name: 'find',
    syntax: 'find [path] -name [pattern]',
    description: 'Search for files by name',
    example: 'find . -name "*.txt"',
    category: 'Search'
  },
  {
    name: 'whoami',
    syntax: 'whoami',
    description: 'Print current user name',
    example: 'whoami',
    category: 'User Info'
  },
  {
    name: 'date',
    syntax: 'date [options]',
    description: 'Display or set date and time',
    example: 'date',
    category: 'System'
  },
  {
    name: 'uname',
    syntax: 'uname [-a]',
    description: 'Print system information',
    example: 'uname -a',
    category: 'System'
  },
  {
    name: 'history',
    syntax: 'history',
    description: 'Show command history',
    example: 'history',
    category: 'General'
  },
  {
    name: 'clear',
    syntax: 'clear',
    description: 'Clear the terminal screen',
    example: 'clear',
    category: 'General'
  },
  {
    name: 'tutorial',
    syntax: 'tutorial',
    description: 'Start the Linux basics tutorial',
    example: 'tutorial',
    category: 'Learning'
  },
  {
    name: 'next-lesson',
    syntax: 'next-lesson',
    description: 'Continue to the next tutorial lesson',
    example: 'next-lesson',
    category: 'Learning'
  }
];

interface CommandSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const CommandSidebar = ({ isOpen, toggleSidebar }: CommandSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = Array.from(new Set(commandsList.map(cmd => cmd.category)));
  
  // Filter commands by search query and selected category
  const filteredCommands = commandsList.filter(command => {
    const matchesSearch = command.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         command.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || command.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className={`fixed top-0 right-0 h-screen bg-gray-900 transition-all duration-300 ease-in-out flex z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Toggle button (visible on mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-ubuntu-orange text-white p-2 rounded-l-md shadow-lg"
        aria-label={isOpen ? "Close command reference" : "Open command reference"}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      {/* Sidebar content */}
      <div className={`w-80 h-full flex flex-col bg-gray-800/95 backdrop-blur-md text-white border-l border-white/10 overflow-hidden shadow-2xl`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-ubuntu-orange flex items-center gap-2">
            Command Reference
          </h2>
          <Button 
            onClick={toggleSidebar} 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700/50 border-gray-600 text-white pl-10 focus-visible:ring-ubuntu-orange"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex overflow-x-auto p-2 bg-gray-800/70 space-x-2 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap ${selectedCategory === null ? 'bg-ubuntu-orange text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${selectedCategory === category ? 'bg-ubuntu-orange text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Commands list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="text-center text-gray-400 mt-8 p-4 border border-dashed border-gray-700 rounded-md">
              No commands found matching '{searchQuery}'
            </div>
          ) : (
            filteredCommands.map(command => (
              <div key={command.name} className="p-3 bg-gray-700/50 rounded-md border border-white/5 hover:border-white/20 transition-all">
                <h3 className="text-ubuntu-orange font-bold flex items-center gap-2">
                  {command.name}
                  <span className="text-xs px-2 py-0.5 bg-gray-600 text-gray-300 rounded-full">{command.category}</span>
                </h3>
                <div className="text-gray-300 text-sm mt-2 space-y-1.5">
                  <p><span className="text-gray-400">Syntax:</span> <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono">{command.syntax}</code></p>
                  <p><span className="text-gray-400">Description:</span> {command.description}</p>
                  <p><span className="text-gray-400">Example:</span> <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono">{command.example}</code></p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandSidebar;
