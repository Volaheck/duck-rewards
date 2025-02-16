import { useState } from 'react';
import { 
  HeaderContainer, 
  Title, 
  InputForm, 
  Input, 
  Button,
  CheckboxContainer,
  Checkbox
} from './styled';

interface HeaderProps {
  onAddDistribution: (places: number) => void;
  onShowOnlyFirstPlace: (show: boolean) => void;
}

export const Header = ({ onAddDistribution, onShowOnlyFirstPlace }: HeaderProps) => {
  const [newPlaces, setNewPlaces] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const places = parseInt(newPlaces);
    if (isNaN(places) || places < 1) {
      alert("Пожалуйста, введите положительное число");
      return;
    }
    onAddDistribution(places);
    setNewPlaces("");
  };

  return (
    <HeaderContainer>
      <Title>Анализ распределения наград</Title>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <InputForm onSubmit={handleSubmit}>
          <Input
            type="number"
            value={newPlaces}
            onChange={(e) => setNewPlaces(e.target.value)}
            placeholder="Введите количество мест"
            min="1"
          />
          <Button type="submit">Добавить таблицу</Button>
        </InputForm>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            onChange={(e) => onShowOnlyFirstPlace(e.target.checked)}
          />
          Показать только первое место
        </CheckboxContainer>
      </div>
    </HeaderContainer>
  );
}; 