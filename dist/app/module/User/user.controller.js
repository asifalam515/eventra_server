import { UserService } from "./user.service";
// get user by id
const getUserById = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const user = await UserService.getUserById(userId);
    res.status(200).json({
        success: true,
        data: user,
        message: "User fetched successfully",
    });
};
// update user profile
const updateUserProfile = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const payload = req.body;
    const updatedUser = await UserService.updateUserProfile(userId, payload);
    res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User Updated Successfully",
    });
};
export const UserController = { updateUserProfile, getUserById };
//# sourceMappingURL=user.controller.js.map