import Navbar from '../components/Navbar';
import Hero from '../components/HeroSection';
import Features from '../components/FeaturesSection';
import Testimonials from '../components/TestimonialsSection';
import CTA from '../components/CTASection';

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Testimonials />
            <CTA />
        </>
    );
}