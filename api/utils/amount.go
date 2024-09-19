package utils

func CalculateNextBidAmount(currentBidAmount int32) int32 {
	var nextBidAmount int32 = 0

	if currentBidAmount >= 20_00_000 && currentBidAmount < 50_00_000 {
		nextBidAmount = currentBidAmount + 5_00_000
	} else if currentBidAmount >= 50_00_000 && currentBidAmount < 1_00_00_000 {
		nextBidAmount = currentBidAmount + 10_00_000
	} else if currentBidAmount >= 1_00_00_000 && currentBidAmount < 5_00_00_000 {
		nextBidAmount = currentBidAmount + 20_00_000
	} else if currentBidAmount >= 5_00_00_000 && currentBidAmount < 10_00_00_000 {
		nextBidAmount = currentBidAmount + 50_00_000
	} else {
		nextBidAmount = currentBidAmount + 1_00_00_000
	}

	return nextBidAmount
}

func CalculatePreviousBidAmount(currentBidAmount int32) int32 {
	var previousBidAmount int32 = 0
	if currentBidAmount > 20_00_000 && currentBidAmount <= 50_00_000 {
		previousBidAmount = currentBidAmount - 5_00_000
	} else if currentBidAmount > 50_00_000 && currentBidAmount <= 1_00_00_000 {
		previousBidAmount = currentBidAmount - 10_00_000
	} else if currentBidAmount > 1_00_00_000 && currentBidAmount <= 5_00_00_000 {
		previousBidAmount = currentBidAmount - 20_00_000
	} else if currentBidAmount > 5_00_00_000 && currentBidAmount <= 10_00_00_000 {
		previousBidAmount = currentBidAmount - 50_00_000
	} else {
		previousBidAmount = currentBidAmount - 1_00_00_000
	}

	return previousBidAmount
}
