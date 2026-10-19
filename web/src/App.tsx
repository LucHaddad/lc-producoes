import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Montagem from "./components/Montagem";
import Footer from "./components/Footer";
import VideoBackground from "./components/VideoBackground";

function App() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSelectService = (serviceName: string) => {
    setSelectedServices([serviceName]);
    const target = document.getElementById("orcamento");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <VideoBackground />
      <Header />
      <Hero />
      <Services onSelectService={handleSelectService} />
      <Montagem
        selectedServices={selectedServices}
        onSelectServices={setSelectedServices}
      />
      <Footer />
    </>
  );
}

export default App;
