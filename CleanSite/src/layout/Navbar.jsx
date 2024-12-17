import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { RiDashboardLine, RiScanLine, RiBox3Line, RiInformationLine } from 'react-icons/ri';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', label: 'Overview', icon: RiDashboardLine },
    { path: '/meme-scanner', label: 'Meme Scanner', icon: RiScanLine },
    { path: '/bundle-checker', label: 'Bundle Checker', icon: RiBox3Line },
    { path: '/about', label: 'About', icon: RiInformationLine }
  ];

  return (
    <div className={`
      ${isDesktop ? 'w-[15%] h-screen' : 'p-4'} 
      fixed top-0 left-0 z-50
      bg-white/80 backdrop-blur-md
      border-r border-teal-400/10
    `}>
      <div className={`${isDesktop ? 'h-full pt-8' : 'relative'}`}>
        {/* Logo Area */}
        <div className="px-6 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-[#708090] bg-clip-text text-transparent">
            Test
          </h1>
        </div>

        {!isDesktop && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gradient-to-r hover:from-teal-400/10 hover:to-[#708090]/10 rounded-lg transition-all duration-300"
          >
            <HiMenu className="h-6 w-6 text-[#4A4A4A]" />
          </button>
        )}

        {(isOpen || isDesktop) && (
          <div className={`
            ${isDesktop ? 'w-full' : 'absolute top-full left-0 mt-2 w-64 bg-white/80 backdrop-blur-md shadow-lg rounded-lg border border-teal-400/10'}
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
                    flex items-center px-6 py-3 my-1 mx-2
                    rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-400/20 to-[#708090]/20 text-[#4A4A4A]' 
                      : 'text-[#4A4A4A]/60 hover:bg-gradient-to-r hover:from-teal-400/10 hover:to-[#708090]/10'}
                  `}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${isActive ? 'text-teal-400' : 'text-[#708090]'}`} />
                  <span className={`font-medium ${isActive ? 'text-[#4A4A4A]' : ''}`}>{item.label}</span>
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