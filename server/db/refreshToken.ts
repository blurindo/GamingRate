import {prisma} from "."
import RefreshToken from "../models/RefreshToken"

export const createRefreshToken = (refreshToken: RefreshToken) => {
    return prisma.refreshToken.create({
        data: refreshToken
    })
}

export const getRefreshTokenByToken = (token: string) => {
    return prisma.refreshToken.findUnique({
        where: {
            token
        }
    })
}

export const removeRefreshToken = (token: string) => {
    return prisma.refreshToken.delete({
        where: {
            token: token
        }
    })
}