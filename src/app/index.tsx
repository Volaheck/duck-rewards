import { useState } from "react";
import { AppContainer, TablesGrid } from './styled';
import { Header } from './components/Header';
import { RewardTable } from './components/RewardTable';
import { FirstPlaceAnalysis } from './components/FirstPlaceAnalysis';

export const App = () => {
  const [distributions, setDistributions] = useState<number[]>([]);
  const [showOnlyFirstPlace, setShowOnlyFirstPlace] = useState(false);

  const handleAddDistribution = (places: number) => {
    setDistributions(prev => [...prev, places]);
  };

  return (
    <AppContainer>
      <Header 
        onAddDistribution={handleAddDistribution}
        onShowOnlyFirstPlace={setShowOnlyFirstPlace}
      />
      <TablesGrid>
        <FirstPlaceAnalysis />
        {distributions.map(places => (
          <RewardTable 
            key={places} 
            places={places}
            showOnlyFirstPlace={showOnlyFirstPlace}
          />
        ))}
      </TablesGrid>
    </AppContainer>
  );
}; 