import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { login, reset } from "../redux/authSlice";
import { motion } from "framer-motion";
import GradientBackground from "../components/ui/GradientBackground";
import AnimationWrapper, {
  animationVariants,
} from "../components/ui/AnimationWrapper";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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
      navigate(
        user?.user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
      );
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

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      {/* Hero Section with enhanced header */}
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <GradientBackground
          intensity="medium"
          variant="primary"
          className="absolute inset-0 z-0"
        />

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
                Welcome Back
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                Log in to access your account
              </p>
            </AnimationWrapper>

            <AnimationWrapper variant="fadeInUp" delay={0.3}>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="email"
                  >
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

                <div className="mb-6">
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="password"
                  >
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

                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center hover-lift shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse-custom">Logging in...</span>
                  ) : (
                    <>
                      Log In
                      <FiLogIn className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </AnimationWrapper>

            <AnimationWrapper variant="fadeIn" delay={0.5}>
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:underline font-medium transition-colors hover:text-primary/80"
                  >
                    Register
                  </Link>
                </p>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground/80 hover:text-muted-foreground mt-2 inline-block transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </AnimationWrapper>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default LoginPage;
