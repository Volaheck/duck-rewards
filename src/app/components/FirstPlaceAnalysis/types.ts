export type ColumnKey = 'places' | 'reward' | 'percentage' | 'totalReward' | 'expectedTotal' | 'difference' | 'minRewardPlace' | 'minRewardPercentage' | 'placesFor90Percent';

export interface AnalysisData {
  places: number;
  reward: number;
  analysis: {
    totalReward: number;
    expectedTotal: number;
    difference: number;
    placesFor90Percent: number;
  };
  isKeyPoint: boolean;
  minRewardPlace: number;
}

export interface Column {
  key: ColumnKey;
  title: string | React.ReactNode;
  getValue: (data: AnalysisData) => number;
  format?: (value: number, data: AnalysisData) => string;
} 