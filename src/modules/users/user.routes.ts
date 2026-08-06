import { protectRouter } from "@/common/middlewares/protect"
import catchAsync from '@/common/errors/catchAsync';

import express from "express"
import { getAllUsers, getUserProfile, updateProfile, updateUserByAdmin, deleteUser, getInstructorProfile } from "./user.controller"
import { validate } from "@/common/middlewares/validate";
import { updateUserSchema, userIdParamSchema, updateProfileSchema } from "./user.schema";

const router = express.Router()


router.get("/instructors/:userId", validate({ params: userIdParamSchema }), catchAsync(getInstructorProfile))

router.use(protectRouter)

// current user

router.get("/me", catchAsync(getUserProfile))

router.patch('/me', validate({ body: updateProfileSchema }), catchAsync(updateProfile))


// admin routes
router.get("/", catchAsync(getAllUsers))
router.patch("/:userId", validate({ params: userIdParamSchema, body: updateUserSchema }), catchAsync(updateUserByAdmin))
router.delete("/:userId", validate({ params: userIdParamSchema }), catchAsync(deleteUser))

export default router
