import React from 'react';
import { 
  FiltersContainer, 
  FiltersButton, 
  ColumnFilters as StyledColumnFilters, 
  FilterCheckbox, 
  Checkbox 
} from './styled';
import { Column, ColumnKey } from '../types';

interface Props {
  columns: Column[];
  visibleColumns: ColumnKey[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onToggleColumn: (key: ColumnKey) => void;
}

export const ColumnFilters: React.FC<Props> = ({
  columns,
  visibleColumns,
  showFilters,
  onToggleFilters,
  onToggleColumn,
}) => {
  return (
    <FiltersContainer className="filters-container">
      <FiltersButton onClick={onToggleFilters}>
        <span>Фильтры</span>
        <span>{visibleColumns.length}/{columns.length}</span>
      </FiltersButton>
      <StyledColumnFilters $isVisible={showFilters}>
        {columns.map(column => (
          <FilterCheckbox key={column.key}>
            <Checkbox
              type="checkbox"
              checked={visibleColumns.includes(column.key)}
              onChange={() => onToggleColumn(column.key)}
            />
            {typeof column.title === 'string' ? column.title : 'Мест для N% наград'}
          </FilterCheckbox>
        ))}
      </StyledColumnFilters>
    </FiltersContainer>
  );
}; 