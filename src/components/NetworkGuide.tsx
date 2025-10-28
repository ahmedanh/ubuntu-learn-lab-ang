
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Network, 
  Router, 
  Wifi, 
  Database, 
  Search, 
  Link, 
  Terminal, 
  Upload, 
  Download 
} from 'lucide-react';

// Tool category definitions
type ToolCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

// Individual tool definition
type Tool = {
  name: string;
  description: string;
  installation: string;
  syntax: string;
  options: {
    flag: string;
    effect: string;
  }[];
  tutorial: string[];
  useCase: string[];
  interpretation: string;
  proTip: string;
  pitfall: string;
};

// Tools organized by category
type ToolsByCategory = {
  [key: string]: Tool[];
};

const NetworkGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('connectivity');
  
  // Tool Categories
  const categories: ToolCategory[] = [
    {
      id: 'connectivity',
      name: 'Connectivity Testers',
      icon: <Wifi className="text-teal-400" />,
      description: 'Tools for checking basic network connectivity to hosts and services.'
    },
    {
      id: 'path',
      name: 'Path Analyzers',
      icon: <Router className="text-teal-400" />,
      description: 'Tools for analyzing network paths and routing between devices.'
    },
    {
      id: 'dns',
      name: 'DNS Tools',
      icon: <Database className="text-teal-400" />,
      description: 'Tools for querying and troubleshooting Domain Name System issues.'
    },
    {
      id: 'port',
      name: 'Port Scanners',
      icon: <Search className="text-teal-400" />,
      description: 'Tools for checking open ports and services on network devices.'
    },
    {
      id: 'packet',
      name: 'Packet Analyzers',
      icon: <Network className="text-teal-400" />,
      description: 'Tools for capturing and analyzing network packet data.'
    },
    {
      id: 'bandwidth',
      name: 'Bandwidth Monitors',
      icon: <Upload className="text-teal-400" />,
      description: 'Tools for measuring and monitoring network throughput.'
    }
  ];
  
  // Tools organized by category
  const toolsByCategory: ToolsByCategory = {
    connectivity: [
      {
        name: 'ping',
        description: 'Sends ICMP echo requests to test basic reachability of network hosts.',
        installation: 'Built-in to most Linux distributions.',
        syntax: 'ping [options] <host>',
        options: [
          { flag: '-c <count>', effect: 'Number of packets to send' },
          { flag: '-i <interval>', effect: 'Seconds between packets' },
          { flag: '-s <size>', effect: 'Size of packet in bytes' },
          { flag: '-W <timeout>', effect: 'Time to wait for response (seconds)' }
        ],
        tutorial: [
          '# Basic ping to a host:',
          'ping google.com',
          '',
          '# Send exactly 5 packets then stop:',
          'ping -c 5 google.com',
          '',
          '# Ping with larger packet size:',
          'ping -s 1500 google.com'
        ],
        useCase: [
          'Checking if a host is reachable',
          'Measuring basic latency (round-trip time)',
          'Testing for packet loss'
        ],
        interpretation: 'Look for round-trip time (RTT) in milliseconds and any packet loss percentage. Higher times indicate latency issues, while packet loss suggests connectivity problems.',
        proTip: 'Use -O to display packet timestamps for latency spikes investigation.',
        pitfall: 'Many networks block ICMP packets, causing ping to fail even when the host is actually reachable.'
      },
      {
        name: 'hping3',
        description: 'Advanced ping utility that can send custom TCP/UDP/ICMP packets for testing firewalls and network security.',
        installation: 'sudo apt install hping3',
        syntax: 'hping3 [options] <host>',
        options: [
          { flag: '-2', effect: 'Use UDP mode' },
          { flag: '-S', effect: 'Set SYN TCP flag' },
          { flag: '-p <port>', effect: 'Set destination port' },
          { flag: '--scan <ports>', effect: 'Scan specified ports' }
        ],
        tutorial: [
          '# TCP SYN ping to port 80:',
          'hping3 -S -p 80 example.com',
          '',
          '# UDP packet to port 53 (DNS):',
          'hping3 -2 -p 53 8.8.8.8',
          '',
          '# Scan ports 20-25:',
          'hping3 --scan 20-25 192.168.1.1'
        ],
        useCase: [
          'Testing firewall rules',
          'Checking specific TCP/UDP ports',
          'Network security testing',
          'Advanced connectivity diagnosis'
        ],
        interpretation: 'Similar to ping, but allows testing specific protocols. Look for flags in responses (SA for SYN-ACK indicates port is open).',
        proTip: 'Use --tcp-timestamp to detect system uptime and OS fingerprinting.',
        pitfall: 'Can be detected as an attack; use with caution and permission.'
      },
      {
        name: 'fping',
        description: 'Enhanced ping tool that can ping multiple hosts in parallel with flexibility.',
        installation: 'sudo apt install fping',
        syntax: 'fping [options] <hosts>',
        options: [
          { flag: '-a', effect: 'Show only alive hosts' },
          { flag: '-c <count>', effect: 'Number of pings to each host' },
          { flag: '-g', effect: 'Generate target list from given IP range' },
          { flag: '-f <file>', effect: 'Read list of hosts from a file' }
        ],
        tutorial: [
          '# Ping multiple hosts:',
          'fping google.com yahoo.com 8.8.8.8',
          '',
          '# Ping an IP range:',
          'fping -g 192.168.1.1 192.168.1.10',
          '',
          '# Only show reachable hosts:',
          'fping -a -g 192.168.0.0/24'
        ],
        useCase: [
          'Quick network device inventory',
          'Checking multiple hosts efficiently',
          'Subnet scanning for available hosts'
        ],
        interpretation: 'Each line shows host status: alive (round-trip time) or unreachable. Summary shows percentage available.',
        proTip: 'Use with -q (quiet) and -a (alive only) for clean lists of available hosts.',
        pitfall: 'High rate pings can trigger IDS/IPS systems or be rate-limited by network devices.'
      }
    ],
    path: [
      {
        name: 'traceroute',
        description: 'Maps the network path to a destination by sending packets with increasing TTL values.',
        installation: 'sudo apt install traceroute',
        syntax: 'traceroute [options] <host>',
        options: [
          { flag: '-I', effect: 'Use ICMP echo (more reliable through firewalls)' },
          { flag: '-T', effect: 'Use TCP SYN for probes' },
          { flag: '-n', effect: 'Do not resolve IP addresses to hostnames' },
          { flag: '-m <max_ttl>', effect: 'Set maximum number of hops' }
        ],
        tutorial: [
          '# Basic traceroute:',
          'traceroute google.com',
          '',
          '# Use ICMP instead of UDP (better for firewalls):',
          'traceroute -I google.com',
          '',
          '# Faster trace by skipping DNS resolution:',
          'traceroute -n 8.8.8.8'
        ],
        useCase: [
          'Identifying where connections fail in the network path',
          'Discovering routing loops',
          'Measuring latency at each network hop'
        ],
        interpretation: 'Each line represents a hop in the path. Asterisks (*) indicate no response. Look for high latency jumps or timeouts.',
        proTip: 'Compare traceroute results from multiple locations to identify network bottlenecks.',
        pitfall: 'Some routers don\'t send ICMP time exceeded messages or rate-limit them.'
      },
      {
        name: 'mtr',
        description: 'Combines ping and traceroute functionality for continuous path monitoring and statistics.',
        installation: 'sudo apt install mtr',
        syntax: 'mtr [options] <host>',
        options: [
          { flag: '-r', effect: 'Report mode (instead of ncurses live view)' },
          { flag: '-c <count>', effect: 'Number of pings per hop' },
          { flag: '-n', effect: 'Do not resolve IP addresses' },
          { flag: '-T', effect: 'Use TCP instead of ICMP' }
        ],
        tutorial: [
          '# Live interactive monitoring:',
          'mtr google.com',
          '',
          '# Generate a report with 10 packets per hop:',
          'mtr -r -c 10 google.com',
          '',
          '# TCP mode to bypass ICMP filtering:',
          'mtr -T -p 80 example.com'
        ],
        useCase: [
          'Long-term path monitoring',
          'Detailed statistics on packet loss and latency',
          'Identifying intermittent network issues'
        ],
        interpretation: 'Look at Loss% column for packet loss at each hop. Avg/Best/Worst columns show latency statistics.',
        proTip: 'Press \'d\' in interactive mode to toggle showing DNS names.',
        pitfall: 'Packet loss at intermediate hops may be due to router de-prioritizing TTL-expired responses, not actual problems.'
      },
      {
        name: 'tracepath',
        description: 'Similar to traceroute but doesn\'t require root privileges and discovers path MTU.',
        installation: 'sudo apt install iputils-tracepath',
        syntax: 'tracepath [options] <host>',
        options: [
          { flag: '-n', effect: 'Do not resolve IP addresses' },
          { flag: '-b', effect: 'Print both DNS names and IP addresses' },
          { flag: '-l <length>', effect: 'Initial packet length' },
          { flag: '-m <hops>', effect: 'Maximum hops to probe' }
        ],
        tutorial: [
          '# Basic tracepath:',
          'tracepath example.com',
          '',
          '# Without DNS resolution:',
          'tracepath -n 8.8.8.8',
          '',
          '# With custom packet length:',
          'tracepath -l 1400 example.com'
        ],
        useCase: [
          'Path discovery without root access',
          'Finding the path MTU (Maximum Transmission Unit)',
          'Alternative when traceroute is unavailable'
        ],
        interpretation: 'Similar to traceroute, but also shows path MTU. "pmtu" entries show discovered MTU at each hop.',
        proTip: 'Look for pmtu decreases which indicate potential MTU issues on the path.',
        pitfall: 'Less flexible than traceroute for protocol selection.'
      }
    ],
    dns: [
      {
        name: 'dig',
        description: 'Advanced DNS lookup tool with detailed query control and response information.',
        installation: 'sudo apt install dnsutils',
        syntax: 'dig [@server] [name] [type]',
        options: [
          { flag: '+short', effect: 'Brief output (just answers)' },
          { flag: '+trace', effect: 'Trace from root nameservers' },
          { flag: '+noall +answer', effect: 'Show only answers' },
          { flag: '-x <ip>', effect: 'Reverse DNS lookup' }
        ],
        tutorial: [
          '# Basic DNS lookup:',
          'dig google.com',
          '',
          '# Query specific DNS server:',
          'dig @8.8.8.8 example.com',
          '',
          '# Query for MX records:',
          'dig example.com MX',
          '',
          '# Reverse lookup:',
          'dig -x 8.8.8.8'
        ],
        useCase: [
          'Troubleshooting DNS resolution issues',
          'Verifying DNS record changes',
          'Checking DNS propagation',
          'Testing specific nameservers'
        ],
        interpretation: 'Look for "ANSWER SECTION" for responses. Check status (NOERROR, NXDOMAIN). Query time shows resolution speed.',
        proTip: 'Use +trace to see the full resolution path from root servers.',
        pitfall: 'ANSWER: 0 could mean no records, not a lookup failure. Check status codes.'
      },
      {
        name: 'host',
        description: 'Simple DNS lookup tool for quick name resolution and DNS record checks.',
        installation: 'sudo apt install bind9-host',
        syntax: 'host [options] name [server]',
        options: [
          { flag: '-t <type>', effect: 'Query specific record type' },
          { flag: '-a', effect: 'Equivalent to -t ANY' },
          { flag: '-v', effect: 'Verbose output' },
          { flag: '-W <timeout>', effect: 'Set query timeout' }
        ],
        tutorial: [
          '# Basic hostname lookup:',
          'host example.com',
          '',
          '# Check mail servers:',
          'host -t MX example.com',
          '',
          '# Reverse DNS lookup:',
          'host 8.8.8.8',
          '',
          '# All records:',
          'host -a example.com'
        ],
        useCase: [
          'Quick DNS lookups',
          'Simple verification of DNS records',
          'Quick reverse DNS checks',
          'Shell scripting'
        ],
        interpretation: 'Results are shown in a simple format. "not found" means no record or failed lookup.',
        proTip: 'For scripting, check exit code ($?) to determine success/failure.',
        pitfall: 'Less informative error messages compared to dig for troubleshooting.'
      },
      {
        name: 'nslookup',
        description: 'Legacy interactive DNS lookup tool that\'s still widely used.',
        installation: 'sudo apt install dnsutils',
        syntax: 'nslookup [options] [name] [server]',
        options: [
          { flag: '-type=<type>', effect: 'Set query type (A, MX, etc)' },
          { flag: '-debug', effect: 'Turn on debugging' },
          { flag: '-timeout=<seconds>', effect: 'Set query timeout' },
          { flag: '-querytype=<type>', effect: 'Same as -type' }
        ],
        tutorial: [
          '# Basic lookup:',
          'nslookup example.com',
          '',
          '# Query specific DNS server:',
          'nslookup example.com 8.8.8.8',
          '',
          '# Interactive mode:',
          'nslookup',
          '> server 8.8.8.8',
          '> set type=MX',
          '> example.com'
        ],
        useCase: [
          'Interactive DNS querying',
          'Quick DNS checks',
          'Testing specific nameservers'
        ],
        interpretation: 'Look for "Non-authoritative answer" section. Shows server used, answer, and authority info.',
        proTip: 'Use interactive mode to run multiple queries against the same server.',
        pitfall: 'Considered deprecated but still commonly used; dig provides more detailed output.'
      }
    ],
    port: [
      {
        name: 'nmap',
        description: 'Powerful network scanner for discovering hosts and services on a network.',
        installation: 'sudo apt install nmap',
        syntax: 'nmap [options] <target>',
        options: [
          { flag: '-sS', effect: 'TCP SYN scan (default)' },
          { flag: '-sU', effect: 'UDP scan' },
          { flag: '-p <ports>', effect: 'Scan specific ports' },
          { flag: '-A', effect: 'Enable OS detection, version detection, script scanning, and traceroute' }
        ],
        tutorial: [
          '# Basic scan of a host:',
          'nmap example.com',
          '',
          '# Scan specific ports:',
          'nmap -p 22,80,443 192.168.1.1',
          '',
          '# Scan a subnet:',
          'nmap 192.168.1.0/24',
          '',
          '# Aggressive scan with OS detection:',
          'nmap -A example.com'
        ],
        useCase: [
          'Network inventory and mapping',
          'Security scanning and auditing',
          'Port discovery',
          'Service version detection'
        ],
        interpretation: 'Results show open/filtered/closed ports and services. Details depend on scan type.',
        proTip: 'Use -sV for service version detection without full aggressive scan.',
        pitfall: 'Can trigger intrusion detection systems. Get permission before scanning networks.'
      },
      {
        name: 'netcat',
        description: 'Versatile networking utility for reading/writing network connections.',
        installation: 'sudo apt install netcat',
        syntax: 'nc [options] [host] [port]',
        options: [
          { flag: '-v', effect: 'Verbose output' },
          { flag: '-z', effect: 'Zero-I/O mode (for scanning)' },
          { flag: '-w <timeout>', effect: 'Connection timeout' },
          { flag: '-l', effect: 'Listen mode' }
        ],
        tutorial: [
          '# Check if ports are open:',
          'nc -zv example.com 80 443',
          '',
          '# Create a simple chat server:',
          'nc -l 1234',
          '',
          '# Connect to the chat server:',
          'nc localhost 1234',
          '',
          '# Transfer a file:',
          '# On receiving end: nc -l 1234 > received_file',
          '# On sending end: nc 10.0.0.2 1234 < file_to_send'
        ],
        useCase: [
          'Port scanning',
          'Testing TCP/UDP services',
          'Creating simple client/server applications',
          'Data transfer between hosts'
        ],
        interpretation: 'For port scanning, "succeeded" means open, no response means closed/filtered.',
        proTip: 'Use -u for UDP port checking instead of TCP.',
        pitfall: 'Different netcat variants have different options (nc, ncat, gnu-netcat).'
      },
      {
        name: 'ss',
        description: 'Socket statistics tool that replaces netstat with more features.',
        installation: 'Built-in to most Linux distributions (iproute2 package).',
        syntax: 'ss [options] [filter]',
        options: [
          { flag: '-t', effect: 'TCP sockets' },
          { flag: '-u', effect: 'UDP sockets' },
          { flag: '-l', effect: 'Listening sockets' },
          { flag: '-n', effect: 'Don\'t resolve service names' }
        ],
        tutorial: [
          '# Show all listening TCP ports:',
          'ss -tl',
          '',
          '# Show all established connections:',
          'ss -t state established',
          '',
          '# Show processes using sockets:',
          'ss -p',
          '',
          '# Filter by port:',
          'ss -tn sport = :80'
        ],
        useCase: [
          'Checking listening ports',
          'Monitoring active connections',
          'Troubleshooting socket issues',
          'Identifying processes using ports'
        ],
        interpretation: 'Shows local and peer addresses, socket state, and optionally process ID.',
        proTip: 'Filter with state expressions: ss state time-wait for TIME-WAIT connections.',
        pitfall: 'Needs root privileges for some operations (like showing process IDs).'
      }
    ],
    packet: [
      {
        name: 'tcpdump',
        description: 'Command-line packet capture and analysis tool for network debugging.',
        installation: 'sudo apt install tcpdump',
        syntax: 'tcpdump [options] [expression]',
        options: [
          { flag: '-i <interface>', effect: 'Specify network interface' },
          { flag: '-n', effect: 'Don\'t resolve hostnames' },
          { flag: '-w <file>', effect: 'Write packets to file' },
          { flag: '-r <file>', effect: 'Read packets from file' }
        ],
        tutorial: [
          '# Capture packets on interface:',
          'sudo tcpdump -i eth0',
          '',
          '# Capture specific host traffic:',
          'sudo tcpdump host 192.168.1.10',
          '',
          '# Capture specific port:',
          'sudo tcpdump port 80',
          '',
          '# Save capture to file:',
          'sudo tcpdump -w capture.pcap'
        ],
        useCase: [
          'Troubleshooting network issues',
          'Analyzing protocol behavior',
          'Security monitoring',
          'Capturing traffic for detailed analysis'
        ],
        interpretation: 'Each line represents one packet with timestamp, source/destination, flags, and data.',
        proTip: 'Use -A to print packet payload in ASCII for HTTP inspection.',
        pitfall: 'Can generate massive amounts of data. Use capture filters to limit output.'
      },
      {
        name: 'tshark',
        description: 'Command-line version of Wireshark for capturing and analyzing network traffic.',
        installation: 'sudo apt install tshark',
        syntax: 'tshark [options] [filter]',
        options: [
          { flag: '-i <interface>', effect: 'Specify network interface' },
          { flag: '-f <capture filter>', effect: 'Set BPF capture filter' },
          { flag: '-Y <display filter>', effect: 'Set display filter' },
          { flag: '-T fields -e <fields>', effect: 'Extract specific fields' }
        ],
        tutorial: [
          '# Capture HTTP traffic:',
          'sudo tshark -i eth0 -f "tcp port 80"',
          '',
          '# Extract HTTP hosts:',
          'sudo tshark -i eth0 -Y http.request -T fields -e http.host',
          '',
          '# Analyze DNS queries:',
          'sudo tshark -i eth0 -Y "dns.flags.response eq 0" -T fields -e dns.qry.name',
          '',
          '# Read from capture file:',
          'tshark -r capture.pcap'
        ],
        useCase: [
          'Advanced protocol analysis',
          'Extracting specific protocol data',
          'Script-based network monitoring',
          'Detailed packet inspection'
        ],
        interpretation: 'Format varies based on options. Default shows packet number, time, source, destination, protocol, and info.',
        proTip: 'Use -T fields for scripting and automated analysis.',
        pitfall: 'Complex syntax for advanced filtering. Steep learning curve for display filters.'
      },
      {
        name: 'ngrep',
        description: 'Network grep - applies grep-like syntax to network packet payloads.',
        installation: 'sudo apt install ngrep',
        syntax: 'ngrep [options] <pattern> [filter]',
        options: [
          { flag: '-i', effect: 'Case-insensitive matching' },
          { flag: '-W byline', effect: 'Line-buffered output' },
          { flag: '-d <interface>', effect: 'Specify interface' },
          { flag: '-q', effect: 'Quiet mode - only print matching packets' }
        ],
        tutorial: [
          '# Search for "password" in all traffic:',
          'sudo ngrep -i "password" -d eth0',
          '',
          '# Monitor HTTP requests:',
          'sudo ngrep -Wi "^GET|^POST" port 80',
          '',
          '# Look for DNS queries:',
          'sudo ngrep -l -q ".*" udp port 53',
          '',
          '# Search in previously captured file:',
          'ngrep -I capture.pcap "login"'
        ],
        useCase: [
          'Finding specific content in network traffic',
          'Monitoring HTTP/FTP/SMTP for specific strings',
          'Quick protocol analysis',
          'Security monitoring'
        ],
        interpretation: 'Shows packet source/destination with matched content highlighted.',
        proTip: 'Use BPF syntax (like tcpdump) to filter traffic before pattern matching.',
        pitfall: 'Can only match within individual packets, not across packet boundaries.'
      }
    ],
    bandwidth: [
      {
        name: 'iperf3',
        description: 'Network bandwidth testing tool for measuring maximum TCP/UDP throughput.',
        installation: 'sudo apt install iperf3',
        syntax: 'iperf3 [options]',
        options: [
          { flag: '-s', effect: 'Run in server mode' },
          { flag: '-c <host>', effect: 'Run in client mode' },
          { flag: '-t <time>', effect: 'Time to transmit (seconds)' },
          { flag: '-R', effect: 'Reverse direction (server sends)' }
        ],
        tutorial: [
          '# Start server on one host:',
          'iperf3 -s',
          '',
          '# Run client test from another host:',
          'iperf3 -c 192.168.1.100',
          '',
          '# Test with specific duration:',
          'iperf3 -c 192.168.1.100 -t 30',
          '',
          '# Test UDP bandwidth:',
          'iperf3 -c 192.168.1.100 -u'
        ],
        useCase: [
          'Measuring maximum network throughput',
          'Testing network performance',
          'Validating quality of service settings',
          'Comparing network paths'
        ],
        interpretation: 'Results show transfer rate in bits/sec. Look for the "receiver" line for accurate throughput.',
        proTip: 'Use -P flag to run multiple parallel streams for testing multi-threaded applications.',
        pitfall: 'Results may be limited by CPU, not just network bandwidth.'
      },
      {
        name: 'speedtest-cli',
        description: 'Command-line interface for testing internet bandwidth using Speedtest.net.',
        installation: 'sudo apt install speedtest-cli',
        syntax: 'speedtest-cli [options]',
        options: [
          { flag: '--simple', effect: 'Simplified output' },
          { flag: '--server <id>', effect: 'Use specific server' },
          { flag: '--list', effect: 'List nearby servers' },
          { flag: '--share', effect: 'Generate shareable result image' }
        ],
        tutorial: [
          '# Run basic speed test:',
          'speedtest-cli',
          '',
          '# Get simple output:',
          'speedtest-cli --simple',
          '',
          '# Find closest servers:',
          'speedtest-cli --list',
          '',
          '# Test with specific server:',
          'speedtest-cli --server 1234'
        ],
        useCase: [
          'Testing internet connection speed',
          'Monitoring ISP performance',
          'Troubleshooting internet connectivity',
          'Documenting connection quality'
        ],
        interpretation: 'Shows ping latency, download speed, and upload speed. Higher values are better except for ping.',
        proTip: 'Use --share to generate a shareable image of results for tech support.',
        pitfall: 'Results vary based on server load and network congestion.'
      },
      {
        name: 'iftop',
        description: 'Real-time network bandwidth monitoring tool showing top bandwidth consumers.',
        installation: 'sudo apt install iftop',
        syntax: 'iftop [options]',
        options: [
          { flag: '-i <interface>', effect: 'Select interface' },
          { flag: '-n', effect: 'Don\'t resolve hostnames' },
          { flag: '-P', effect: 'Show ports in output' },
          { flag: '-f <filter>', effect: 'Use pcap filter expression' }
        ],
        tutorial: [
          '# Monitor all traffic:',
          'sudo iftop',
          '',
          '# Monitor specific interface:',
          'sudo iftop -i eth0',
          '',
          '# Don\'t resolve names (faster):',
          'sudo iftop -n',
          '',
          '# Monitor specific host:',
          'sudo iftop -f "host 192.168.1.10"'
        ],
        useCase: [
          'Identifying bandwidth hogs',
          'Real-time network utilization monitoring',
          'Troubleshooting network congestion',
          'Monitoring per-connection bandwidth'
        ],
        interpretation: 'Shows host pairs with bandwidth usage. Bars indicate traffic levels over time.',
        proTip: 'Press \'h\' during execution to see keyboard controls, \'p\' to toggle port display.',
        pitfall: 'High CPU usage on very busy networks.'
      }
    ]
  };

  const renderToolComparison = (category: string) => {
    const tools = toolsByCategory[category];
    if (!tools || tools.length < 2) return null;
    
    return (
      <div className="mt-6 overflow-hidden border border-gray-700 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 font-medium text-left text-gray-300">Tool</th>
              <th className="px-4 py-2 font-medium text-left text-gray-300">Description</th>
              <th className="px-4 py-2 font-medium text-left text-gray-300">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tools.map((tool) => (
              <tr key={tool.name} className="hover:bg-gray-800/50">
                <td className="px-4 py-2 font-mono text-teal-400">{tool.name}</td>
                <td className="px-4 py-2 text-gray-300">{tool.description}</td>
                <td className="px-4 py-2 text-gray-300">{tool.useCase[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAsciiDiagram = (category: string) => {
    switch(category) {
      case 'path':
        return (
          <div className="p-4 mt-6 font-mono text-sm text-teal-400 bg-gray-800 border border-gray-700 rounded-md">
            <pre>
              {`Your PC → Router → ISP → Internet Core → Server
          (1ms)   (15ms)   (30ms)         (85ms)
              
* * * indicates firewall or device not responding to probes
              `}
            </pre>
          </div>
        );
      case 'packet':
        return (
          <div className="p-4 mt-6 font-mono text-sm text-teal-400 bg-gray-800 border border-gray-700 rounded-md">
            <pre>
              {`+--------------------+
| Ethernet Header    |
+--------------------+
| IP Header          |
+--------------------+
| TCP/UDP Header     |
+--------------------+
| Application Data   |
|                    |
+--------------------+
              
tcpdump/tshark can inspect all layers`}
            </pre>
          </div>
        );
      case 'dns':
        return (
          <div className="p-4 mt-6 font-mono text-sm text-teal-400 bg-gray-800 border border-gray-700 rounded-md">
            <pre>
              {`DNS Resolution Process:
              
Client → Local DNS → Root DNS → TLD DNS → Authoritative DNS
query     cache      "."       ".com"    "example.com"
              
Recursive vs Iterative queries`}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-900">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Linux Network Troubleshooting Guide</h2>
        <p className="text-gray-300">A comprehensive reference for network diagnostic tools and commands.</p>
      </div>
      
      <Tabs defaultValue={categories[0].id} value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <div className="mb-4">
          <TabsList className="w-full overflow-x-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 data-[state=active]:bg-teal-600"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded-md">
              <h3 className="flex items-center gap-2 mb-2 text-xl font-semibold text-white">
                {category.icon}
                {category.name}
              </h3>
              <p className="text-gray-300">{category.description}</p>
            </div>
            
            {/* Tool comparison table */}
            {renderToolComparison(category.id)}
            
            {/* ASCII diagram if available */}
            {renderAsciiDiagram(category.id)}
            
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {toolsByCategory[category.id]?.map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 overflow-hidden bg-gray-800 border border-gray-700 shadow-md rounded-md"
                >
                  <h4 className="mb-2 text-lg font-bold text-teal-400">{tool.name}</h4>
                  <div className="mb-3 text-gray-300">{tool.description}</div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Installation</h5>
                    <code className="block p-2 text-sm bg-gray-900 rounded font-mono text-gray-300">{tool.installation}</code>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Basic Syntax</h5>
                    <code className="block p-2 text-sm bg-gray-900 rounded font-mono text-gray-300">{tool.syntax}</code>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Key Options</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <tbody className="divide-y divide-gray-700">
                          {tool.options.map((option, i) => (
                            <tr key={i}>
                              <td className="py-1 pr-4 font-mono text-teal-400">{option.flag}</td>
                              <td className="py-1 text-gray-300">{option.effect}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Tutorial</h5>
                    <ScrollArea className="p-2 text-sm bg-gray-900 rounded h-[150px]">
                      <pre className="font-mono text-gray-300">
                        {tool.tutorial.join('\n')}
                      </pre>
                    </ScrollArea>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Use Case</h5>
                    <ul className="pl-5 space-y-1 list-disc text-gray-300">
                      {tool.useCase.map((use, i) => (
                        <li key={i}>{use}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="mb-1 font-semibold text-gray-200">Output Interpretation</h5>
                    <p className="text-gray-300">{tool.interpretation}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mt-4 lg:grid-cols-2">
                    <div className="p-3 bg-teal-800/30 border border-teal-700 rounded">
                      <h5 className="mb-1 font-medium text-teal-300">💡 Pro Tip</h5>
                      <p className="text-sm text-gray-200">{tool.proTip}</p>
                    </div>
                    <div className="p-3 bg-red-900/20 border border-red-800/50 rounded">
                      <h5 className="mb-1 font-medium text-red-300">⚠️ Common Pitfall</h5>
                      <p className="text-sm text-gray-200">{tool.pitfall}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Cheat Sheet */}
      <div className="p-4 mt-8 bg-gray-800 border border-gray-700 rounded-md">
        <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
          <Terminal className="text-teal-400" />
          Quick Reference Cheat Sheet
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">Connectivity Tests</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">ping</code> → Basic reachability</li>
              <li><code className="font-mono">ping -c 5</code> → 5 packets only</li>
              <li><code className="font-mono">fping -a -g 192.168.1.0/24</code> → Scan subnet</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">Path Analysis</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">traceroute -I</code> → ICMP traceroute</li>
              <li><code className="font-mono">mtr -n</code> → Real-time path monitoring</li>
              <li><code className="font-mono">tracepath</code> → No root needed</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">DNS Troubleshooting</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">dig example.com</code> → Full lookup</li>
              <li><code className="font-mono">dig +short example.com</code> → Just the IP</li>
              <li><code className="font-mono">host -t mx example.com</code> → Mail servers</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">Port Checking</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">nc -zv host.com 80 443</code> → Port scan</li>
              <li><code className="font-mono">ss -tuln</code> → Show listening ports</li>
              <li><code className="font-mono">nmap -p 22,80,443 host</code> → Scan specific ports</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">Performance Testing</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">iperf3 -s</code> → Start server</li>
              <li><code className="font-mono">iperf3 -c server</code> → Test bandwidth</li>
              <li><code className="font-mono">speedtest-cli</code> → Internet speed</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900 border border-gray-700 rounded">
            <h4 className="mb-2 font-semibold text-teal-400">Packet Analysis</h4>
            <ul className="pl-5 space-y-1 list-disc text-gray-300">
              <li><code className="font-mono">tcpdump port 80</code> → Capture HTTP</li>
              <li><code className="font-mono">tcpdump host 192.168.1.5</code> → Host traffic</li>
              <li><code className="font-mono">tshark -i eth0 -Y http</code> → HTTP packets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGuide;
