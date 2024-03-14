type UserRatings = {
    [gameId: number]: number;
};

type PearsonCorrelationScore = {
    user: number; // Zmieniono z string na number
    score: number;
};

// Funkcja obliczająca korelację Pearsona między dwoma zestawami ocen
function pearsonCorrelation(ratingsA: UserRatings, ratingsB: UserRatings): number {
    let sharedGames: number[] = [];
    for (const gameId in ratingsA) {
        if (parseInt(gameId) in ratingsB) {
            sharedGames.push(parseInt(gameId));
        }
    }

    const n = sharedGames.length;

    if (n === 0) return 0;

    let sumA = 0, sumB = 0, sumA2 = 0, sumB2 = 0, sumAB = 0;

    for (let gameId of sharedGames) {
        sumA += ratingsA[gameId];
        sumB += ratingsB[gameId];
        sumA2 += Math.pow(ratingsA[gameId], 2);
        sumB2 += Math.pow(ratingsB[gameId], 2);
        sumAB += ratingsA[gameId] * ratingsB[gameId];
    }

    let numerator = sumAB - (sumA * sumB / n);
    let denominator = Math.sqrt((sumA2 - Math.pow(sumA, 2) / n) * (sumB2 - Math.pow(sumB, 2) / n));

    if (denominator === 0) return 0;

    return numerator / denominator;
}

// Funkcja znajdująca użytkownika z najbardziej podobnymi ocenami do podanych
function findMostSimilarUserByPearson(myRatings: UserRatings, usersRatings: Record<number, UserRatings>): string {
    let highestScore: PearsonCorrelationScore = { user: -1, score: -1 }; // Zainicjowano user jako -1

    for (const user in usersRatings) {
        const userId = parseInt(user); // Konwersja klucza na liczbę
        let score = pearsonCorrelation(myRatings, usersRatings[userId]);

        if (score > highestScore.score) {
            highestScore = { user: userId, score }; // Zaktualizowano, aby przypisywać userId jako number
        }
    }

    return highestScore.user.toString(); // Konwersja userId z powrotem na string do zwrócenia (jeśli chcesz zwrócić jako number, pomiń toString())
}
