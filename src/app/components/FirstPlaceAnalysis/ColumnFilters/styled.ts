import styled from 'styled-components';
import { CheckboxContainer } from '../styled';

export const FiltersContainer = styled.div`
  position: relative;
  margin-left: 10px;
`;

export const FiltersButton = styled.button`
  padding: 4px 8px;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const ColumnFilters = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: ${props => props.$isVisible ? 'grid' : 'none'};
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  z-index: 1000;
  min-width: 300px;
`;

export const FilterCheckbox = styled(CheckboxContainer)`
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const Checkbox = styled.input`
  cursor: pointer;
`; 