"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg pt-16">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-yellow opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full px-4 py-2 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-accent-cyan" />
                        <span className="text-accent-cyan text-sm font-medium">Semester 6 Edition</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
                    >
                        Semester 6 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-yellow">
                            Timetable Generator
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Create your personalized timetable effortlessly. Fast, clean, and conflict-free scheduling for UOL students.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/generator"
                            className="group relative px-8 py-4 bg-accent-cyan text-dark-bg font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-cyan/50 flex items-center space-x-2"
                        >
                            <span>Generate Timetable</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <a
                            href="#about"
                            className="px-8 py-4 glass-card text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-accent-yellow/50"
                        >
                            About Creator
                        </a>
                    </motion.div>

                    {/* Stats or Features Preview */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    >
                        {[
                            { label: "Fast Generation", value: "< 1s" },
                            { label: "Conflict Detection", value: "100%" },
                            { label: "Export Formats", value: "PNG/PDF" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-accent-cyan mb-2">{stat.value}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
