import { Navbar } from "./Navbar";
import { Newsletter } from "./Newsletter";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header>
        <Navbar />
      </header>
      <main className="container m-auto">
        <Newsletter />
      </main>
    </div>
  );
}
