import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { register, reset } from '../redux/authSlice';
import { motion } from 'framer-motion';
import GradientBackground from '../components/ui/GradientBackground';
import AnimationWrapper, { animationVariants } from '../components/ui/AnimationWrapper';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate(user?.user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <GradientBackground intensity="medium" variant="primary" className="absolute inset-0 z-0" />
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/3 right-[15%] w-12 h-12 rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-md"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-[15%] w-8 h-8 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-md"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <motion.div 
          className="absolute top-1/4 left-[25%] w-6 h-6 rounded-lg border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-md"
          animate={{ 
            y: [0, 10, 0],
            x: [0, 5, 0],
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <AnimationWrapper variant="fadeInUp" className="w-full max-w-md z-10">
          <div className="w-full max-w-md p-8 card glass-effect backdrop-blur-md border border-border/30 shadow-xl rounded-xl">
            <AnimationWrapper variant="fadeIn" delay={0.2}>
              <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
                Create Account
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                Join us to start your fitness journey
              </p>
            </AnimationWrapper>
            
            <AnimationWrapper variant="fadeInUp" delay={0.3}>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      <FiUser />
                    </span>
                    <input
                      type="text"
                      className="form-input pl-10 focus:ring-primary/70 transition-all bg-background/50 backdrop-blur-sm"
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      className="form-input pl-10 focus:ring-primary/70 transition-all bg-background/50 backdrop-blur-sm"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      <FiLock />
                    </span>
                    <input
                      type="password"
                      className="form-input pl-10 focus:ring-primary/70 transition-all bg-background/50 backdrop-blur-sm"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">
                      <FiLock />
                    </span>
                    <input
                      type="password"
                      className="form-input pl-10 focus:ring-primary/70 transition-all bg-background/50 backdrop-blur-sm"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={onChange}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center hover-lift shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse-custom">Registering...</span>
                  ) : (
                    <>
                      Register
                      <FiArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </AnimationWrapper>
            
            <AnimationWrapper variant="fadeIn" delay={0.5}>
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium transition-colors hover:text-primary/80">
                    Log In
                  </Link>
                </p>
              </div>
            </AnimationWrapper>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default RegisterPage; 