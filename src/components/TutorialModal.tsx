
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Terminal, Book, Info, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: React.ReactNode;
  commands: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Introduction to the Terminal",
    content: (
      <>
        <p>Welcome to the Linux command line!</p>
        <p className="mt-2">The terminal is a powerful tool that allows you to interact with your computer using text commands. Unlike graphical interfaces, the terminal gives you direct access to your system's functions.</p>
        <p className="mt-2">In this tutorial, we'll learn the basics of navigating and using the Linux terminal.</p>
      </>
    ),
    commands: []
  },
  {
    title: "Basic Navigation",
    content: (
      <>
        <p>Let's start with some basic navigation commands:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><code className="bg-gray-800 px-1 rounded">pwd</code> - Print Working Directory: Shows your current location</li>
          <li><code className="bg-gray-800 px-1 rounded">ls</code> - List: Shows files and folders in current directory</li>
          <li><code className="bg-gray-800 px-1 rounded">cd [directory]</code> - Change Directory: Navigate to another directory</li>
          <li><code className="bg-gray-800 px-1 rounded">cd ..</code> - Go up one level in the directory structure</li>
        </ul>
        <p className="mt-2">Try these commands in the terminal!</p>
      </>
    ),
    commands: ['pwd', 'ls', 'cd Documents', 'ls', 'cd ..']
  },
  {
    title: "Working with Files and Directories",
    content: (
      <>
        <p>Now let's learn about managing files and directories:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><code className="bg-gray-800 px-1 rounded">mkdir [name]</code> - Make Directory: Create a new folder</li>
          <li><code className="bg-gray-800 px-1 rounded">touch [name]</code> - Create a new empty file</li>
          <li><code className="bg-gray-800 px-1 rounded">rm [file]</code> - Remove a file</li>
          <li><code className="bg-gray-800 px-1 rounded">rm -r [directory]</code> - Remove a directory and its contents</li>
        </ul>
        <p className="mt-2">Let's create a directory and some files!</p>
      </>
    ),
    commands: ['mkdir projects', 'cd projects', 'touch readme.txt', 'ls', 'cd ..']
  },
  {
    title: "Viewing and Editing File Content",
    content: (
      <>
        <p>Linux provides several ways to view and manipulate file contents:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><code className="bg-gray-800 px-1 rounded">cat [file]</code> - Display file contents</li>
          <li><code className="bg-gray-800 px-1 rounded">echo [text] &gt; [file]</code> - Write text to a file (overwrite)</li>
          <li><code className="bg-gray-800 px-1 rounded">echo [text] &gt;&gt; [file]</code> - Append text to a file</li>
          <li><code className="bg-gray-800 px-1 rounded">head [-n X] [file]</code> - Show first X lines of a file</li>
          <li><code className="bg-gray-800 px-1 rounded">tail [-n X] [file]</code> - Show last X lines of a file</li>
        </ul>
        <p className="mt-2">Let's create and view file content:</p>
      </>
    ),
    commands: ['cd projects', 'echo "Hello Linux World" > readme.txt', 'cat readme.txt', 'echo "This is a new line" >> readme.txt', 'cat readme.txt']
  },
  {
    title: "Searching and Finding",
    content: (
      <>
        <p>Finding information in Linux is easy with these commands:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><code className="bg-gray-800 px-1 rounded">grep [pattern] [file]</code> - Search for patterns in files</li>
          <li><code className="bg-gray-800 px-1 rounded">find [path] -name [pattern]</code> - Search for files by name</li>
        </ul>
        <p className="mt-2">Let's try searching for some content:</p>
      </>
    ),
    commands: ['cd ~', 'cat tutorial.txt', 'grep "directory" tutorial.txt', 'find . -name "*.txt"']
  },
  {
    title: "System Information",
    content: (
      <>
        <p>Learn about your system with these commands:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><code className="bg-gray-800 px-1 rounded">whoami</code> - Display your username</li>
          <li><code className="bg-gray-800 px-1 rounded">date</code> - Show the current date and time</li>
          <li><code className="bg-gray-800 px-1 rounded">uname -a</code> - Display system information</li>
          <li><code className="bg-gray-800 px-1 rounded">history</code> - Show command history</li>
        </ul>
        <p className="mt-2">Try these commands to learn about your system.</p>
      </>
    ),
    commands: ['whoami', 'date', 'uname -a', 'history']
  },
  {
    title: "What's Next?",
    content: (
      <>
        <p>Congratulations on completing the introduction to Linux commands!</p>
        <p className="mt-2">This is just the beginning of your Linux journey. Continue exploring the following topics:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>File permissions and ownership (chmod, chown)</li>
          <li>Text editors (vim, nano)</li>
          <li>Process management (ps, top, kill)</li>
          <li>Package installation (apt, yum)</li>
          <li>Shell scripting</li>
        </ul>
        <p className="mt-2">Keep practicing the commands you've learned in the terminal.</p>
      </>
    ),
    commands: []
  }
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentTutorial = tutorialSteps[currentStep];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-3xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-ubuntu-orange">
            <Book size={22} />
            <DialogTitle className="text-2xl">
              {currentTutorial.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 flex items-center gap-2">
            <div className="flex items-center justify-center bg-ubuntu-orange/20 px-2.5 py-0.5 rounded-full text-ubuntu-orange">
              {currentStep + 1} of {tutorialSteps.length}
            </div>
            <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-ubuntu-orange rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-gray-100">
            {currentTutorial.content}
          </div>
          
          {currentTutorial.commands.length > 0 && (
            <div className="mt-4 p-4 bg-gray-800/70 rounded-md border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-ubuntu-orange">
                <Terminal size={18} />
                <h4 className="font-medium">Try these commands:</h4>
              </div>
              <div className="mt-3 space-y-2 font-mono">
                {currentTutorial.commands.map((cmd, index) => (
                  <code key={index} className="block p-2 bg-gray-900/90 border border-white/5 rounded">{cmd}</code>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-ubuntu-orange/20 border border-ubuntu-orange/30 rounded-md p-3 flex items-start gap-3">
            <Info size={20} className="text-ubuntu-orange mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-200">
              <strong className="block mb-1 text-ubuntu-orange">Pro Tip:</strong>
              {currentStep === 0 && "The terminal is case-sensitive. Commands like 'LS' or 'PWD' won't work - you must use lowercase 'ls' and 'pwd'."}
              {currentStep === 1 && "Use the Tab key to autocomplete commands and file names. It saves time and prevents typos!"}
              {currentStep === 2 && "Be careful with the rm command - files deleted this way cannot be recovered from a trash bin."}
              {currentStep === 3 && "The '>' symbol redirects output to a file (overwriting it), while '>>' appends to a file."}
              {currentStep === 4 && "The grep command supports regular expressions for more powerful pattern matching."}
              {currentStep === 5 && "Press the up arrow key to cycle through previously used commands."}
              {currentStep === 6 && "Create a file called '.bashrc' in your home directory to customize your terminal environment."}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-ubuntu-orange hover:bg-ubuntu-orange/90 gap-2"
          >
            {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
            {currentStep < tutorialSteps.length - 1 ? <ArrowRight size={16} /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
