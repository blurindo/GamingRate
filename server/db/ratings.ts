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

export const countUserRatings = async (userId: number) => {

    const countNumber: number = await prisma.gameRate.count({
        where: {
            userId: userId
        }
    })

    return countNumber;
}

export const getLastThreeRatingsByUser = async (userId: number) => {

    const gameRatings: GameRate[] | null = await prisma.gameRate.findMany({
        where: {
            userId: userId
        },
        take: 3,
        orderBy: {
            updatedAt: 'desc'
        }
    })

    return gameRatings;
}

export const getRatingById = async (rateId: number) => {
    const gameRating: GameRate | null = await prisma.gameRate.findUnique({
        where: {
            id: rateId,
          },
          include: {
            user: {
              select: {
                username: true,
                profileImage: true, 
              },
            },
          },
        });

    return gameRating;
}

export const getYourFriendGameRates = async (friendIds: number[], page: number) => {
    const skipAmount = (page - 1) * 50;

    // Zakładając, że już pobrano friendIds (ID wszystkich znajomych)
    

    const friendsGameRates = await prisma.gameRate.findMany({
        where: {
          userId: {
            in: friendIds,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              username: true,
              profileImage: true,
              id: true
            },
          },
        },
        skip: skipAmount,
        take: 50,
      });

      return friendsGameRates;
}

export const getAllUniqueGameIds = async() => {
    const gameRates = await prisma.gameRate.findMany({
        select: {
          gameId: true,
        },
      });

      const uniqueGameIds = [...new Set(gameRates.map(gameRate => gameRate.gameId))];
      return uniqueGameIds;

}

export const getOrganizedGameRatesByUser = async() => {
    const gameRates = await prisma.gameRate.findMany({
        select: {
          userId: true,
          gameId: true,
          rate: true,
        },
      });
    
      const gameRatesByUser = gameRates.reduce((acc, { userId, gameId, rate }) => {
        // Jeśli użytkownik nie istnieje w akumulatorze, dodaj go z pustą mapą
        if (!acc[userId]) {
            acc[userId] = {};
        }
        // Dodaj gameId jako klucz i rate jako wartość do mapy ocen użytkownika
        acc[userId][gameId] = rate;
        return acc;
    }, {} as Record<number, Record<number, number>>); // Używamy Record<number, number> dla ocen gier

    return gameRatesByUser;
};

export const getUserGameRatesWithMinRate = async(userId: number) => {
    const gameRates = await prisma.gameRate.findMany({
        where: {
          userId: userId,
          rate: {
            gte: 3,
          },
        },
        select: {
          gameId: true,
          rate: true,
        },
        orderBy: {
            rate: 'desc', 
          },
      });
    
      return gameRates;
}
