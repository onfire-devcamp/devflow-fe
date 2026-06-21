import Navbar from './components/Navbar';
import Hero from './components/HeroSection';
import Features from './components/FeaturesSection';
import Projects from './components/ProjectsSection';
import Stats from './components/StatsSection';
import Testimonials from './components/TestimonialsSection';
import CTA from './components/CTASection';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Projects />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
