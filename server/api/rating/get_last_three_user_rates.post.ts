import { getLastThreeRatingsByUser } from "../../db/ratings"
import {GameRate} from "@prisma/client"

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

export default defineEventHandler( async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event);
    const { userId } = body;

    const combineRatingsWithGames = (ratings: GameRate[], games: Game[]) => {
        return ratings.map(rating => {
          // Find the game that matches the rating's gameId
          const game = games.find(game => game.id === rating.gameId);
          // Return a new object that combines the rating with the found game
          return {
            ...rating,
            game: game ? game : null // Include the game object if found, else null
          };
        });
      };

    const ratings = await getLastThreeRatingsByUser(userId);

    if (ratings.length < 0)
        return ratings;

    const searchQuery = `(${ratings.map(rating => rating.gameId.toString()).join(',')})`;
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
    
    const combinedRatings = combineRatingsWithGames(ratings,gamesWithCover);

    return combinedRatings;
})