import User from "@/modules/users/user.model";
import AppError from "@/common/errors/appError";


export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

export async function getAllUsers() {
  const users = await User.find();
  return users;
}