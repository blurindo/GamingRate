type UserRatings = Record<number, Record<number, number>>;

// Funkcja obliczająca podobieństwo kosinusowe między dwoma użytkownikami
function cosineSimilarity(ratingsA: Record<number, number>, ratingsB: Record<number, number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    // Iteruj po grach użytkownika A
    for (const gameId in ratingsA) {
        if (ratingsB[gameId] !== undefined) { // Sprawdź, czy użytkownik B również ocenił tę grę
            dotProduct += ratingsA[gameId] * ratingsB[gameId];
        }
        normA += ratingsA[gameId] ** 2;
    }

    // Oblicz normę dla ocen użytkownika B
    for (const gameId in ratingsB) {
        normB += ratingsB[gameId] ** 2;
    }

    // Oblicz podobieństwo kosinusowe
    if (normA === 0 || normB === 0) { // Zabezpieczenie przed dzieleniem przez 0
        return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Funkcja znajdująca użytkownika z najbardziej podobnymi ocenami do danego użytkownika
export const findMostSimilarUserByCosineSimilarity = (myUserId: number, allUserRatings: Record<number, Record<number, number>>): number => {
    const myRatings = allUserRatings[myUserId];
    let highestSimilarity = -1;
    let mostSimilarUserId: number = -1;

    for (const userId in allUserRatings) {
        const currentUserId = parseInt(userId);
        if (currentUserId !== myUserId) { // Pomijamy oceny samego siebie
            const similarity = cosineSimilarity(myRatings, allUserRatings[currentUserId]);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                mostSimilarUserId = currentUserId;
            }
        }
    }
    
    if (highestSimilarity === 0) {
        return -1;
    }
    console.log(highestSimilarity)
    return mostSimilarUserId;
};
