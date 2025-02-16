import styled from 'styled-components';

export const TableWrapper = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  grid-column: 1 / -1;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Title = styled.h3`
  margin: 0;
`;

export const ToggleButton = styled.button`
  padding: 4px 8px;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: #f4f4f4;
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

export const InputForm = styled.div`
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100px;
`;

export const ClickableTh = styled(Th)`
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const SingleColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
`;


export const SingleColumnView = styled.div<{ $isKeyPoint: boolean }>`
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  background-color: ${props => props.$isKeyPoint ? '#f0f8ff' : '#f8f8f8'};
  border-radius: 4px;
  font-weight: ${props => props.$isKeyPoint ? 'bold' : 'normal'};
`;

export const ColumnLabel = styled.span`
  font-weight: bold;
`;

export const ColumnValue = styled.span`
  font-family: monospace;
`;

export const BackButton = styled.button`
  padding: 2px 6px;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const Checkbox = styled.input`
  cursor: pointer;
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

export const FiltersContainer = styled.div`
  position: relative;
  margin-left: 10px;
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

export const ChartContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

export const SingleColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;