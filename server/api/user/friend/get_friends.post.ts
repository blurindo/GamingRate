import { getListOfFriends } from "~/server/db/friends";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId } = body;

    const friendsList = await getListOfFriends(userId)

    if (friendsList){
        const friendsData = [
            ...friendsList.friends.map(friendship => ({
              id: friendship.friend.id,
              username: friendship.friend.username,
              profileImage: friendship.friend.profileImage,
            })),
            ...friendsList.friendOf.map(friendship => ({
              id: friendship.user.id,
              username: friendship.user.username,
              profileImage: friendship.user.profileImage,
            })),
          ];

          const uniqueFriendsData = Array.from(new Map(friendsData.map(friend => [friend.id, friend])).values());

          return uniqueFriendsData;
    }
    return [];
})