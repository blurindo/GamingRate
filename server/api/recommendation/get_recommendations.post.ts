import { getOrganizedGameRatesByUser, getUserGameRatesWithMinRate } from "../../db/ratings"
import { findMostSimilarUserByCosineSimilarity } from "../../utils/cosine"

interface Game {
    id: number;
    cover?: {
        id: number;
        image_id: string;
    };
    name: string;
}

function ensureCover(game: Game): Game {
    if (!game.cover) {
        game.cover = {
            id: 0,
            image_id: "undefined"
        };
    }
    return game;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);
    const { userId, gameId } = body;
    const organizedRatings = await getOrganizedGameRatesByUser()

    //return organizedRatings;
    const mostSimiliarUser = findMostSimilarUserByCosineSimilarity(userId,organizedRatings);

    const myRates = organizedRatings[userId]
    const likedGamesByUser = await getUserGameRatesWithMinRate(mostSimiliarUser);
    const gamesToRecommend = [];
    for (const game of likedGamesByUser) {
        if (myRates[game.gameId] === undefined) {
            gamesToRecommend.push(game)
        }
    }

    const searchQuery = `(${gamesToRecommend.map(rating => rating.gameId.toString()).join(',')})`;

    const response = await fetch(
        "https://api.igdb.com/v4/games",
        { method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Client-ID': `${config.igdbClientId}`,
            'Authorization': `${config.igdbAuthorization}`,
          },
          body: `fields name, cover.image_id; where id = ${searchQuery};`
      });
    
    const foundGames = await response.json();
    const gamesWithCover = foundGames.map(ensureCover);
    return gamesWithCover;
})