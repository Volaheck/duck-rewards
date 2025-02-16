import React, { useState, useMemo, useEffect } from 'react';
import { 
  TableWrapper, 
  Table, 
  Td, 
  Title, 
  InputForm, 
  Input,
  Header,
  TitleContainer,
  ToggleButton,
  ClickableTh,
  SingleColumnView,
  ColumnLabel,
  ColumnValue,
  BackButton,
  SingleColumnContainer,
  CheckboxContainer,
  Checkbox,
  ColumnFilters,
  FilterCheckbox,
  FiltersButton,
  FiltersContainer,
  SingleColumnWrapper,
  ChartContainer
} from './styled';
import { analyzeDistribution, getRewardForPlace, getDiscreteReward } from '../../utils/rewards';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_ROWS = 64;
const TARGET_REWARD = 4000;

type ColumnKey = 'places' | 'reward' | 'percentage' | 'totalReward' | 'expectedTotal' | 'difference' | 'minRewardPlace' | 'minRewardPercentage' | 'placesFor90Percent' | 'rawReward' | 'roundingDifference' | 'roundingPercentage';

interface AnalysisData {
  places: number;
  reward: number;
  analysis: {
    totalReward: number;
    expectedTotal: number;
    difference: number;
    placesFor90Percent: number;
    roundingDifferencePercentage: number;
    roundingDifference: number;
    rawTotalReward: number;
  };
  isKeyPoint: boolean;
  minRewardPlace: number;
  rawReward: number;
  roundingDifference: number;
  roundingPercentage: number;
}

interface Column {
  key: ColumnKey;
  title: string | React.ReactNode;
  getValue: (data: AnalysisData) => number;
  format?: (value: number, data: AnalysisData) => string;
}

