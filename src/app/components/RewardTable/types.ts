export type RewardTableColumnKey = 'place' | 'reward' | 'percentage';

export interface RewardTableData {
  id: string;
  place: number;
  reward: number;
  percentage: number;
}

export interface RewardTableColumn {
  key: RewardTableColumnKey;
  title: string;
  getValue: (data: RewardTableData) => number;
  format?: (value: number) => string;
} 