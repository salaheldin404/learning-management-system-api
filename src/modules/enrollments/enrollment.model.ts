import { Enrollment } from "@/modules/enrollments/enrollment.types";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const enrollmentSchema = new Schema<Enrollment>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    progress: [{ type: Schema.Types.ObjectId, ref: "Progress" }],
  },
  { timestamps: true },
);


const EnrollmentModel = models.Enrollment || model<Enrollment>("Enrollment", enrollmentSchema); 

export default EnrollmentModel;