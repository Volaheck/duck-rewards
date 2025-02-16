import { useState } from "react";
import { AppContainer, TablesGrid } from './styled';
import { Header } from './components/Header';
import { RewardTable } from './components/RewardTable';
import { FirstPlaceAnalysis } from './components/FirstPlaceAnalysis';

export const App = () => {
  const [distributions, setDistributions] = useState<number[]>([]);
  const [showOnlyFirstPlace, setShowOnlyFirstPlace] = useState(false);

  const handleDelete = (places: number) => {
    setDistributions(prev => prev.filter(p => p !== places));
  };

  return (
    <AppContainer>
      <Header 
        onAddDistribution={(places) => setDistributions(prev => [...prev, places])}
        onShowOnlyFirstPlace={setShowOnlyFirstPlace}
      />
      <TablesGrid>
        <FirstPlaceAnalysis />
        {distributions.map((places, index) => (
          <RewardTable 
            key={`table_${places}_${index}`}
            places={places}
            showOnlyFirstPlace={showOnlyFirstPlace}
            onDelete={() => handleDelete(places)}
          />
        ))}
      </TablesGrid>
    </AppContainer>
  );
}; 