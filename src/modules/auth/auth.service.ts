import crypto from 'crypto';
import { LoginInput, SignupInput, ResetPasswordInput } from './auth.schema';

import User from "@/modules/users/user.model";
import AppError from '@/common/errors/appError';

import type { PublicUser } from "@/modules/users/user.types";
import { generateAccessToken, verifyToken } from '@/common/utils/jwt';
import env from '@/config/env';
import { sendEmail } from '@/common/utils/email';
import forgotPasswordTemplate from '@/templates/forgot-password';
import welcomeTemplate from '@/templates/welcome';

export async function signupService(input: SignupInput): Promise<PublicUser> {
  const existingUser = await User.findOne({ $or: [{ email: input.email }, { username: input.username }] });

  if (existingUser) {
    if (existingUser.email === input.email) {
      throw new AppError("Email already exists", 409);
    }

    if (existingUser.username === input.username) {
      throw new AppError("Username already exists", 409);
    }
  }

  const user = await User.create(input)
  try {
    await sendEmail({
      to: input.email,
      subject: 'Welcome to our platform!',
      html: welcomeTemplate(user.username),
    })
  } catch (error) {
    console.log(error)
    // throw new AppError("There was an error sending the welcome email. Try again later!", 500);
  }
  return user

}

export async function loginService(input: LoginInput): Promise<PublicUser> {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }
  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
}

export async function refreshTokenService(token: string) {
  const verifiedToken = verifyToken(token, env.JWT_REFRESH_SECRET)

  const user = await User.findById(verifiedToken.sub)

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.changePasswordAfter(verifiedToken.iat)) {
    throw new AppError("User recently changed password! Please log in again.", 401);
  }

  return generateAccessToken(user.id)
}


export async function forgotPasswordService(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const resetToken = user.createResetToken()
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.FRONTEND_URL}/auth/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: forgotPasswordTemplate(user.username, resetUrl),
    })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError("There was an error sending the email. Try again later!", 500);
  }
}

export async function sessionService(token: string): Promise<PublicUser> {
  const verifiedToken = verifyToken(token, env.JWT_SECRET);

  const user = await User.findById(verifiedToken.sub);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.changePasswordAfter(verifiedToken.iat)) {
    throw new AppError("User recently changed password! Please log in again.", 401);
  }

  return user;
}

export async function resetPasswordService(token: string, input: ResetPasswordInput): Promise<PublicUser> {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  user.password = input.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user.toJSON();
}