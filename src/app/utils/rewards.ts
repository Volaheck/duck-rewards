export interface DistributionAnalysis {
  totalPlaces: number;
  totalReward: number;
  expectedTotal: number;
  difference: number;
  averageReward: number;
  medianReward: number;
  maxReward: number;
  minReward: number;
  levels: number;
  placesFor90Percent: number;
}

export function getRewardForPlace(
  rank: number,
  _: number,
  totalPlaces: number
): number {
  const duckPerPlace = 4000;
  const boostedUsers = 200;
  const bostRate = Math.min(Math.max(1 - totalPlaces / boostedUsers, 0), 1);
  const duckForBoost = 80000;
  const totalSum = totalPlaces * duckPerPlace + duckForBoost * bostRate;

  if (rank < 1) throw new Error("Место должно быть >= 1");
  if (rank > totalPlaces)
    throw new Error("Место выходит за пределы распределения");

  let levels = Math.floor(Math.log2(totalPlaces + 1));
  let maxValidPlaces = 2 ** levels - 1;

  if (totalPlaces !== maxValidPlaces) {
    while (2 ** (levels + 1) - 1 <= totalPlaces) {
      levels++;
    }
    maxValidPlaces = 2 ** levels - 1;
  }

  const perLevel = totalSum / levels;
  let rewardPerPlace: number;

  if (rank <= maxValidPlaces) {
    let i = 0;
    while (rank > 2 ** (i + 1) - 1) {
      i++;
    }
    rewardPerPlace = Math.floor(perLevel / 2 ** i);
  } else {
    rewardPerPlace = 10;
  }

  return Math.max(rewardPerPlace, 10);
}

export function analyzeDistribution(totalPlaces: number, targetPercentage: number = 90): DistributionAnalysis {
  const rewards = Array.from({ length: totalPlaces }, (_, i) =>
    getRewardForPlace(i + 1, 0, totalPlaces)
  );

  const duckPerPlace = 4000;
  const boostedUsers = 200;
  const boostRate = Math.min(Math.max(1 - totalPlaces / boostedUsers, 0), 1);
  const duckForBoost = 80000;
  const expectedTotal = totalPlaces * duckPerPlace + duckForBoost * boostRate;

  const totalReward = rewards.reduce((sum, reward) => sum + reward, 0);
  const sortedRewards = [...rewards].sort((a, b) => b - a);
  
  // Находим количество мест для targetPercentage% наград
  let sumFor90 = 0;
  let placesFor90 = 0;
  const targetSum = totalReward * (targetPercentage / 100);
  
  for (const reward of sortedRewards) {
    sumFor90 += reward;
    placesFor90++;
    if (sumFor90 >= targetSum) break;
  }

  return {
    totalPlaces,
    totalReward,
    expectedTotal,
    difference: totalReward - expectedTotal,
    averageReward: Math.floor(totalReward / totalPlaces),
    medianReward: sortedRewards[Math.floor(totalPlaces / 2)],
    maxReward: sortedRewards[0],
    minReward: sortedRewards[totalPlaces - 1],
    levels: Math.floor(Math.log2(totalPlaces + 1)),
    placesFor90Percent: placesFor90
  };
} 