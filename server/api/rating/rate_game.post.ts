import { createRating, updateRating } from "../../db/ratings"
import { getCurrentFormattedDate } from "../../utils/currentDate"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { userId, rate, gameId, canBeUpdated } = body

    if (canBeUpdated) {
        const request = {
            rate: rate,
            gameId: gameId,
            userId: userId,
            updatedAt: getCurrentFormattedDate()
        }
        const updateRate = updateRating(request)

        return updateRate;
    }
    else {
        const request = {
            rate: rate,
            gameId: gameId,
            userId: userId
        }

        const createRate = await createRating(request)

        return createRate;
    }

})

