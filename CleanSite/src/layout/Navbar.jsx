import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { RiDashboardLine, RiScanLine, RiBox3Line, RiInformationLine, RiServerLine, RiFileCopyLine } from 'react-icons/ri';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [currentDate, setCurrentDate] = useState('');
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();
    setCurrentDate(`${month} ${day}, ${year}`);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('Coming Soon');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems = [
    { number: '01', path: '/', label: 'Overview', icon: RiDashboardLine },
    { number: '02', path: '/meme-scanner', label: 'Meme Scanner', icon: RiScanLine },
    { number: '03', path: '/bundle-checker', label: 'Bundle Checker', icon: RiBox3Line },
    { number: '04', path: '/servers', label: 'Servers', icon: RiServerLine },
    { number: '05', path: '/about', label: 'About', icon: RiInformationLine }
  ];

  return (
    <div className={`
      ${isDesktop ? 'w-[240px] h-screen' : 'p-4'} 
      fixed top-0 left-0 z-50
      bg-white
      border-r border-gray-200
    `}>
      <div className={`${isDesktop ? 'h-full pt-8' : 'relative'}`}>
        {/* Header Area */}
        <div className="px-6 mb-8 space-y-1">
          <h1 className="text-base font-mono font-bold text-black">
            AROS
          </h1>
          <div className="text-sm text-black font-mono">
            UPDATED: {currentDate}
          </div>
          <div className="text-sm text-black font-mono flex items-center gap-2">
            <a href="https://x.com/Aros_World" target="_blank" rel="noopener noreferrer">
              <img src="/x.png" alt="X" className="h-4 w-4" />
            </a>
            <a href="https://dexscreener.com/your_link" target="_blank" rel="noopener noreferrer">
              <img src="/dex.png" alt="Dexscreener" className="h-4 w-4" />
            </a>
            <a href="https://github.com/AROSAI/AROS" target="_blank" rel="noopener noreferrer" className="text-sm">
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-black font-mono">
            <span>Coming Soon</span>
            <button 
              onClick={handleCopy}
              className="hover:bg-gray-100 p-1 rounded"
              title="Copy to clipboard"
            >
              <RiFileCopyLine className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-500'}`} />
            </button>
            {copied && <span className="text-xs text-green-500">Copied!</span>}
          </div>
        </div>

        {!isDesktop && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
          >
            <HiMenu className="h-6 w-6 text-black" />
          </button>
        )}

        {(isOpen || isDesktop) && (
          <div className={`
            ${isDesktop ? 'w-full' : 'absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200'}
            py-2
          `}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => !isDesktop && setIsOpen(false)}
                  className={`
                    flex items-center px-6 py-3
                    transition-all duration-300
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}
                  `}
                >
                  <span className="text-black font-mono text-sm w-8">{item.number}</span>
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-black' : 'text-black'}`} />
                  <span className={`font-medium text-black`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-black">→</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;