"use client"

import { motion } from "framer-motion"
import { Zap, Calendar, Target, Download } from "lucide-react"

const features = [
    {
        icon: Zap,
        title: "Fast Generation",
        description: "Generate your complete timetable in seconds with our optimized algorithm.",
    },
    {
        icon: Calendar,
        title: "Clean Schedule Output",
        description: "Beautiful, easy-to-read timetable layouts that work on any device.",
    },
    {
        icon: Target,
        title: "Section-wise Filtering",
        description: "Choose your section and get a perfectly tailored schedule instantly.",
    },
    {
        icon: Download,
        title: "Download / Export Ready",
        description: "Export your timetable as PNG or PDF for easy sharing and printing.",
    },
]

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-dark-bg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-cyan to-accent-yellow"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Powerful <span className="text-accent-cyan">Features</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to create the perfect timetable for your semester
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="glass-card p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-accent-cyan/20 group"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-accent-yellow rounded-lg flex items-center justify-center group-hover:animate-glow">
                                        <feature.icon className="w-6 h-6 text-dark-bg" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
