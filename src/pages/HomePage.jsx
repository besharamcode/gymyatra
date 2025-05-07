import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiClipboard,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiPlay,
} from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimationWrapper, {
  animationVariants,
} from "../components/ui/AnimationWrapper";
import GradientBackground from "../components/ui/GradientBackground";
import TiltCard from "../components/ui/TiltCard";

const features = [
  {
    title: "User Management",
    icon: <FiUsers className="text-primary text-2xl" />,
    description:
      "Easily manage member accounts, track attendance, and monitor progress.",
  },
  {
    title: "Workout Plans",
    icon: <FiActivity className="text-primary text-2xl" />,
    description:
      "Create customized workout plans tailored to each member's goals and fitness level.",
  },
  {
    title: "Progress Tracking",
    icon: <FiBarChart2 className="text-primary text-2xl" />,
    description:
      "Track progress with visual charts to help members stay motivated and accountable.",
  },
  {
    title: "Diet Planning",
    icon: <FiClipboard className="text-primary text-2xl" />,
    description:
      "Create and assign diet plans to complement workout regimens for maximum results.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Gym Owner",
    content:
      "GymYatra has transformed how we manage our gym. Member engagement is up by 40%!",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Michael Chen",
    role: "Personal Trainer",
    content:
      "Creating workout plans for my clients has never been easier. The progress tracking features are a game changer.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Enthusiast",
    content:
      "I love being able to track my progress and see my improvements visually. It keeps me motivated!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "per month",
    features: [
      "User management",
      "Workout planning",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Basic",
      "Diet planning",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Everything in Pro",
      "Multiple locations",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const HomePage = () => {
  // Refs for scroll-based animations
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Transform values based on scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Particle animation for hero section
  useEffect(() => {
    if (!heroRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const particles = [];

    const initParticles = () => {
      canvas.width = window.innerWidth;
      canvas.height = heroRef.current.offsetHeight;

      // Create particles
      particles.length = 0;
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.15})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
        });
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    };

    // Setup canvas
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";

    heroRef.current.appendChild(canvas);
    initParticles();
    animate();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (heroRef.current && heroRef.current.contains(canvas)) {
        heroRef.current.removeChild(canvas);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      {/* Hero Section with enhanced header */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        <GradientBackground
          intensity="medium"
          variant="primary"
          className="absolute inset-0 z-0"
        />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 right-[10%] w-16 h-16 rounded-2xl border border-primary/20 bg-primary/5"
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
          className="absolute bottom-1/4 left-[15%] w-10 h-10 rounded-full border border-purple-500/20 bg-purple-500/5"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute top-1/3 left-[8%] w-20 h-20 rounded-full border border-primary/20 bg-primary/5"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32"
        >
          <AnimationWrapper
            variant="fadeInUp"
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.div style={{ scale: heroScale }} className="mb-6">
              <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                The Ultimate Fitness Platform
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
                Transform Your Fitness Journey With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary inline-block animate-gradient">
                  GymYatra
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-muted-foreground">
                The ultimate gym management platform to track workouts, monitor
                progress, and achieve fitness goals with ease.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <Link
                  to="/register"
                  className="relative bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center"
                >
                  <span>Get Started Now</span>
                  <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="#features"
                  className="relative bg-background/50 backdrop-blur-sm text-foreground border border-border hover:bg-background/80 font-semibold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center"
                >
                  <FiPlay className="mr-2 text-primary" />
                  <span>Watch Demo</span>
                </Link>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="flex flex-col items-center mt-12 cursor-pointer"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm text-muted-foreground mb-2">
                Discover More
              </span>
              <FiChevronDown className="text-primary h-6 w-6" />
            </motion.div>
          </AnimationWrapper>

          {/* Hero Image - Enhanced with shadow and glow */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mt-10 sm:mt-20 max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl transform -rotate-3"></div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card/80 backdrop-blur-sm relative z-10">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                alt="GymYatra Dashboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-8 md:gap-16 py-6 px-6 bg-card/80 backdrop-blur-md border border-border rounded-xl mx-auto max-w-4xl relative -mt-16 z-20"
            >
              {[
                { label: "Active Users", value: "10K+" },
                { label: "Workout Plans", value: "500+" },
                { label: "Fitness Trainers", value: "100+" },
                { label: "Success Rate", value: "95%" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Gyms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your gym and help your members
              achieve their fitness goals.
            </p>
          </AnimationWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <AnimationWrapper
                key={feature.title}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <TiltCard className="h-full bg-card text-card-foreground p-8 rounded-2xl border border-border">
                  <div className="bg-primary/10 text-primary p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </TiltCard>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <GradientBackground
        intensity="low"
        variant="teal"
        className="py-20 md:py-32"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Fitness Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about GymYatra
            </p>
          </AnimationWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimationWrapper
                key={testimonial.name}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <div className="bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-lg relative">
                  <div className="mb-6">
                    <svg
                      className="text-primary h-10 w-10 absolute -top-5 -left-2"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <p className="mb-6 text-lg">{testimonial.content}</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-primary"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* Pricing Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your gym
            </p>
          </AnimationWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <AnimationWrapper
                key={plan.name}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <div
                  className={`bg-card text-card-foreground p-8 rounded-2xl border ${
                    plan.popular ? "border-primary" : "border-border"
                  } h-full flex flex-col relative ${
                    plan.popular ? "shadow-xl" : "shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rounded-md">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start mb-3">
                        <FiCheck className="text-primary mr-2 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={`${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-background border border-border text-foreground hover:bg-background/80"
                    } font-semibold py-3 px-6 rounded-full text-center transition-colors w-full`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GradientBackground intensity="medium" variant="purple" className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper
            variant="fadeInUp"
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to Transform Your Gym Management?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Join GymYatra today and take your fitness business to the next
              level with powerful management tools and effortless tracking.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-4 px-8 rounded-full text-lg transition-colors inline-flex items-center"
              >
                Start Your Free Trial <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </AnimationWrapper>
        </div>
      </GradientBackground>
    </div>
  );
};

export default HomePage;
