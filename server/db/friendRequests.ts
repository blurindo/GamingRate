import { prisma } from "."

export const sendFriendRequest = async (senderId: number, receiverId: number) => {
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        status: "sent", 
      },
    });
    return friendRequest;
  }

  export const acceptFriendRequest = async (receiverId: number, requestId: number) => {

    const result = await prisma.$transaction(async (prisma) => {
      const friendRequest = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });
  
      if (!friendRequest || friendRequest.receiverId !== receiverId || friendRequest.status !== "sent") {
        throw new Error("Can't find friend request or it has been accepted/rejected already");
      }
  
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "accepted" },
      });
  
      const existingFriendship = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: friendRequest.senderId, friendId: friendRequest.receiverId },
            { userId: friendRequest.receiverId, friendId: friendRequest.senderId },
          ],
        },
      });
  
      if (existingFriendship) {
        throw new Error("Friendship already exist");
      }
  
      const friend = await prisma.friend.create({
        data: {
          userId: friendRequest.senderId,
          friendId: friendRequest.receiverId,
        },
      });

  
      return { friend };
    });
  
    return result;
  }

  export const fetchFriendRequests = async(receiverId: number) => {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: receiverId,
        status: "sent", 
      },
      include: {
        sender: {
          select: {
            username: true,
            profileImage: true
          }
        }, 
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    const releaseDate = (dateToChange: Date) => {
      var timestamp = dateToChange
      var date = new Date(timestamp);
      var formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  
      return formattedDate;
  }
  
    return friendRequests.map(request => ({
      id: request.id,
      senderId: request.senderId,
      senderUsername: request.sender.username, 
      senderProfileImage: request.sender.profileImage,
      createdAt: releaseDate(request.createdAt),
    }));
  }

  export const rejectFriendRequest = async (receiverId: number, requestId: number) => {
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
  
    if (!friendRequest || friendRequest.receiverId !== receiverId) {
      throw new Error("Friend request does ont exist or you cannot reject it");
    }
  
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "rejected" },
    });
  
    return true;
  } 