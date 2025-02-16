import React from 'react';
import { 
  FiltersContainer, 
  FiltersButton, 
  ColumnFilters as StyledColumnFilters, 
  FilterCheckbox, 
  Checkbox 
} from './styled';

interface Props<T extends string> {
  columns: { key: T; title: string | React.ReactNode }[];
  visibleColumns: T[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onToggleColumn: (key: T) => void;
}

export const ColumnFilters = <T extends string>({
  columns,
  visibleColumns,
  showFilters,
  onToggleFilters,
  onToggleColumn,
}: Props<T>) => {
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