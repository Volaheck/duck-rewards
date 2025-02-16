import { useState, useMemo, useEffect } from 'react';
import { TableWrapper, Table, Th, Td, SubTitle, HeaderContainer, HeaderActions, DeleteButton, StatsToggleButton } from './styled';
import { analyzeDistribution, getRewardForPlace } from '../../utils/rewards';
import { ColumnFilters } from '../ColumnFilters';
import { RewardTableColumn, RewardTableColumnKey, RewardTableData } from './types';

interface RewardTableProps {
  places: number;
  showOnlyFirstPlace?: boolean;
  onDelete?: () => void;
}

export const RewardTable = ({ places, showOnlyFirstPlace, onDelete }: RewardTableProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<RewardTableColumnKey[]>
    (() => {
      const saved = localStorage.getItem(`columnFilters_${places}`);
      return saved ? JSON.parse(saved) : ['place', 'reward', 'percentage'];
    });
  const [showStats, setShowStats] = useState(false);

  const analysis = analyzeDistribution(places);
  const positions = useMemo(() => 
    showOnlyFirstPlace 
      ? [1] 
      : Array.from({ length: places }, (_, i) => i + 1),
    [places, showOnlyFirstPlace]
  );

  const columns: RewardTableColumn[] = useMemo(() => [
    {
      key: 'place',
      title: 'Место',
      getValue: (data) => data.place,
      format: (value) => `${value}-е место`
    },
    {
      key: 'reward',
      title: 'Награда',
      getValue: (data) => data.reward,
      format: (value) => value.toLocaleString()
    },
    {
      key: 'percentage',
      title: '% от общей суммы',
      getValue: (data) => data.percentage,
      format: (value) => `${value}%`
    }
  ], []);

  const data: RewardTableData[] = useMemo(() => 
    positions.map(pos => ({
      place: pos,
      reward: getRewardForPlace(pos, 0, places),
      percentage: Math.round((getRewardForPlace(pos, 0, places) / analysis.totalReward) * 100)
    })), 
    [positions, places, analysis.totalReward]
  );

  useEffect(() => {
    localStorage.setItem(`columnFilters_${places}`, JSON.stringify(visibleColumns));
  }, [visibleColumns, places]);

  return (
    <TableWrapper>
      <HeaderContainer>
        <SubTitle>Анализ распределения для {places} мест</SubTitle>
        <HeaderActions>
          <ColumnFilters
            columns={columns}
            visibleColumns={visibleColumns}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onToggleColumn={(key) => {
              setVisibleColumns(prev => 
                prev.includes(key)
                  ? prev.filter(k => k !== key)
                  : [...prev, key]
              );
            }}
          />
          <DeleteButton onClick={onDelete}>
            Удалить
          </DeleteButton>
        </HeaderActions>
      </HeaderContainer>

      <Table>
        <thead>
          <tr>
            <Th colSpan={2}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Общая статистика
                <StatsToggleButton onClick={() => setShowStats(!showStats)}>
                  {showStats ? '▼' : '▶'}
                </StatsToggleButton>
              </div>
            </Th>
          </tr>
        </thead>
        {showStats && (
          <tbody>
            <tr>
              <Td>Ожидаемая сумма наград</Td>
              <Td>{analysis.expectedTotal.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Фактическая сумма наград</Td>
              <Td>{analysis.totalReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Разница</Td>
              <Td style={{
                color: analysis.difference > 0 ? 'green' : 
                       analysis.difference < 0 ? 'red' : 'inherit'
              }}>
                {analysis.difference > 0 ? '+' : ''}{analysis.difference.toLocaleString()}
              </Td>
            </tr>
            <tr>
              <Td>Средняя награда</Td>
              <Td>{analysis.averageReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Медианная награда</Td>
              <Td>{analysis.medianReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Максимальная награда</Td>
              <Td>{analysis.maxReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Минимальная награда</Td>
              <Td>{analysis.minReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Количество уровней</Td>
              <Td>{analysis.levels}</Td>
            </tr>
            <tr>
              <Td>Исходная сумма наград (до округления)</Td>
              <Td>{analysis.rawTotalReward.toLocaleString()}</Td>
            </tr>
            <tr>
              <Td>Разница из-за округления</Td>
              <Td style={{
                color: analysis.roundingDifference > 0 ? 'green' : 
                       analysis.roundingDifference < 0 ? 'red' : 'inherit'
              }}>
                {analysis.roundingDifference > 0 ? '+' : ''}{analysis.roundingDifference.toLocaleString()}
              </Td>
            </tr>
            <tr>
              <Td>Процент разницы</Td>
              <Td>{(analysis.roundingDifferencePercentage).toFixed(2)}%</Td>
            </tr>
          </tbody>
        )}
      </Table>

      <Table style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            {columns
              .filter(column => visibleColumns.includes(column.key))
              .map(column => (
                <Th key={column.key}>{column.title}</Th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map(rowData => (
            <tr key={rowData.place}>
              {columns
                .filter(column => visibleColumns.includes(column.key))
                .map(column => (
                  <Td key={column.key}>
                    {column.format ? column.format(column.getValue(rowData)) : column.getValue(rowData)}
                  </Td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}; 