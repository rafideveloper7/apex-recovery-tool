import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import MetricGrid from "../components/MetricGrid";
import GaugeRow from "../components/GaugeRow";
import ScoreCard from "../components/ScoreCard";
import ChartCard from "../components/ChartCard";
import Forecast from "../components/Forecast";
import SignalList from "../components/SignalList";
import RecoveryCard from "../components/RecoveryCard";
import MobileNav from "../components/MobileNav";

export default function Home() {
  return (
    <main id="app">
      <Navbar />
      <Hero />
      
      <div className="w-full h-[fit-content] content bg-white">
        <StatsBar />
        <MetricGrid />
        <GaugeRow />
        <ScoreCard />
        <ChartCard title="7-day burnout trajectory" subtitle="Risk score — Monday to Sunday" data={[]} />
        <Forecast />
        <ChartCard title="Biometric radar — Current vs Baseline" subtitle="5-axis wellness comparison" type="radar" data={[]} />
        <SignalList />
        <RecoveryCard />
      </div>
      
      <MobileNav />
    </main>
  );
}