import { prisma } from "."
import { GameRate } from "@prisma/client"

export const getCommentsFromGameRate = async (gameRateId: number) => {
    const gameRateWithComments = await prisma.gameRate.findUnique({
        where: {
          id: gameRateId,
        },
        include: {
          comments: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              user: {
                select: {
                  username: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      });

    const comments = gameRateWithComments?.comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: comment.userId,
        username: comment.user.username,
        profileImage: comment.user.profileImage,
      })) || [];

    return comments;  
}

export const createComment = async (gameRateId: number, userId: number, text: string) => {
    const newComment = await prisma.comment.create({
        data: {
          text: text,
          gameRateId: gameRateId,
          userId: userId,
        },
      });

    return newComment;
}

export const deleteComment = async (commentId: number) => {
    const deletedComment = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    
    return deletedComment; 
}