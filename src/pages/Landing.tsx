import Community from "@/components/Community";
import Download from "@/components/Download";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import { AnimatePresence } from "framer-motion";

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        <Header />
        <Hero />
        <Features />
        <HowItWorks/>
        <Community />
        <Download />
        <Footer />
      </AnimatePresence>
    </div>
  );
}

export default Landing;