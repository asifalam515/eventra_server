import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    return user;
};
// update user profile
const updateUserProfile = async (userId, payload) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: payload,
    });
    return updatedUser;
};
export const UserService = { updateUserProfile, getUserById };
//# sourceMappingURL=user.service.js.map