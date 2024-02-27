import { prisma } from "."
import { GameRate } from "@prisma/client"

export const createRating = (rateData: Omit<GameRate, "id" | "createdAt" | "updatedAt">) => {
    return prisma.gameRate.create({
        data: rateData
    })
}

export const getRatingByUserAndGame = async (userId: number, gameId: number) => {

    const gameRating: GameRate | null = await prisma.gameRate.findUnique({
        where: {
            userId_gameId: { // Use the composite unique key here
                userId: userId,
                gameId: gameId,
            },
        },
    })

    return gameRating;
}

export const getAllRatingByUser = async (userId: number) => {

    const gameRatings: GameRate[] | null = await prisma.gameRate.findMany({
        where: {
            userId: userId
        }
    })

    return gameRatings;
}

export const updateRating = async (rateData: Omit<GameRate, "id" | "createdAt">) => {
    const update = await prisma.gameRate.update({
        where: {
            userId_gameId: { // Use the composite unique key here
                userId: rateData.userId,
                gameId: rateData.gameId,
            },
        },
        data: {
            rate: rateData.rate,
            updatedAt: rateData.updatedAt,
        },
    });

    return update;
} 