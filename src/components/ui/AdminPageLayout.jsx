import React from "react";
import { motion } from "framer-motion";
import GradientBackground from "./GradientBackground";
import AnimationWrapper from "./AnimationWrapper";

const AdminPageLayout = ({
  children,
  title,
  description,
  gradient = "teal",
  headerHeight = "20vh",
}) => {
  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      <div className={`relative min-h-[${headerHeight}] flex flex-col justify-center overflow-hidden`}>
        <GradientBackground
          intensity="low"
          variant={gradient}
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

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <AnimationWrapper variant="fadeInUp">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {description}
            </p>
          </AnimationWrapper>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 pb-16 relative z-10">
        <AnimationWrapper variant="fadeInUp">
          {children}
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default AdminPageLayout; 