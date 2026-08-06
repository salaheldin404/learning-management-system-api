import { Types } from "mongoose";
import Course from "./course.model";


export async function getInstructorCoursesStatistics(instructorId: string) {
  const stats = await Course.aggregate([
    { $match: { instructor: new Types.ObjectId(instructorId), status: "published" } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalEnrollments: { $sum: "$enrollmentsCount" },
        averageRating: { $avg: "$ratingsSummary.averageRating" },
        totalRatings: { $sum: "$ratingsSummary.totalRatings" },
      },
    },
    {
      $project: {
        _id: 0,
        totalCourses: 1,
        totalEnrollments: 1,
        totalRatings: 1,
        averageRating: {
          $round: ["$averageRating", 1],
        }
      }
    }
  ]);

  return stats[0] || {
    totalCourses: 0,
    totalEnrollments: 0,
    averageRating: 0,
  };
}