import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiClipboard,
  FiStar,
  FiCalendar,
  FiMessageSquare,
  FiSmartphone,
  FiArrowRight,
} from "react-icons/fi";
import GradientBackground from "../components/ui/GradientBackground";
import AnimationWrapper from "../components/ui/AnimationWrapper";

// Feature data
const mainFeatures = [
  {
    title: "User Management",
    icon: <FiUsers className="text-primary text-2xl" />,
    description:
      "Easily manage member accounts, track attendance, and monitor progress with our intuitive user dashboard.",
  },
  {
    title: "Workout Plans",
    icon: <FiActivity className="text-primary text-2xl" />,
    description:
      "Create customized workout plans tailored to each member's goals and fitness level with our easy-to-use workout builder.",
  },
  {
    title: "Progress Tracking",
    icon: <FiBarChart2 className="text-primary text-2xl" />,
    description:
      "Track progress with visual charts and detailed analytics to help members stay motivated and accountable.",
  },
  {
    title: "Diet Planning",
    icon: <FiClipboard className="text-primary text-2xl" />,
    description:
      "Create and assign diet plans to complement workout regimens for maximum results and overall wellness.",
  },
];

const additionalFeatures = [
  {
    title: "Class Scheduling",
    icon: <FiCalendar className="text-primary text-2xl" />,
    description:
      "Manage group classes and personal training sessions with our intuitive scheduling system.",
  },
  {
    title: "Performance Metrics",
    icon: <FiStar className="text-primary text-2xl" />,
    description:
      "Set goals and track performance with detailed metrics and visual progress indicators.",
  },
  {
    title: "Communication Tools",
    icon: <FiMessageSquare className="text-primary text-2xl" />,
    description:
      "Stay connected with members through in-app messaging, notifications, and automated reminders.",
  },
  {
    title: "Mobile Application",
    icon: <FiSmartphone className="text-primary text-2xl" />,
    description:
      "Access all features on the go with our fully-featured mobile application for iOS and Android.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] flex flex-col justify-center items-center overflow-hidden">
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

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <AnimationWrapper variant="fadeInUp" className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Powerful Features for Your Fitness Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover all the tools you need to transform your fitness
              experience and achieve your goals.
            </p>
          </AnimationWrapper>
        </div>
      </div>

      {/* Main Features Section */}
      <section className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a comprehensive set of tools designed to
              enhance your fitness experience.
            </p>
          </AnimationWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <AnimationWrapper
                key={feature.title}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <div className="h-full bg-card glass-effect backdrop-blur-sm text-card-foreground p-8 rounded-xl border border-border/30 shadow-md">
                  <div className="bg-primary/10 text-primary p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section with Gradient Background */}
      <GradientBackground intensity="low" variant="teal" className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beyond the basics, our platform offers premium features to take
              your fitness to the next level.
            </p>
          </AnimationWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <AnimationWrapper
                key={feature.title}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <div className="h-full bg-card glass-effect backdrop-blur-sm text-card-foreground p-8 rounded-xl border border-border/30 shadow-md">
                  <div className="bg-primary/10 text-primary p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* Feature Highlight Section */}
      <section className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimationWrapper variant="fadeInLeft">
              <div className="rounded-xl overflow-hidden shadow-xl border border-border">
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Workout tracking"
                  className="w-full h-auto"
                />
              </div>
            </AnimationWrapper>

            <AnimationWrapper variant="fadeInRight">
              <h2 className="text-3xl font-bold mb-6">
                Advanced Workout Tracking
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our advanced workout tracking system allows you to monitor your
                progress in real-time, set goals, and celebrate achievements.
              </p>
              <ul className="space-y-4">
                {[
                  "Track sets, reps, and weights with customizable templates",
                  "Monitor your progress with visual charts and analytics",
                  "Set personal records and get notifications when you beat them",
                  "Share your achievements with friends and training partners",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                      <FiStar className="text-primary" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimationWrapper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GradientBackground
        intensity="medium"
        variant="primary"
        className="py-16"
      >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper
            variant="fadeInUp"
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of users who have already transformed their fitness
              journey with our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="btn btn-primary flex items-center justify-center px-8 py-3 rounded-full"
                >
                  Sign Up Now <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/pricing"
                  className="btn btn-outline flex items-center justify-center px-8 py-3 rounded-full"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </AnimationWrapper>
        </div>
      </GradientBackground>
    </div>
  );
};

export default FeaturesPage;
