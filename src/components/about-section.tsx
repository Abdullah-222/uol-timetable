"use client"

import { motion } from "framer-motion"
import { Code2, Heart, Sparkles } from "lucide-react"

export default function AboutSection() {
    return (
        <section id="about" className="py-20 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-yellow opacity-5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Built By <span className="text-accent-yellow">Abdullah</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card p-8 sm:p-12 rounded-2xl"
                >
                    <div className="space-y-6 text-center">
                        {/* Profile Image Place */}
                        <div className="flex justify-center mb-6">
                            <div className="md:w-56 md:h-56 w-40 h-40 bg-gradient-to-br from-accent-cyan to-accent-yellow rounded-full flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-xl relative">
                                <img src="/own-pic.jpeg" alt="Abdullah" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 text-gray-300 text-lg">
                            <div className="flex items-center justify-center space-x-2">
                                <Sparkles className="w-5 h-5 text-accent-cyan" />
                                <p className="font-semibold text-white">Full Stack Developer</p>
                            </div>

                            <p>
                                I built this tool to help students generate their timetables easily and efficiently.
                                No more manual scheduling or time conflicts!
                            </p>

                            <div className="flex items-center justify-center space-x-2 pt-4">
                                <Heart className="w-5 h-5 text-accent-yellow" />
                                <p className="font-medium text-white">
                                    Passionate about clean UI + real-world tools
                                </p>
                            </div>

                            <p className="text-gray-400 italic">
                                "Making student life easier, one timetable at a time."
                            </p>
                        </div>

                        {/* Optional: Add social links or contact info here */}
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-gray-400 text-sm">
                                Have feedback or suggestions? Feel free to reach out!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
