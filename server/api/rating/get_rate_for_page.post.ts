import { getRatingById } from "../../db/ratings"
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

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event);
    const { rateId } = body;

    const combineRatingWithGame = (rating: GameRate, games: Game[]) => {
        const gameToFind = games.find(game => game.id === rating.gameId);
          // Return a new object that combines the rating with the found game
          return {
            ...rating,
            game: gameToFind ? gameToFind : null // Include the game object if found, else null
          };
    };

    const gameRate = await getRatingById(rateId)

    const response = await fetch(
        "https://api.igdb.com/v4/games",
        { method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Client-ID': `${config.igdbClientId}`,
            'Authorization': `${config.igdbAuthorization}`,
          },
          body: `fields name, cover.image_id; where id = ${gameRate?.gameId};`
      });
    
    const foundGame = await response.json();
    console.log(foundGame)
    const gamesWithCover = foundGame.map(ensureCover);
    console.log(combineRatingWithGame(gameRate!!,gamesWithCover));
    if(gameRate)
        return  combineRatingWithGame(gameRate,gamesWithCover);
      return null;
})