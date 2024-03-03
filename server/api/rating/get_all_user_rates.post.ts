import { getAllRatingByUser } from "../../db/ratings"

export default defineEventHandler( async (event) => {
    const body = await readBody(event);
    const { userId } = body;

    const ratings = await getAllRatingByUser(userId)

    return ratings;
})