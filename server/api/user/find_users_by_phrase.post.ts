import { findUsersbyPhrase } from "~/server/db/users"
import { countUserRatings } from "../../db/ratings"
import { getNumberOfFriends } from "../../db/friends"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { phrase } = body;

    const users = await findUsersbyPhrase(phrase);

    const usersWithGameRatesCount = await Promise.all(users.map(async user => {
        const gameRateCount = await countUserRatings(user.id)
        const friendsCount = await getNumberOfFriends(user.id)
    
        return {
          ...user,
          gameRateCount,
          friendsCount
        };
      }));

    return usersWithGameRatesCount;
})