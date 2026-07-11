const Footer = () => {
    return (
      <footer className="w-full bg-[#05080F] border-t border-white/5 py-8 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"></div>
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Desarrollado por Alce Huriarte. Todos los derechos reservados.
        </div>
      </footer>
    );
  };
  
  export default Footer;
