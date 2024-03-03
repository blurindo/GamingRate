import { prisma } from "."

export const checkIfPersonIsFriend = async(userId: number, friendId: number) => {

    const isFriend = await prisma.friend.findFirst({
        where: {
            OR: [
              {
                userId: userId,
                friendId: friendId,
              },
              {
                userId: friendId,
                friendId: userId,
              },
            ],
          },
    })

    return isFriend;
}

export const getListOfFriends = async(userId: number) => {

    const friendsList = await prisma.user.findUnique({
        where: {
            id: userId,
          },
          include: {
            friends: {
              select: {
                friend: true,
              },
            },
            friendOf: {
              select: {
                user: true,
              },
            },
          },
    })

    return friendsList;
}

export const removeFriend = async (userId:number, friendId:number) => {

    const deleteFriendship1 = prisma.friend.deleteMany({
      where: {
        userId: userId,
        friendId: friendId,
      },
    });
  
    const deleteFriendship2 = prisma.friend.deleteMany({
      where: {
        userId: friendId,
        friendId: userId,
      },
    });
  
    await prisma.$transaction([deleteFriendship1, deleteFriendship2]);
  
    return true;
  }

  export const getListOfThreeFriends = async(userId: number) => {

    const friendsList = await prisma.user.findUnique({
        where: {
            id: userId,
          },
          include: {
            friends: {
              take: 3,
              select: {
                friend: true,
              },
            },
            friendOf: {
              take: 3,
              select: {
                user: true,
              },
            },
          },
    })

    return friendsList;
}