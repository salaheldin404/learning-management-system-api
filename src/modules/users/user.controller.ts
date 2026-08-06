import { Response, Request, NextFunction } from "express";
import { getUserProfileService, updateProfileService, getAllUsersService, updateUserService, deleteUserService, getInstructorProfileService } from "./user.service";
import { UpdateProfileInput, UpdateUserByAdminInput } from "./user.schema";


export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userProfile = await getUserProfileService(req.user);

  res.status(200).json({ user: userProfile });
}

export const getInstructorProfile = async (req: Request<{ userId: string }, {}, {}>, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const token = req.cookies?.token;

  const instructorProfile = await getInstructorProfileService(userId, token);

  res.status(200).json({ user: instructorProfile });
}

export const updateProfile = async (req: Request<{}, {}, UpdateProfileInput>, res: Response, next: NextFunction) => {
  const user = req.user

  const updatedUser = await updateProfileService(user.id, req.body, user);

  res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await getAllUsersService(req.user);
  res.status(200).json({ users });
}


export const updateUserByAdmin = async (req: Request<{ userId: string }, {}, UpdateUserByAdminInput>, res: Response, next: NextFunction) => {
  const updatedUser = await updateUserService(req.params.userId, req.body, req.user);
  res.status(200).json({ message: "User updated successfully", user: updatedUser });
}


export const deleteUser = async (req: Request<{ userId: string }, {}, {}>, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  await deleteUserService(userId, req.user);

  res.status(200).json({ message: "User deleted successfully" });
}

