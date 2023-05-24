import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Navbar } from "./Navbar";
import { Newsletter } from "./Newsletter";
import { Roadmap } from "./Roadmap";
import { TeamSlider } from "./TeamSlider";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <Roadmap />
        <TeamSlider />
        <Newsletter />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
