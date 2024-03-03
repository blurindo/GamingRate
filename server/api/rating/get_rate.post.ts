import { getRatingByUserAndGame } from "../../db/ratings"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId, gameId } = body;

    const request = {
        userId: userId,
        gameId: gameId
    }
    const checkRate = await getRatingByUserAndGame(userId, gameId)

    return checkRate;
})