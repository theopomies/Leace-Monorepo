import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Navbar } from "./Navbar";
import { Newsletter } from "./Newsletter";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header>
        <Navbar />
      </header>
      <main className="container m-auto">
        <Hero />
        <Newsletter />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
