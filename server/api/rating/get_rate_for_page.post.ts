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

    const combineRatingWithGame = (rating: GameRate, game: Game) => {
        if (game.id === rating.gameId) {
            return {
                ...rating,
                game: game
            };
        } else {
            return {
                ...rating,
                game: null
            };
        }
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
    const gameWithCover = ensureCover(foundGame);
    
    if(gameRate)
        return  combineRatingWithGame(gameRate,gameWithCover);
      return null;
})