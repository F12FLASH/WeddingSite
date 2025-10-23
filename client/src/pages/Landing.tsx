import Hero from "@/components/Hero";
import About from "@/components/About";
import Schedule from "@/components/Schedule";
import Gallery from "@/components/Gallery";
import Messages from "@/components/Messages";
import RSVP from "@/components/RSVP";
import Location from "@/components/Location";
import Registry from "@/components/Registry";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export default function Landing() {
  return (
    <div className="min-h-screen scroll-smooth" id="home">
      <Navigation />
      <Hero />
      <About />
      <Schedule />
      <Gallery />
      <Messages />
      <RSVP />
      <Location />
      <Registry />
      <Footer />
      <MusicPlayer />
    </div>
  );
}
