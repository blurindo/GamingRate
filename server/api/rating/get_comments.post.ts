import { getCommentsFromGameRate } from "../../db/comments"

export default defineEventHandler( async (event) => {
    const body = await readBody(event);
    const { rateId } = body;

    const ratings = await getCommentsFromGameRate(rateId)

    return ratings;
})