import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import GradientBackground from '../components/ui/GradientBackground';
import AnimationWrapper from '../components/ui/AnimationWrapper';

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <GradientBackground intensity="medium" variant="teal" className="absolute inset-0 z-0" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-1/4 right-[20%] w-16 h-16 rounded-2xl border border-primary/20 bg-primary/5"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-[15%] w-12 h-12 rounded-full border border-purple-500/20 bg-purple-500/5"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative z-10">
        <AnimationWrapper variant="fadeInDown" delay={0.1}>
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        </AnimationWrapper>
        
        <AnimationWrapper variant="fadeInUp" delay={0.2}>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        </AnimationWrapper>
        
        <AnimationWrapper variant="fadeIn" delay={0.3}>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </AnimationWrapper>
        
        <AnimationWrapper variant="scaleUp" delay={0.4}>
          <Link to="/" className="btn btn-primary flex items-center hover-lift">
            <FiArrowLeft className="mr-2" /> Go Back Home
          </Link>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default NotFound; 