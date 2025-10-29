
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { FileSystem } from '@/utils/fileSystem';

// Command processor functions
const processCommand = (command: string, fileSystem: FileSystem): {output: string, isError: boolean} => {
  const parts = command.trim().split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  // Basic commands
  switch (cmd) {
    case 'help':
      return { 
        output: 'Available commands:\n' +
                '\n-- File System Commands --\n' +
                'ls [-l]: List directory contents\n' +
                'pwd: Print working directory\n' +
                'cd [directory]: Change directory\n' +
                'mkdir [directory]: Create a directory\n' +
                'touch [file]: Create a file\n' +
                'cat [file]: Display file contents\n' +
                'rm [-r] [file/directory]: Remove file or directory\n' +
                'find [path] -name [pattern]: Search for files by name\n' +
                'head [-n X] [file]: Output the first part of files\n' +
                'tail [-n X] [file]: Output the last part of files\n' +
                'grep [pattern] [file]: Search for patterns in files\n' +
                'echo [text]: Display text\n' +
                '\n-- Network Commands --\n' +
                'ifconfig: Display network interfaces\n' +
                'ip [addr|route]: Show network interfaces or routing table\n' +
                'ping [host]: Test network connectivity\n' +
                'netstat: Network statistics\n' +
                'traceroute [host]: Trace route to host\n' +
                'nslookup [domain]: Query DNS records\n' +
                'dig [domain]: Advanced DNS lookup\n' +
                'tcpdump: Capture network packets\n' +
                'ss: Socket statistics\n' +
                'curl [url]: Transfer data from/to a server\n' +
                'wget [url]: Download files from the web\n' +
                '\n-- System Commands --\n' +
                'uname [-a]: Print system information\n' +
                'whoami: Display current user\n' +
                'date: Display current date and time\n' +
                'history: Show command history\n' +
                'clear: Clear the terminal\n' +
                '\n-- Tutorial --\n' +
                'tutorial: Start the Linux basics tutorial\n' +
                'network-tutorial: Learn network commands\n',
        isError: false 
      };
    case 'clear':
      return { output: 'CLEAR', isError: false };
    case 'ls':
      const showDetails = args.includes('-l');
      return { 
        output: fileSystem.listContents(showDetails), 
        isError: false 
      };
    case 'pwd':
      return { output: fileSystem.currentPath, isError: false };
    case 'cd':
      if (args.length === 0) {
        fileSystem.navigateToHome();
        return { output: '', isError: false };
      }
      
      try {
        fileSystem.changeDirectory(args[0]);
        return { output: '', isError: false };
      } catch (error) {
        return { output: `cd: ${args[0]}: No such directory`, isError: true };
      }
    case 'mkdir':
      if (args.length === 0) {
        return { output: 'mkdir: missing operand', isError: true };
      }
      
      try {
        fileSystem.makeDirectory(args[0]);
        return { output: '', isError: false };
      } catch (error) {
        if (error instanceof Error) {
          return { output: `mkdir: ${error.message}`, isError: true };
        }
        return { output: 'mkdir: error creating directory', isError: true };
      }
    case 'touch':
      if (args.length === 0) {
        return { output: 'touch: missing operand', isError: true };
      }
      
      try {
        fileSystem.createFile(args[0]);
        return { output: '', isError: false };
      } catch (error) {
        if (error instanceof Error) {
          return { output: `touch: ${error.message}`, isError: true };
        }
        return { output: 'touch: error creating file', isError: true };
      }
    case 'cat':
      if (args.length === 0) {
        return { output: 'cat: missing operand', isError: true };
      }
      
      try {
        const content = fileSystem.getFileContent(args[0]);
        return { output: content, isError: false };
      } catch (error) {
        if (error instanceof Error) {
          return { output: `cat: ${args[0]}: ${error.message}`, isError: true };
        }
        return { output: `cat: ${args[0]}: No such file or directory`, isError: true };
      }
    case 'rm':
      if (args.length === 0) {
        return { output: 'rm: missing operand', isError: true };
      }
      
      const recursive = args[0] === '-r';
      const target = recursive ? args[1] : args[0];
      
      if (!target) {
        return { output: 'rm: missing operand', isError: true };
      }
      
      try {
        fileSystem.remove(target, recursive);
        return { output: '', isError: false };
      } catch (error) {
        if (error instanceof Error) {
          return { output: `rm: ${error.message}`, isError: true };
        }
        return { output: `rm: cannot remove '${target}'`, isError: true };
      }
    case 'whoami':
      return { output: 'user', isError: false };
    case 'date':
      return { 
        output: new Date().toLocaleString(), 
        isError: false 
      };
    case 'uname':
      if (args.includes('-a')) {
        return { 
          output: 'Linux simulator 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 GNU/Linux', 
          isError: false 
        };
      }
      return { output: 'Linux', isError: false };
    case 'grep':
      if (args.length < 2) {
        return { output: 'grep: missing operand', isError: true };
      }
      
      try {
        const pattern = args[0];
        const fileName = args[1];
        const content = fileSystem.getFileContent(fileName);
        const lines = content.split('\n');
        const matches = lines.filter(line => line.includes(pattern));
        
        if (matches.length === 0) {
          return { output: '', isError: false };
        }
        
        return { output: matches.join('\n'), isError: false };
      } catch (error) {
        return { output: `grep: ${args[1]}: No such file or directory`, isError: true };
      }
    case 'head':
      let lineCount = 10;
      let fileIndex = 0;
      
      if (args[0] === '-n' && args.length >= 2) {
        lineCount = parseInt(args[1]) || 10;
        fileIndex = 2;
      }
      
      if (fileIndex >= args.length) {
        return { output: 'head: missing operand', isError: true };
      }
      
      try {
        const content = fileSystem.getFileContent(args[fileIndex]);
        const lines = content.split('\n').slice(0, lineCount);
        
        return { output: lines.join('\n'), isError: false };
      } catch (error) {
        return { output: `head: ${args[fileIndex]}: No such file or directory`, isError: true };
      }
    case 'tail':
      let tailLineCount = 10;
      let tailFileIndex = 0;
      
      if (args[0] === '-n' && args.length >= 2) {
        tailLineCount = parseInt(args[1]) || 10;
        tailFileIndex = 2;
      }
      
      if (tailFileIndex >= args.length) {
        return { output: 'tail: missing operand', isError: true };
      }
      
      try {
        const content = fileSystem.getFileContent(args[tailFileIndex]);
        const lines = content.split('\n');
        const startIndex = Math.max(0, lines.length - tailLineCount);
        const selectedLines = lines.slice(startIndex);
        
        return { output: selectedLines.join('\n'), isError: false };
      } catch (error) {
        return { output: `tail: ${args[tailFileIndex]}: No such file or directory`, isError: true };
      }
    case 'history':
      // This will be populated by the Terminal component
      return { output: 'HISTORY', isError: false };
    case 'find':
      if (args.length < 3 || args[1] !== '-name') {
        return { output: 'find: missing arguments\nUsage: find [path] -name [pattern]', isError: true };
      }
      
      try {
        const path = args[0];
        const pattern = args[2];
        const results = fileSystem.findFiles(path, pattern);
        
        if (results.length === 0) {
          return { output: '', isError: false };
        }
        
        return { output: results.join('\n'), isError: false };
      } catch (error) {
        return { output: `find: '${args[0]}': No such directory`, isError: true };
      }
    case '':
      return { output: '', isError: false };
    case 'tutorial':
      return { 
        output: 'Starting Linux Basics Tutorial...\n\n' +
                'Welcome to the Linux command line!\n\n' +
                'In this tutorial, you will learn the basics of navigating and using the Linux terminal.\n' +
                'Let\'s start with some basic commands:\n\n' +
                '1. Type "pwd" to see your current directory\n' +
                '2. Type "ls" to list files in your current directory\n' +
                '3. Type "cd Documents" to change to the Documents directory\n' +
                '4. Type "mkdir test" to create a new directory called "test"\n\n' +
                'Try these commands now, then type "next-lesson" when you\'re ready to continue.',
        isError: false 
      };
    case 'network-tutorial':
      return { 
        output: 'Starting Network Commands Tutorial...\n\n' +
                'Linux provides powerful tools for network management and diagnosis.\n\n' +
                'Let\'s start with basic network commands:\n\n' +
                '1. Type "ifconfig" to see network interface details\n' +
                '2. Type "ip addr" to see IP addresses (modern alternative)\n' +
                '3. Type "ping google.com" to test connectivity\n' +
                '4. Type "ip route" to view the routing table\n\n' +
                'Try these commands now!',
        isError: false 
      };
    case 'next-lesson':
      return {
        output: 'Great job! You\'ve completed the first part of the tutorial.\n\n' +
               'In the next lesson, we\'ll learn about working with files:\n\n' +
               '1. Type "touch myfile.txt" to create a new file\n' +
               '2. Type "echo Hello > myfile.txt" to write to the file\n' +
               '3. Type "cat myfile.txt" to view the file content\n\n' +
               'Try these commands now!',
        isError: false
      };
    case 'echo':
      // Check if command includes redirection
      const fullCommand = command.trim();
      if (fullCommand.includes('>')) {
        const [echoCmd, filePath] = fullCommand.split('>').map(part => part.trim());
        const content = echoCmd.substring(5); // Remove 'echo ' from start
        
        try {
          fileSystem.writeToFile(filePath, content);
          return { output: '', isError: false };
        } catch (error) {
          return { output: `echo: ${error instanceof Error ? error.message : 'Error writing to file'}`, isError: true };
        }
      }
      
      // Regular echo command
      return { 
        output: args.join(' '), 
        isError: false 
      };

    // Network commands
    case 'ifconfig':
      return { 
        output: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n' +
                '        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n' +
                '        inet6 fe80::215:5dff:fe7c:41b2  prefixlen 64  scopeid 0x20<link>\n' +
                '        ether 00:15:5d:7c:41:b2  txqueuelen 1000  (Ethernet)\n' +
                '        RX packets 12345  bytes 1234567 (1.2 MB)\n' +
                '        RX errors 0  dropped 0  overruns 0  frame 0\n' +
                '        TX packets 34567  bytes 3456789 (3.4 MB)\n' +
                '        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0\n\n' +
                'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n' +
                '        inet 127.0.0.1  netmask 255.0.0.0\n' +
                '        inet6 ::1  prefixlen 128  scopeid 0x10<host>\n' +
                '        loop  txqueuelen 1000  (Local Loopback)\n' +
                '        RX packets 908  bytes 102944 (102.9 KB)\n' +
                '        RX errors 0  dropped 0  overruns 0  frame 0\n' +
                '        TX packets 908  bytes 102944 (102.9 KB)\n' +
                '        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0',
        isError: false
      };
    case 'ip':
      if (args.length === 0 || args[0] === 'addr') {
        return { 
          output: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n' +
                  '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n' +
                  '    inet 127.0.0.1/8 scope host lo\n' +
                  '       valid_lft forever preferred_lft forever\n' +
                  '    inet6 ::1/128 scope host \n' +
                  '       valid_lft forever preferred_lft forever\n' +
                  '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n' +
                  '    link/ether 00:15:5d:7c:41:b2 brd ff:ff:ff:ff:ff:ff\n' +
                  '    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic noprefixroute eth0\n' +
                  '       valid_lft 86393sec preferred_lft 86393sec\n' +
                  '    inet6 fe80::215:5dff:fe7c:41b2/64 scope link noprefixroute \n' +
                  '       valid_lft forever preferred_lft forever',
          isError: false 
        };
      } else if (args[0] === 'route') {
        return { 
          output: 'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.100 metric 100 \n' +
                  '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100',
          isError: false 
        };
      } else {
        return { 
          output: 'Usage: ip [options] COMMAND\n' +
                  'Common commands: ip addr, ip route',
          isError: true 
        };
      }
    case 'ping':
      if (args.length === 0) {
        return { output: 'ping: usage error: Destination address required', isError: true };
      }
      
      const host = args[0];
      return { 
        output: `PING ${host} (142.250.185.78) 56(84) bytes of data.\n` +
                `64 bytes from ${host} icmp_seq=1 ttl=116 time=8.52 ms\n` +
                `64 bytes from ${host} icmp_seq=2 ttl=116 time=10.1 ms\n` +
                `64 bytes from ${host} icmp_seq=3 ttl=116 time=9.87 ms\n` +
                `64 bytes from ${host} icmp_seq=4 ttl=116 time=7.99 ms\n\n` +
                `--- ${host} ping statistics ---\n` +
                '4 packets transmitted, 4 received, 0% packet loss, time 3005ms\n' +
                'rtt min/avg/max/mdev = 7.993/9.123/10.101/0.896 ms',
        isError: false 
      };
    case 'netstat':
      return { 
        output: 'Active Internet connections (w/o servers)\n' +
                'Proto Recv-Q Send-Q Local Address           Foreign Address         State      \n' +
                'tcp        0      0 192.168.1.100:42642     142.250.185.78:https    ESTABLISHED\n' +
                'tcp        0      0 192.168.1.100:58672     151.101.1.69:https      TIME_WAIT  \n' +
                'tcp        0    372 192.168.1.100:22        192.168.1.5:49721       ESTABLISHED\n' +
                '\n' +
                'Active UNIX domain sockets (w/o servers)\n' +
                'Proto RefCnt Flags       Type       State         I-Node   Path\n' +
                'unix  3      [ ]         STREAM     CONNECTED     28996    /run/user/1000/bus\n' +
                'unix  3      [ ]         STREAM     CONNECTED     29040    /run/dbus/system_bus_socket',
        isError: false 
      };
    case 'traceroute':
      if (args.length === 0) {
        return { output: 'traceroute: missing host operand', isError: true };
      }
      
      const traceHost = args[0];
      return { 
        output: `traceroute to ${traceHost} (142.250.185.78), 30 hops max, 60 byte packets\n` +
                ' 1  _gateway (192.168.1.1)  3.171 ms  4.634 ms  6.285 ms\n' +
                ' 2  10.10.124.254 (10.10.124.254)  10.246 ms  14.320 ms  14.591 ms\n' +
                ' 3  10.11.12.13 (10.11.12.13)  15.576 ms  16.496 ms  17.426 ms\n' +
                ' 4  172.16.24.1 (172.16.24.1)  20.441 ms  20.913 ms  20.883 ms\n' +
                ' 5  72.14.204.94 (72.14.204.94)  23.941 ms  19.170 ms  20.331 ms\n' +
                ' 6  142.251.51.187 (142.251.51.187)  21.826 ms  21.000 ms  21.512 ms\n' +
                ' 7  142.250.210.45 (142.250.210.45)  23.573 ms  22.870 ms  23.322 ms\n' +
                ' 8  142.250.185.78 (142.250.185.78)  24.287 ms  25.236 ms  26.592 ms',
        isError: false 
      };
    case 'nslookup':
      if (args.length === 0) {
        return { output: 'nslookup: missing host', isError: true };
      }
      
      const lookupDomain = args[0];
      return { 
        output: `Server:   8.8.8.8\n` +
                `Address:  8.8.8.8#53\n\n` +
                `Non-authoritative answer:\n` +
                `Name: ${lookupDomain}\n` +
                `Address: 142.250.185.78`,
        isError: false 
      };
    case 'dig':
      if (args.length === 0) {
        return { output: 'dig: missing domain', isError: true };
      }
      
      const digDomain = args[0];
      return { 
        output: `; <<>> DiG 9.16.1-Ubuntu <<>> ${digDomain}\n` +
                `;; global options: +cmd\n` +
                `;; Got answer:\n` +
                `;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 61168\n` +
                `;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n` +
                `;; OPT PSEUDOSECTION:\n` +
                `; EDNS: version: 0, flags:; udp: 65494\n` +
                `;; QUESTION SECTION:\n` +
                `;${digDomain}.     IN    A\n\n` +
                `;; ANSWER SECTION:\n` +
                `${digDomain}.    299    IN    A    142.250.185.78`,
        isError: false 
      };
    case 'curl':
      if (args.length === 0) {
        return { output: 'curl: no URL specified', isError: true };
      }
      
      const url = args[0];
      return { 
        output: `<!DOCTYPE html>\n` +
                `<html>\n` +
                `<head>\n` +
                `  <title>Example Website</title>\n` +
                `</head>\n` +
                `<body>\n` +
                `  <h1>Welcome to ${url}</h1>\n` +
                `  <p>This is a simulated response for the curl command.</p>\n` +
                `</body>\n` +
                `</html>`,
        isError: false 
      };
    case 'wget':
      if (args.length === 0) {
        return { output: 'wget: missing URL', isError: true };
      }
      
      const wgetUrl = args[0];
      return { 
        output: `--2025-04-29 12:34:56--  http://${wgetUrl}/\n` +
                `Resolving ${wgetUrl}... 142.250.185.78\n` +
                `Connecting to ${wgetUrl}|142.250.185.78|:80... connected.\n` +
                `HTTP request sent, awaiting response... 200 OK\n` +
                `Length: 9876 (9.6K) [text/html]\n` +
                `Saving to: 'index.html'\n\n` +
                `index.html          100%[===================>]   9.64K  --.-KB/s    in 0.1s\n\n` +
                `2025-04-29 12:34:56 (96.4 KB/s) - 'index.html' saved [9876/9876]`,
        isError: false 
      };
    case 'tcpdump':
      return { 
        output: `tcpdump: verbose output suppressed, use -v for full protocol decode\n` +
                `listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes\n` +
                `12:34:56.789012 IP 192.168.1.100.59102 > dns.google.domain: 12345+ A? example.com. (32)\n` +
                `12:34:56.901234 IP dns.google.domain > 192.168.1.100.59102: 12345 1/0/0 A 93.184.216.34 (48)\n` +
                `12:34:57.123456 IP 192.168.1.100.58642 > 93.184.216.34.https: Flags [S], seq 1957802377, win 65535, length 0\n` +
                `12:34:57.234567 IP 93.184.216.34.https > 192.168.1.100.58642: Flags [S.], seq 1090693991, ack 1957802378, win 65535, length 0`,
        isError: false 
      };
    case 'ss':
      return { 
        output: `Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process\n` +
                `tcp    ESTAB   0       0      192.168.1.100:58642  93.184.216.34:https\n` +
                `tcp    ESTAB   0       0      192.168.1.100:22     192.168.1.5:49721\n` +
                `udp    UNCONN  0       0      127.0.0.53:domain    0.0.0.0:*\n` +
                `udp    UNCONN  0       0      0.0.0.0:bootpc       0.0.0.0:*`,
        isError: false 
      };
    default:
      // Unknown command
      return { 
        output: `Command not found: ${cmd}. Type 'help' to see available commands.`, 
        isError: true 
      };
  }
};

