import { countUserRatings } from "../../db/ratings"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId } = body;

    const count = await countUserRatings(userId)

    return count;
})