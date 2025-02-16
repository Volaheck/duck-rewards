import styled from 'styled-components';

export const SingleColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

export const ChartContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`; 