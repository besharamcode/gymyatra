import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";
import AnimationWrapper from "./AnimationWrapper";

const Footer = () => {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
        { label: "Testimonials", href: "/#testimonials" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Workout Guide", href: "/guides/workout" },
        { label: "Nutrition Tips", href: "/guides/nutrition" },
        { label: "Fitness Calculators", href: "/tools/calculators" },
        { label: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <FiInstagram size={20} />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <FiFacebook size={20} />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <FiTwitter size={20} />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <FiYoutube size={20} />,
      href: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="mx-auto px-4 pt-16 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <AnimationWrapper variant="fadeInUp" className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                GymYatra
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transform your fitness journey with our comprehensive gym
              management and workout tracking platform.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </AnimationWrapper>

          {/* Link Columns */}
          {footerLinks.map((column, idx) => (
            <AnimationWrapper
              key={column.title}
              variant="fadeInUp"
              delay={0.1 * (idx + 1)}
              className="flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                    >
                      <FiChevronRight className="mr-1 text-primary h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimationWrapper>
          ))}
        </div>

        {/* Newsletter Section */}
        <AnimationWrapper variant="fadeInUp" delay={0.4}>
          <div className="border-t border-border pt-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Subscribe to our newsletter
                </h3>
                <p className="text-muted-foreground">
                  Get the latest fitness tips and updates
                </p>
              </div>
              <div className="w-full md:w-auto flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-background border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64 text-foreground placeholder:text-muted-foreground"
                />
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </AnimationWrapper>

        {/* Footer Bottom */}
        <AnimationWrapper variant="fadeInUp" delay={0.5}>
          <div className="border-t border-border pt-6 mt-2 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {year} GymYatra. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              Crafted with <FiHeart className="mx-1 text-red-500" /> for fitness
              enthusiasts
            </p>
          </div>
        </AnimationWrapper>
      </div>
    </footer>
  );
};

export default Footer;
