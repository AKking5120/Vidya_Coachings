import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import TeamSection from '@/components/home/TeamSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import LocationsSection from '@/components/home/LocationsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';
import AdmissionSection from '@/components/home/AdmissionSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <TeamSection />
      <ProgramsSection />
      <LocationsSection />
      <ReviewsSection />
      <ContactSection />
      <AdmissionSection />
    </>
  );
}
