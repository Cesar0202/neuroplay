import { Link } from 'react-router-dom';
import logoImg from '../assets/logos/logo-main.png';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-[#2C2C2C] bg-[#1E1E1E]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoImg} alt="NeuroPlay Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
