import User from "@/modules/users/user.model";
import AppError from "@/common/errors/appError";
import { assertPermission, getUserPermissions } from "@/permissions/abac";
import { getStudentQuizStatistics } from "@/modules/quiz/quiz.service";
import { UpdateProfileInput, UpdateUserByAdminInput } from "./user.schema";
import { getInstructorCoursesStatistics } from "../courses/course.service";
import type { PublicUser } from "./user.types";



export async function getUserById(id: string, actor?: PublicUser) {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (actor) {
    const permissions = getUserPermissions(actor);
    assertPermission(permissions, "user", "read", { id });
  }

  return user;
}

export async function getAllUsersService(actor: PublicUser) {
  const permissions = getUserPermissions(actor);
  assertPermission(permissions, "user", "read");

  const users = await User.find();
  return users;
}

export async function getUserProfileService(actor: PublicUser) {
  const user = await User.findById(actor.id).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const permissions = getUserPermissions(actor);
  assertPermission(permissions, "user", "read", { id: actor.id });

  const quizStatistics = await getStudentQuizStatistics(actor.id);
  const data = {
    ...user,
    quizStatistics
  };
  return data;
}

export async function getInstructorProfileService(id: string, token?: string) {
  const user = await User.findById(id).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "teacher") {
    throw new AppError("User is not an instructor", 400);
  }

  const instructorData = {
    id: user._id,
    username: user.username,
    bio: user.bio,
    headline: user.headline,
    socialMedia: user.socialMedia,
    profilePicture: user.profilePicture,
    instructorRating: user.instructorRating,
  }

  const stats = await getInstructorCoursesStatistics(id);

  const data = {
    ...instructorData,
    stats
  };

  return data;
}

const checkUsernameExists = async (username: string, userId: string) => {
  const usernameExists = await User.exists({
    username: username,
    _id: { $ne: userId },
  });

  if (usernameExists) {
    throw new AppError("Username already exists", 409);
  }
};

export async function updateProfileService(id: string, input: UpdateProfileInput, actor: PublicUser) {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const permissions = getUserPermissions(actor);

  assertPermission(permissions, "user", "update", { id });

  const definedInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Partial<PublicUser>;


  const updateData = permissions.pickPermittedFields("user", "update", definedInput, { id });

  const deniedFields = Object.keys(definedInput).filter((field) => !(field in updateData));

  if (deniedFields.length > 0) {
    throw new AppError(`You are not allowed to update the following fields: ${deniedFields.join(", ")}`, 403);
  }

  if (updateData.username && updateData.username !== user.username) {
    await checkUsernameExists(updateData.username, id);
  }

  Object.assign(user, updateData);

  await user.save()

  return user;
}


export async function updateUserService(id: string, input: UpdateUserByAdminInput, actor: PublicUser) {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const permissions = getUserPermissions(actor);

  assertPermission(permissions, "user", "update", { id });

  const definedInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Partial<PublicUser>;

  const updateData = permissions.pickPermittedFields("user", "update", definedInput, { id });

  const deniedFields = Object.keys(definedInput).filter((field) => !(field in updateData));

  if (deniedFields.length > 0) {
    throw new AppError(`You are not allowed to update the following fields: ${deniedFields.join(", ")}`, 403);
  }

  if (updateData.username && updateData.username !== user.username) {
    await checkUsernameExists(updateData.username, id);
  }

  Object.assign(user, updateData);

  await user.save();

  return user;

}

export async function deleteUserService(id: string, actor: PublicUser) {
  const permissions = getUserPermissions(actor);

  assertPermission(permissions, "user", "delete");

  if (id === actor.id) {
    throw new AppError("You cannot delete your own account", 403);
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }
}