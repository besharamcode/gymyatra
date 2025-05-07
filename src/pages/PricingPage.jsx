import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiArrowRight } from "react-icons/fi";
import GradientBackground from "../components/ui/GradientBackground";
import AnimationWrapper from "../components/ui/AnimationWrapper";

// Pricing data
const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals just starting their fitness journey",
    price: {
      monthly: "$29",
      yearly: "$290",
    },
    features: [
      { name: "User management", included: true },
      { name: "Basic workout plans", included: true },
      { name: "Progress tracking", included: true },
      { name: "Basic analytics", included: true },
      { name: "Email support", included: true },
      { name: "Diet planning", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "Ideal for fitness enthusiasts looking for advanced features",
    price: {
      monthly: "$49",
      yearly: "$490",
    },
    features: [
      { name: "User management", included: true },
      { name: "Advanced workout plans", included: true },
      { name: "Progress tracking", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Email & chat support", included: true },
      { name: "Diet planning", included: true },
      { name: "Custom branding", included: true },
      { name: "API access", included: false },
    ],
    buttonText: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For professional gyms and fitness centers",
    price: {
      monthly: "$99",
      yearly: "$990",
    },
    features: [
      { name: "User management", included: true },
      { name: "Advanced workout plans", included: true },
      { name: "Progress tracking", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "Diet planning", included: true },
      { name: "Custom branding", included: true },
      { name: "API access", included: true },
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all plans come with a 14-day free trial. No credit card required to try out our platform.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your billing period.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees or hidden charges for any of our plans.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.",
  },
];

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center space-x-4 mb-12">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <div className="relative">
                <span
                  className="absolute -top-8 right-0 bg-primary/20 text-primary text-xs px-2 py-1 rounded-md"
                >
                  Save 20%
                </span>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingCycle === "yearly"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80"
                  }`}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="py-16 -mt-12">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <AnimationWrapper
                key={plan.name}
                variant="fadeInUp"
                delay={0.1 * index}
              >
                <div
                  className={`h-full bg-card glass-effect backdrop-blur-sm text-card-foreground p-8 rounded-xl border ${
                    plan.popular ? "border-primary" : "border-border/30"
                  } ${
                    plan.popular ? "shadow-xl" : "shadow-md"
                  } flex flex-col relative`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rounded-md">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {billingCycle === "monthly"
                        ? plan.price.monthly
                        : plan.price.yearly}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex items-start text-sm"
                      >
                        {feature.included ? (
                          <FiCheck className="text-primary mr-2 mt-1 flex-shrink-0" />
                        ) : (
                          <FiX className="text-muted-foreground mr-2 mt-1 flex-shrink-0" />
                        )}
                        <span
                          className={
                            !feature.included ? "text-muted-foreground" : ""
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.buttonText === "Contact Sales" ? "/contact" : "/register"}
                    className={`${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-background/50 backdrop-blur-sm border border-border text-foreground hover:bg-background/80"
                    } font-semibold py-3 px-6 rounded-full text-center transition-colors w-full flex items-center justify-center`}
                  >
                    {plan.buttonText}
                    {plan.buttonText !== "Contact Sales" && (
                      <FiArrowRight className="ml-2" />
                    )}
                  </Link>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <GradientBackground intensity="low" variant="teal" className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pricing and plans.
            </p>
          </AnimationWrapper>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <AnimationWrapper
                  key={index}
                  variant="fadeInUp"
                  delay={0.05 * index}
                >
                  <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </AnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </GradientBackground>

      {/* CTA Section */}
      <section className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <AnimationWrapper variant="fadeInUp" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Start your 14-day free trial today. No credit card required.
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
                  Get Started <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="btn btn-outline flex items-center justify-center px-8 py-3 rounded-full"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
};

export default PricingPage; 