'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'backOut' as const,
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-40 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{
            y: [-30, 30, -30],
            x: [20, -20, 20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1.5,
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="text-center max-w-4xl">
          {/* Logo / Icon */}
          <motion.div
            className="mb-8 flex justify-center"
            variants={bubbleVariants}
          >
            <motion.div
              className="p-6 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 relative"
              animate="float"
              variants={floatingVariants}
              whileHover={{ scale: 1.15 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full blur opacity-75 animate-pulse"
                style={{ animationDuration: '3s' }}
              />
              <svg
                className="w-16 h-16 text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 5v2m-4 3.5V7m4 6.5v2m4 3.5V16M9 17h6M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 leading-tight"
            variants={itemVariants}
          >
            Welcome to{' '}
            <span className="inline-block relative">
              GitTix
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded blur opacity-50 -z-10"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-cyan-100 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            ✨ The Future of Ticket Marketplaces ✨
            <br />
            <span className="text-purple-300">Secure • Fast • Futuristic</span>
          </motion.p>

          {/* Feature bubbles */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              { icon: '🎫', title: 'Browse Tickets', description: 'Explore thousands of events', color: 'from-cyan-500 to-blue-500' },
              { icon: '🛡️', title: 'Secure Payments', description: 'Safe and encrypted transactions', color: 'from-purple-500 to-pink-500' },
              { icon: '⚡', title: 'Instant Delivery', description: 'Get your tickets immediately', color: 'from-pink-500 to-orange-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`p-8 bg-gradient-to-br ${feature.color} rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm hover:border-white/40 group relative overflow-hidden`}
                variants={bubbleVariants}
                whileHover="hover"
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-all"
                />
                <div className="relative z-10">
                  <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/90 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link href="/tickets">
                <motion.button
                  className="px-8 py-4 text-lg font-bold rounded-2xl shadow-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-2xl hover:shadow-cyan-500/50 border border-white/20"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Browse Tickets
                </motion.button>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/tickets/new">
                <motion.button
                  className="px-8 py-4 text-lg font-bold rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-pink-500/50 border border-white/20"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Sell Tickets
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats with bubbles */}
          <motion.div
            className="mt-16 pt-12 grid grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { label: 'Active Users', value: '10K+', icon: '👥' },
              { label: 'Tickets Sold', value: '50K+', icon: '🎟️' },
              { label: 'Events Listed', value: '5K+', icon: '🎭' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={bubbleVariants}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-purple-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent via-slate-800/50 to-transparent border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full border border-cyan-400/50"
            >
              <span className="text-cyan-300 text-sm font-bold">✨ WHY GITTIX?</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-6">
              Why Choose GitTix?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-purple-200 max-w-2xl mx-auto">
              Experience the most trusted and futuristic platform for ticket transactions
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '🔐', title: 'Secure', desc: 'End-to-end encryption' },
              { icon: '⚡', title: 'Fast', desc: 'Instant delivery' },
              { icon: '🌍', title: 'Global', desc: 'Any event, anywhere' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Transparent fees' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={bubbleVariants}
                whileHover={{ y: -8 }}
                className="p-6 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-3xl border border-cyan-400/30 hover:border-cyan-400/70 backdrop-blur-sm hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group"
              >
                <motion.div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</motion.div>
                <h3 className="text-xl font-bold text-cyan-300 mb-2">{item.title}</h3>
                <p className="text-purple-200">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full border border-pink-400/50"
            >
              <span className="text-pink-300 text-sm font-bold">🚀 HOW IT WORKS</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6">
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-2"
          >
            {[
              { num: '1', title: 'Browse', desc: 'Search for events', icon: '🔍' },
              { num: '2', title: 'Select', desc: 'Choose your tickets', icon: '✅' },
              { num: '3', title: 'Pay', desc: 'Secure checkout', icon: '💳' },
              { num: '4', title: 'Receive', desc: 'Get your tickets', icon: '🎉' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={bubbleVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-white flex flex-col items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-cyan-500/50 cursor-pointer relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity -z-10" />
                  <span className="relative z-10 text-4xl mb-1">{item.icon}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-cyan-300 mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
                {i < 3 && (
                  <motion.div
                    className="absolute top-12 -right-6 md:top-24 md:right-auto md:-bottom-12 text-2xl hidden md:block text-purple-400"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent via-slate-800/50 to-transparent border-y border-pink-500/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border-purple-400/50"
            >
              <span className="text-purple-300 text-sm font-bold">🌟 AMAZING FEATURES</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              Packed with Features
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              { title: '⚡ Real-time Updates', desc: 'Track your tickets and orders instantly' },
              { title: '✔️ Verified Sellers', desc: 'All sellers are verified for your safety' },
              { title: '🎯 Price Protection', desc: 'Best price guarantee on all tickets' },
              { title: '🎧 24/7 Support', desc: 'Dedicated support team always ready' },
              { title: '📱 Mobile Friendly', desc: 'Manage tickets on any device' },
              { title: '💎 Digital Wallet', desc: 'Save payment methods securely' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={bubbleVariants}
                className="p-8 border-l-4 border-l-cyan-400 bg-gradient-to-br from-cyan-500/5 to-pink-500/5 rounded-2xl hover:shadow-xl hover:shadow-cyan-500/20 transition-all backdrop-blur-sm group relative overflow-hidden"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-pink-400/0 group-hover:from-cyan-400/10 group-hover:to-pink-400/10 transition-all" />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-3 relative z-10">{item.title}</h3>
                <p className="text-purple-200 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full border border-orange-400/50"
            >
              <span className="text-orange-300 text-sm font-bold">🗺️ FUTURE ROADMAP</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-4">
              Future Roadmap
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-purple-200">
              Exciting features coming soon! 🚀
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: '🎭', title: 'Q1 2026', items: ['📱 Mobile App', '🎨 NFT Tickets'], color: 'from-cyan-500 to-blue-500' },
              { icon: '🚀', title: 'Q2 2026', items: ['🔌 API Integration', '🏪 Reseller Portal'], color: 'from-purple-500 to-pink-500' },
              { icon: '🌟', title: 'Q3 2026', items: ['🤖 AI Recommendations', '🤝 Social Sharing'], color: 'from-pink-500 to-orange-500' },
            ].map((quarter, i) => (
              <motion.div
                key={i}
                variants={bubbleVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-8 bg-gradient-to-br ${quarter.color} rounded-3xl border border-white/20 backdrop-blur-sm hover:border-white/50 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden`}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-all" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{quarter.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-6">{quarter.title}</h3>
                  <ul className="space-y-3">
                    {quarter.items.map((item, j) => (
                      <li key={j} className="flex items-center text-white">
                        <motion.span
                          className="w-3 h-3 bg-white rounded-full mr-3"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Join the Future? 🚀
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-cyan-100 mb-12 max-w-2xl mx-auto">
              Start buying and selling tickets on GitTix today. Experience the future of ticket marketplaces!
            </motion.p>
            <motion.div variants={containerVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div variants={itemVariants}>
                <Link href="/tickets">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-cyan-600 font-bold text-lg rounded-2xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-2xl border border-white/50"
                  >
                    🎫 Browse Tickets
                  </motion.button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm shadow-lg hover:shadow-2xl"
                  >
                    ✨ Join Now
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <svg
          className="w-6 h-6 text-primary-600 dark:text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </div>
  );
}
