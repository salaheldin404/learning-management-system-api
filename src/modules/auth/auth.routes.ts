import express from "express"

import { signup, login, logout, refreshToken, forgotPassword, session, resetPassword } from "./auth.controller"
import catchAsync from "@/common/errors/catchAsync"
import { validate } from "@/common/middlewares/validate"
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, resetPasswordParamsSchema } from "./auth.schema"

const router = express.Router()


router.post("/signup", validate({ body: signupSchema }), catchAsync(signup))
router.post("/login", validate({ body: loginSchema }), catchAsync(login))
router.post("/logout", catchAsync(logout))
router.post("/refreshToken", catchAsync(refreshToken))
router.post("/forgotPassword", validate({ body: forgotPasswordSchema }), catchAsync(forgotPassword))
router.post("/resetPassword/:token", validate({ params: resetPasswordParamsSchema, body: resetPasswordSchema }), catchAsync(resetPassword))
router.get("/session", catchAsync(session))



export default router