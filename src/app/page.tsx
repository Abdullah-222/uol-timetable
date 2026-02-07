import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import AboutSection from "@/components/about-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </main>
  )
}
