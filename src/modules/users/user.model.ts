import mongoose, { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

import slugify from "slugify";
import type { User as UserType, UserMethods } from "./user.types";
import { socialValidator } from "@/common/validators/social.validator";
import { Model } from "mongoose";

type UserDocument = HydratedDocument<UserType, UserMethods>;

const { Schema, model, models } = mongoose;

const userSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      validate: {
        validator: function (v: string) {
          if (v === "") return true;
          if (typeof v !== "string") return false;
          const trimmed = v.trim();
          return trimmed.length >= 20 && trimmed.length <= 500;
        },
        message: "Biography must be between 20-500 characters",
      },
    },
    headline: {
      type: String,
      default: "",
      maxLength: [60, "Headline must be less than 60 characters"],
      trim: true,
    },
    socialMedia: {
      github: {
        type: String,
        trim: true,
        default: "",
        validate: socialValidator(
          /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
          "GitHub",
          "1-39 characters, alphanumeric and hyphens",
        ),
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
        validate: socialValidator(
          /^[a-z0-9-]{3,100}$/i,
          "LinkedIn",
          "3-100 characters, alphanumeric and hyphens",
        ),
      },
      facebook: {
        type: String,
        trim: true,
        default: "",
        validate: socialValidator(
          /^[a-z0-9.]{5,50}$/i,
          "Facebook",
          "5-50 characters, alphanumeric and dots",
        ),
      },
      instagram: {
        type: String,
        trim: true,
        default: "",
        validate: socialValidator(
          /^[a-zA-Z0-9._]{1,30}$/,
          "Instagram",
          "1-30 characters",
        ),
      },
    },
    instructorRating: {
      averageRatings: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    profilePicture: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    createdCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    completedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    certificates: [
      {
        course: { type: Schema.Types.ObjectId, ref: "Course" },
        issuedAt: { type: Date, default: Date.now },
        certificateUrl: {
          public_id: { type: String, required: true },
          url: { type: String, required: true },
        },
      },
    ],
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordChangedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.passwordChangedAt;
        delete ret.__v;
        delete ret.password
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("socialLinks").get(function () {
  const socialMedia = this.socialMedia;
  if (!socialMedia) return null;
  return {
    github: socialMedia.github
      ? `https://github.com/${socialMedia.github}`
      : null,
    linkedin: socialMedia.linkedin
      ? `https://linkedin.com/in/${socialMedia.linkedin}`
      : null,
    facebook: socialMedia.facebook
      ? `https://facebook.com/${socialMedia.facebook}`
      : null,
    instagram: socialMedia.instagram
      ? `https://instagram.com/${socialMedia.instagram}`
      : null,
  };
});

// --- Slug generation, with collision fallback --------------------------
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("username")) return;

  this.slug = slugify(this.username, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
});

// --- Password hashing ---------------------------------------------------
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) {
    // shave 1s so the JWT-issued-after-change check below is reliable
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

userSchema.methods.comparePassword = function (
  this: UserDocument,
  candidate: string,
) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.changePasswordAfter = function (
  this: UserDocument,
  JWTTimestamp: number,
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createResetToken = function (this: UserDocument) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

type UserModel = Model<UserType, {}, UserMethods>;

const User = model<UserType, UserModel>("User", userSchema);

export default User;

