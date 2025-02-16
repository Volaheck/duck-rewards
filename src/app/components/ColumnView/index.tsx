import React from 'react';
import { 
  SingleColumnWrapper,
  SingleColumnContainer,
  SingleColumnView as StyledColumnView,
  ColumnLabel,
  ColumnValue,
  BackButton,
  ChartContainer 
} from './styled';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Column, AnalysisData } from '../FirstPlaceAnalysis/types';

interface Props {
  column: Column;
  analyses: AnalysisData[];
  onBack: () => void;
  showOnlyKeyPoints: boolean;
}

export const ColumnView: React.FC<Props> = ({
  column,
  analyses,
  onBack,
  showOnlyKeyPoints
}) => {
  return (
    <SingleColumnWrapper>
      <SingleColumnContainer>
        <BackButton onClick={onBack}>
          ←
        </BackButton>
        {analyses.map((data) => {
          const value = column.getValue(data);
          const displayValue = column.format ? column.format(value, data) : value;
          return (
            <StyledColumnView 
              key={data.places}
              $isKeyPoint={data.isKeyPoint}
            >
              <ColumnLabel>{data.places}:</ColumnLabel>
              <ColumnValue>{displayValue}</ColumnValue>
            </StyledColumnView>
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
                column.format ? 
                  column.format(value, analyses.find(a => a.places === value)!) :
                  value.toLocaleString()
              }
              labelFormatter={(label) => `Мест: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={(data) => column.getValue(data)}
              stroke="#8884d8"
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </SingleColumnWrapper>
  );
}; 