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
	rawTotalReward: number;
	roundingDifference: number;
	roundingDifferencePercentage: number;
}

/**
 * «Дискретная» ступенчатая формула награды,
 * без сглаживания и без дополнительных циклов.
 */
const minReward = 10;
const duckPerPlace = 4000;
const boostedUsers = 200;
const duckForBoost = 80000;
export function getDiscreteReward(rank: number, places: number): number {
	if (rank < 1) {
		throw new Error("Место должно быть >= 1");
	}

	if (rank > places) return minReward;
	
	const boostRate = Math.min(Math.max(1 - places / boostedUsers, 0), 1);
	const totalSum = places * duckPerPlace + duckForBoost * boostRate;

	const levels = Math.floor(Math.log2(places + 1));
	const maxValidPlaces = 2 ** levels - 1;

	const perLevel = totalSum / levels;

	let rewardPerPlace: number;
	if (rank <= maxValidPlaces) {
		let i = 0;
		while (rank > 2 ** (i + 1) - 1) {
			i++;
		}
		rewardPerPlace = Math.floor(perLevel / 2 ** i);
	} else {
		rewardPerPlace = minReward;
	}

	return Math.max(rewardPerPlace, minReward);
}

function floorDisplayedReward(price: number): number {
  if (price < 0.01) {
    return 0;
  }
  if (price < 10) {
    return Math.floor(price * 100) / 100;
  }
  if (price < 1_000) {
    return Math.floor(price);
  }
  if (price < 1_000_000) {
    const inK = price / 1_000; 
    const floored = Math.floor(inK * 10) / 10;
    return floored * 1_000; 
  }
  if (price < 1_000_000_000) {
    const inM = price / 1_000_000; 
    const floored = Math.floor(inM * 10) / 10;
    return floored * 1_000_000;
  }
  if (price < 1_000_000_000_000) {
    const inB = price / 1_000_000_000;
    const floored = Math.floor(inB * 10) / 10;
    return floored * 1_000_000_000;
  }
  const inT = price / 1_000_000_000_000;
  const flooredT = Math.floor(inT * 10) / 10;
  return flooredT * 1_000_000_000_000;
}

export function getRewardForPlace(
	rank: number,
	_: number,
	totalPlaces: number
): number {
	if (rank < 1) {
		throw new Error("Место должно быть >= 1");
	}

	if (rank > totalPlaces) return minReward;

	const L = Math.floor(Math.log2(totalPlaces + 1));

	// При L=0 (т.е. totalPlaces=1) получим lowerBound=1, upperBound=1 => нет интерполяции
	const lowerBound = Math.max(1, 2 ** L - 1);
	const upperBound = 2 ** (L + 1) - 1;

	// Если totalPlaces ровно на нижней или верхней границе — интерполировать не нужно
	if (totalPlaces === lowerBound || totalPlaces === upperBound) {
		return floorDisplayedReward(getDiscreteReward(rank, totalPlaces));
	}

	const alpha = (totalPlaces - lowerBound) / (upperBound - lowerBound);

	// Две награды с ключевых точек
	const rewardL = getDiscreteReward(rank, lowerBound);
	const rewardLplusOne = getDiscreteReward(rank, upperBound);

	// Линейная интерполяция
	const interpolated = (1 - alpha) * rewardL + alpha * rewardLplusOne;
  const rawReward = Math.max(minReward, Math.floor(interpolated));
	return floorDisplayedReward(rawReward);
}

export function analyzeDistribution(
	totalPlaces: number,
	targetPercentage: number = 90
): DistributionAnalysis {
	const rawRewards = Array.from({ length: totalPlaces }, (_, i) => {
		const rank = i + 1;
		const L = Math.floor(Math.log2(totalPlaces + 1));
		const lowerBound = Math.max(1, 2 ** L - 1);
		const upperBound = 2 ** (L + 1) - 1;
		const alpha = (totalPlaces - lowerBound) / (upperBound - lowerBound);
		const rewardL = getDiscreteReward(rank, lowerBound);
		const rewardLplusOne = getDiscreteReward(rank, upperBound);
		return Math.max(10, Math.floor((1 - alpha) * rewardL + alpha * rewardLplusOne));
	});

	const rewards = rawRewards.map(r => floorDisplayedReward(r));
	
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

	const rawTotalReward = rawRewards.reduce((sum, r) => sum + r, 0);
	const roundingDifference = totalReward - rawTotalReward;
	
	const duckPerPlace = 4000;
	const boostedUsers = 200;
	const boostRate = Math.min(Math.max(1 - totalPlaces / boostedUsers, 0), 1);
	const duckForBoost = 80000;
	const expectedTotal = totalPlaces * duckPerPlace + duckForBoost * boostRate;

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
		placesFor90Percent: placesFor90,
		rawTotalReward,
		roundingDifference,
		roundingDifferencePercentage: (roundingDifference / expectedTotal) * 100
	};
}