export const FirstPlaceAnalysis = () => {
  const [rowsCount, setRowsCount] = useState(DEFAULT_ROWS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [showOnlyKeyPoints, setShowOnlyKeyPoints] = useState(false);
  const [rewardPercentage, setRewardPercentage] = useState(90);
  const [showFilters, setShowFilters] = useState(false);
  
  // Загружаем сохраненные фильтры или используем все столбцы по умолчанию
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(() => {
    const saved = localStorage.getItem('columnFilters');
    return saved ? JSON.parse(saved) : [
      'places', 'reward', 'percentage', 'totalReward', 'expectedTotal',
      'difference', 'minRewardPlace', 'minRewardPercentage', 'placesFor90Percent',
      'rawReward', 'roundingDifference', 'roundingPercentage'
    ];
  });

  // Сохраняем фильтры при изменении
  useEffect(() => {
    localStorage.setItem('columnFilters', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Закрываем фильтры при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filters-container')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColumn = (columnKey: ColumnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const columns: Column[] = useMemo(() => [
    { 
      key: 'places', 
      title: 'Количество мест',
      getValue: (data) => data.places
    },
    { 
      key: 'reward', 
      title: 'Награда за 1-е место',
      getValue: (data) => data.reward,
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'percentage', 
      title: '% от общей суммы наград',
      getValue: (data) => Math.round((data.reward / data.analysis.totalReward) * 100),
      format: (value) => `${value}%`
    },
    { 
      key: 'totalReward', 
      title: 'Общая сумма наград',
      getValue: (data) => data.analysis.totalReward,
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'expectedTotal', 
      title: 'Ожидаемая сумма',
      getValue: (data) => data.analysis.expectedTotal,
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'difference', 
      title: 'Разница',
      getValue: (data) => data.analysis.difference,
      format: (value) => (value > 0 ? '+' : '') + value.toLocaleString()
    },
    { 
      key: 'minRewardPlace', 
      title: `Награда ≥ ${TARGET_REWARD.toLocaleString()} до места`,
      getValue: (data) => data.minRewardPlace
    },
    {
      key: 'minRewardPercentage',
      title: '% игроков с наградой ≥ 4000',
      getValue: (data) => Math.round((data.minRewardPlace / data.places) * 100),
      format: (value) => `${value}%`
    },
    {
      key: 'placesFor90Percent',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Мест для
          <Input
            type="number"
            value={rewardPercentage}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0 && value <= 100) {
                setRewardPercentage(value);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '50px' }}
            min="1"
            max="100"
          />
          % наград
        </div>
      ),
      getValue: (data) => data.analysis.placesFor90Percent,
      format: (value, data) => `${value} (${Math.round((value / data.places) * 100)}%)`
    },
    {
      key: 'rawReward',
      title: 'Исходная награда',
      getValue: (data) => data.rawReward,
      format: (value) => value.toLocaleString()
    },
    {
      key: 'roundingDifference',
      title: 'Разница округления',
      getValue: (data) => data.analysis.roundingDifference,
      format: (value) => (value > 0 ? '+' : '') + value.toLocaleString()
    },
    {
      key: 'roundingPercentage',
      title: '% разницы',
      getValue: (data) => data.analysis.roundingDifferencePercentage,
      format: (value) => `${value.toFixed(2)}%`
    }
  ], [rewardPercentage]);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRowsCount(value);
    }
  };

  const analyses = useMemo(() => {
    // Если включен фильтр ключевых точек, генерируем только их
    if (showOnlyKeyPoints) {
      const keyPoints: number[] = [];
      let n = 1; // Начинаем с 1, чтобы первая точка была 1
      while ((2 ** n - 1) <= rowsCount) {
        keyPoints.push(2 ** n - 1);
        n++;
      }
      
      return keyPoints.map(places => {
        const analysis = analyzeDistribution(places, rewardPercentage);
        const reward = getRewardForPlace(1, 0, places);
        const rawReward = Math.max(10, Math.floor(getDiscreteReward(1, places)));
        return {
          places,
          reward,
          rawReward,
          roundingDifference: reward - rawReward,
          roundingPercentage: analysis.roundingDifferencePercentage,
          analysis,
          isKeyPoint: true,
          minRewardPlace: findMinRewardPlace(places)
        };
      });
    }

    // Иначе генерируем все строки
    return Array.from({ length: rowsCount }, (_, i) => {
      const places = i + 1;
      const isKeyPoint = Math.log2(places + 1) % 1 === 0;
      const reward = getRewardForPlace(1, 0, places);
      const rawReward = Math.max(10, Math.floor(getDiscreteReward(1, places)));
      return {
        places,
        reward,
        rawReward,
        roundingDifference: reward - rawReward,
        roundingPercentage: ((reward - rawReward) / rawReward) * 100,
        analysis: analyzeDistribution(places, rewardPercentage),
        isKeyPoint,
        minRewardPlace: findMinRewardPlace(places)
      };
    });
  }, [rowsCount, showOnlyKeyPoints, rewardPercentage]);

  // Функция для поиска места, с которого награда становится >= 4000
  function findMinRewardPlace(totalPlaces: number): number {
    // Проверяем первое место
    if (getRewardForPlace(1, 0, totalPlaces) < TARGET_REWARD) {
      return 0;
    }

    let left = 1;
    let right = totalPlaces;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const reward = getRewardForPlace(mid, 0, totalPlaces);
      
      if (reward >= TARGET_REWARD) {
        if (mid === totalPlaces || getRewardForPlace(mid + 1, 0, totalPlaces) < TARGET_REWARD) {
          return mid;
        }
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    return 0;
  }

  const handleColumnClick = (column: Column) => {
    setSelectedColumn(column);
    setIsExpanded(true);
  };

  const filteredAnalyses = useMemo(() => {
    return analyses.filter(data => !showOnlyKeyPoints || data.isKeyPoint);
  }, [analyses, showOnlyKeyPoints]);

  return (
    <TableWrapper>
      <Header>
        <TitleContainer>
          <Title>Анализ награды за первое место</Title>
          <InputForm>
            <Input
              type="number"
              value={rowsCount}
              onChange={handleRowsChange}
              min="1"
              placeholder="Количество строк"
            />
          </InputForm>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={showOnlyKeyPoints}
              onChange={(e) => setShowOnlyKeyPoints(e.target.checked)}
            />
            Только ключевые точки (2ⁿ-1)
          </CheckboxContainer>
          <FiltersContainer className="filters-container">
            <FiltersButton onClick={() => setShowFilters(!showFilters)}>
              <span>Фильтры</span>
              <span>{visibleColumns.length}/{columns.length}</span>
            </FiltersButton>
            <ColumnFilters $isVisible={showFilters}>
              {columns.map(column => (
                <FilterCheckbox key={column.key}>
                  <Checkbox
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                  />
                  {typeof column.title === 'string' ? column.title : 'Мест для N% наград'}
                </FilterCheckbox>
              ))}
            </ColumnFilters>
          </FiltersContainer>
        </TitleContainer>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </ToggleButton>
      </Header>

      {isExpanded && (
        selectedColumn ? (
          <SingleColumnWrapper>
            <SingleColumnContainer>
              <BackButton onClick={() => setSelectedColumn(null)}>
                ←
              </BackButton>
              {analyses.map((data) => {
                const value = selectedColumn.getValue(data);
                const displayValue = selectedColumn.format ? selectedColumn.format(value, data) : value;
                return (
                  <SingleColumnView 
                    key={data.places}
                    $isKeyPoint={data.isKeyPoint}
                  >
                    <ColumnLabel>{data.places}:</ColumnLabel>
                    <ColumnValue>{displayValue}</ColumnValue>
                  </SingleColumnView>
                );
              })}
            </SingleColumnContainer>

            <ChartContainer>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={analyses}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="places"
                    type="category"
                    allowDuplicatedCategory={false}
                    interval={showOnlyKeyPoints ? 0 : Math.floor(analyses.length / 10)}
                    tickFormatter={(value) => value.toString()}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => 
                      typeof value === 'number' ? 
                        value.toLocaleString() : 
                        value
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => 
                      selectedColumn.format ? 
                        selectedColumn.format(value, analyses.find(a => a.places === value)!) :
                        value.toLocaleString()
                    }
                    labelFormatter={(label) => `Мест: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={(data) => selectedColumn.getValue(data)}
                    stroke="#8884d8"
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </SingleColumnWrapper>
        ) : (
          <Table>
            <thead>
              <tr>
                {columns
                  .filter(column => visibleColumns.includes(column.key))
                  .map(column => (
                    <ClickableTh 
                      key={column.key}
                      onClick={() => handleColumnClick(column)}
                    >
                      {column.title}
                    </ClickableTh>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.map((data) => (
                <tr 
                  key={data.places}
                  style={{
                    backgroundColor: data.isKeyPoint ? '#f0f8ff' : 'inherit',
                    fontWeight: data.isKeyPoint ? 'bold' : 'normal'
                  }}
                >
                  {columns
                    .filter(column => visibleColumns.includes(column.key))
                    .map(column => {
                      const value = column.getValue(data);
                      const displayValue = column.format ? column.format(value, data) : value;
                      return <Td key={column.key}>{displayValue}</Td>;
                    })}
                </tr>
              ))}
            </tbody>
          </Table>
        )
      )}
    </TableWrapper>
  );
}; 