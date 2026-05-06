import { useState } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { NavigationCards } from './components/NavigationCards';
import { CatalystDirectory } from './components/pages/CatalystDirectory';
import { LeadDirectory } from './components/pages/LeadDirectory';
import { WeeklyCheckIns } from './components/pages/WeeklyCheckIns';
import { InfluenceNetwork } from './components/pages/InfluenceNetwork';
import { CatalystLogs } from './components/pages/CatalystLogs';

// ============================================================================
// 📌 MODULAR DESIGN - ALL COMPONENTS ARE REPLACEABLE
// ============================================================================
// This app is designed for easy integration with external data sources.
// All components accept data via props and can be connected to:
// - Zoho Creator / Zoho Analytics
// - CSV imports
// - API endpoints
// - External map embeds
//
// See individual component files for detailed integration notes.
// ============================================================================

type Page = 'home' | 'directory' | 'leads' | 'checkins' | 'influence' | 'logs';

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Boston');
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Map layer state for iframe parameter passing
  const mapLayers = {
    crews: true,
    catalysts: true,
    conflicts: true,
    incidents: true,
    networks: false,
  };

  if (currentPage === 'directory') {
    return <CatalystDirectory onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'leads') {
    return <LeadDirectory onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'checkins') {
    return <WeeklyCheckIns onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'influence') {
    return <InfluenceNetwork onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'logs') {
    return <CatalystLogs onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header selectedCity={selectedCity} onCityChange={setSelectedCity} />
      <StatsOverview city={selectedCity} />

      <div className="flex-1 overflow-hidden">
        <InteractiveMap city={selectedCity} layers={mapLayers} />
      </div>

      <NavigationCards onNavigate={setCurrentPage} />
    </div>
  );
}