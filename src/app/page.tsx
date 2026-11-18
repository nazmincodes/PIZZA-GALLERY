import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedPizzas from "@/components/home/FeaturedPizzas";
import PartnerCTA from "@/components/home/PartnerCTA";
import Testimonials from "@/components/home/Testimonials";


export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedPizzas />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <PartnerCTA />

      </main>
    </>
  );
}