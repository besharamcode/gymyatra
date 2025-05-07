import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiBarChart2,
  FiList,
  FiUsers,
  FiActivity,
  FiClipboard,
} from "react-icons/fi";
import { logout, reset } from "../redux/authSlice";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useTheme } from "../providers/ThemeProvider";

const NavLink = ({
  to,
  children,
  onClick,
  isMobile = false,
  isActive = false,
  scrolled,
}) => {
  const { theme } = useTheme();
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
        isMobile ? "block w-full text-center" : "inline-flex items-center"
      } ${
        isActive
          ? "font-medium"
          : "hover:bg-primary-foreground/10"
      } ${
        scrolled && !isMobile
          ? "text-foreground hover:text-foreground"
          : !scrolled && theme === "light" && !isMobile
          ? "text-gray-800"
          : "text-primary-foreground"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId={isMobile ? "mobile-active-pill" : "desktop-active-pill"}
          className={`absolute inset-0 rounded-full -z-10 ${
            theme === "light" && !scrolled ? "bg-primary/90" : "bg-primary"
          }`}
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  // Track scroll position to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  // Function to check if a route is active
  const isActive = (paths) => {
    return Array.isArray(paths)
      ? paths.some((path) => location.pathname.includes(path))
      : location.pathname.includes(paths);
  };

  // Get appropriate icon for each link
  const getNavIcon = (path) => {
    switch (true) {
      case path.includes("dashboard"):
        return <FiHome className="mr-2" />;
      case path.includes("workout"):
        return <FiActivity className="mr-2" />;
      case path.includes("progress"):
        return <FiBarChart2 className="mr-2" />;
      case path.includes("users"):
        return <FiUsers className="mr-2" />;
      case path.includes("exercises"):
        return <FiActivity className="mr-2" />;
      case path.includes("diet"):
        return <FiClipboard className="mr-2" />;
      case path.includes("plan"):
        return <FiList className="mr-2" />;
      default:
        return null;
    }
  };

  // Admin nav links
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/exercises", label: "Exercises" },
    { to: "/admin/diet-plans", label: "Diet Plans" },
    { to: "/admin/workout-plans", label: "Workout Plans" },
  ];

  // User nav links
  const userLinks = [
    { to: "/user/dashboard", label: "Dashboard" },
    { to: "/user/workout-plan", label: "My Plan" },
    { to: "/user/progress", label: "Progress" },
  ];

  // Get the appropriate links based on user role
  const navLinks = user?.user?.role === "admin" ? adminLinks : userLinks;

  // Navbar container animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Navbar items animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // Mobile menu animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 py-2 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg shadow-md"
          : theme === "light"
          ? "bg-white/50 backdrop-blur-sm text-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div className="flex items-center" variants={itemVariants}>
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
            >
              GymYatra
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <motion.div
                  className="flex space-x-1 mr-4"
                  variants={itemVariants}
                >
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      isActive={isActive(link.to)}
                      scrolled={scrolled}
                    >
                      {getNavIcon(link.to)}
                      {link.label}
                    </NavLink>
                  ))}
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3"
                  variants={itemVariants}
                >
                  <Link
                    to={
                      user.user.role === "admin"
                        ? "/admin/profile"
                        : "/user/profile"
                    }
                    className={`flex items-center p-2 rounded-full hover:bg-secondary/10 transition-colors ${
                      scrolled 
                        ? "text-foreground" 
                        : theme === "light" 
                        ? "text-gray-800" 
                        : "text-primary-foreground"
                    }`}
                  >
                    <div
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                    >
                      <FiUser />
                    </div>
                    <span className="ml-2 font-medium">
                      {user.user.name}
                    </span>
                  </Link>

                  <ThemeToggle />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="flex items-center bg-destructive text-destructive-foreground px-4 py-2 rounded-full transition-colors"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="flex items-center space-x-4"
                variants={itemVariants}
              >
                <NavLink to="/" isActive={location.pathname === "/"} scrolled={scrolled}>
                  Home
                </NavLink>
                <NavLink
                  to="/features"
                  isActive={location.pathname === "/features"}
                  scrolled={scrolled}
                >
                  Features
                </NavLink>
                <NavLink
                  to="/pricing"
                  isActive={location.pathname === "/pricing"}
                  scrolled={scrolled}
                >
                  Pricing
                </NavLink>
                <ThemeToggle />
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full border border-border hover:bg-background/80 transition-colors ${
                    scrolled 
                      ? "text-foreground" 
                      : theme === "light" 
                      ? "text-gray-800" 
                      : "text-primary-foreground"
                  }`}
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full shadow-lg transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden flex items-center space-x-3"
            variants={itemVariants}
          >
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                theme === "dark" 
                  ? "bg-gray-800 text-gray-200 border-gray-700" 
                  : scrolled
                  ? "bg-gray-100 text-gray-800 border-gray-200"
                  : "bg-white/70 text-gray-800 border-gray-200"
              } border border-border/50`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`md:hidden overflow-hidden rounded-2xl border border-border mt-2 shadow-xl ${
                theme === "dark" 
                  ? "bg-gray-800 text-gray-200" 
                  : "bg-white text-gray-800"
              }`}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="p-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center p-2 mb-4 border-b border-border pb-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <FiUser size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{user.user.name}</p>
                        <p className={`text-sm capitalize ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {user.user.role}
                        </p>
                      </div>
                    </div>

                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        isMobile={true}
                        isActive={isActive(link.to)}
                      >
                        <div className="flex items-center justify-center">
                          {getNavIcon(link.to)}
                          {link.label}
                        </div>
                      </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-border">
                      <Link
                        to={
                          user.user.role === "admin"
                            ? "/admin/profile"
                            : "/user/profile"
                        }
                        className={`flex items-center justify-center p-2 w-full rounded-full mb-2 ${
                          theme === "dark" 
                            ? "hover:bg-gray-700" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <FiUser className="mr-2" /> Profile
                      </Link>

                      <button
                        onClick={onLogout}
                        className="flex items-center justify-center bg-destructive text-destructive-foreground w-full px-4 py-2 rounded-full"
                      >
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/"
                      isMobile={true}
                      isActive={location.pathname === "/"}
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/features"
                      isMobile={true}
                      isActive={location.pathname === "/features"}
                    >
                      Features
                    </NavLink>
                    <NavLink
                      to="/pricing"
                      isMobile={true}
                      isActive={location.pathname === "/pricing"}
                    >
                      Pricing
                    </NavLink>
                    <div className="pt-4 mt-2 border-t border-border space-y-2">
                      <Link
                        to="/login"
                        className={`block w-full text-center px-4 py-2 rounded-full ${
                          theme === "dark" 
                            ? "border border-gray-700 text-gray-200" 
                            : "border border-gray-300 text-gray-800"
                        }`}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-center bg-primary text-primary-foreground px-4 py-2 rounded-full"
                      >
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
