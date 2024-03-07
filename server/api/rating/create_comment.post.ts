import { createComment } from "../../db/comments"

export default defineEventHandler( async (event) => {
    const body = await readBody(event);
    const { gameRateId, userId, text } = body;

    const comment = await createComment(gameRateId, userId, text.trim())
    return comment;
})