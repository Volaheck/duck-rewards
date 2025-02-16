import styled from 'styled-components';

export const TableWrapper = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
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

export const SubTitle = styled.h3`
  margin: 0 0 15px 0;
  text-align: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DeleteButton = styled.button`
  padding: 4px 8px;
  background: none;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #fff1f0;
  }
`;

export const StatsToggleButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;

  &:hover {
    color: #333;
  }
`; 