// Command history functionality
type HistoryNavigation = {
  commands: string[];
  currentIndex: number;
};

// Command autocomplete suggestions
const getAutocompleteSuggestions = (partial: string): string[] => {
  const commands = [
    'help', 'clear', 'echo', 'ls', 'pwd', 'cd', 'mkdir', 'touch', 
    'cat', 'rm', 'whoami', 'date', 'grep', 'head', 'tail',
    'find', 'uname', 'history', 'tutorial', 'network-tutorial', 'next-lesson',
    'ifconfig', 'ip', 'ping', 'netstat', 'traceroute', 'nslookup', 'dig',
    'curl', 'wget', 'tcpdump', 'ss'
  ];
  
  if (!partial) return [];
  
  return commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));
};

interface TerminalProps {
  showHints?: boolean;
}

const Terminal = ({ showHints = true }: TerminalProps) => {
  const [commandHistory, setCommandHistory] = useState<{command: string, output: string, isError: boolean}[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [history, setHistory] = useState<HistoryNavigation>({ commands: [], currentIndex: -1 });
  const [fileSystem] = useState(new FileSystem());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Handle command execution
  const executeCommand = () => {
    if (!currentCommand.trim()) return;
    
    // Special case for history command
    if (currentCommand.trim().toLowerCase() === 'history') {
      setCommandHistory(prev => [
        ...prev,
        {
          command: currentCommand,
          output: history.commands.map((cmd, idx) => `${idx + 1}  ${cmd}`).join('\n'),
          isError: false
        }
      ]);
    } else {
      const result = processCommand(currentCommand, fileSystem);
      
      // Special case for clear command
      if (result.output === 'CLEAR') {
        setCommandHistory([]);
      } else {
        setCommandHistory(prev => [
          ...prev, 
          {
            command: currentCommand,
            output: result.output,
            isError: result.isError
          }
        ]);
      }
    }
    
    // Add to history navigation
    setHistory(prev => ({
      commands: [...prev.commands, currentCommand],
      currentIndex: -1
    }));
    
    // Show hint for error commands if hints are enabled
    if (processCommand(currentCommand, fileSystem).isError && showHints) {
      toast({
        title: "Command not found",
        description: `Try 'help' to see available commands`,
        variant: "destructive"
      });
    }
    
    setCurrentCommand('');
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  // Handle input change for command and suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentCommand(value);
    
    if (value) {
      const newSuggestions = getAutocompleteSuggestions(value);
      setSuggestions(newSuggestions);
      setSuggestionsVisible(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  // Handle keyboard events for command history navigation and auto-completion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key to execute command
    if (e.key === 'Enter') {
      executeCommand();
    }
    
    // Up/Down arrow for command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(history.currentIndex + 1, history.commands.length - 1);
      if (newIndex >= 0 && history.commands.length > 0) {
        setCurrentCommand(history.commands[history.commands.length - 1 - newIndex]);
        setHistory(prev => ({ ...prev, currentIndex: newIndex }));
        setSuggestionsVisible(false);
      }
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(history.currentIndex - 1, -1);
      if (newIndex >= 0) {
        setCurrentCommand(history.commands[history.commands.length - 1 - newIndex]);
      } else {
        setCurrentCommand('');
      }
      setHistory(prev => ({ ...prev, currentIndex: newIndex }));
      setSuggestionsVisible(false);
    }
    
    // Tab for auto-completion
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setCurrentCommand(suggestions[0]);
        setSuggestionsVisible(false);
      }
    }
  };

  // Apply suggestion when clicked
  const applySuggestion = (suggestion: string) => {
    setCurrentCommand(suggestion);
    setSuggestionsVisible(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="terminal-window w-full bg-zinc-900 text-white p-4 rounded-md overflow-hidden flex flex-col shadow-xl border border-zinc-700"
      onClick={focusInput}
    >
      {/* Terminal header */}
      <div className="flex items-center mb-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-center flex-1 text-gray-400 text-sm font-medium">user@ubuntu: ~</div>
      </div>
      
      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto ubuntu-mono"
      >
        <div className="mb-5 text-gray-300">
          Welcome to Ubuntu Linux Terminal Simulator!
          <br />
          Type <span className="text-teal-400 font-bold">'help'</span> to see available commands or <span className="text-teal-400 font-bold">'tutorial'</span> to start learning.
        </div>
        
        {/* Command history */}
        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-3 animate-fade-in">
            <div className="flex">
              <span className="text-teal-400">user@ubuntu:~$</span>
              <span className="ml-2">{entry.command}</span>
            </div>
            <div 
              className={`whitespace-pre-wrap pl-0 ${entry.isError ? 'text-red-400' : 'text-gray-100'}`}
            >
              {entry.output}
            </div>
          </div>
        ))}
        
        {/* Current command prompt */}
        <div className="flex items-center">
          <span className="text-teal-400">user@ubuntu:~$</span>
          <div className="relative flex-1 ml-2">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none ubuntu-mono text-white caret-white"
              autoFocus
              spellCheck="false"
            />
            
            {/* Command suggestions */}
            {suggestionsVisible && (
              <div className="absolute left-0 bottom-full mb-1 bg-zinc-800/95 border border-zinc-700 rounded-md overflow-hidden z-10 shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 hover:bg-teal-700/70 cursor-pointer transition-colors"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
