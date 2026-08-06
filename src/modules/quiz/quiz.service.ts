import { Types } from "mongoose";
import { QuizAttemptModel } from "./quiz.model";

export async function getStudentQuizStatistics(studentId: string) {
  const [stats] = await QuizAttemptModel.aggregate([
    {
      $match: {
        student: new Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: null,

        totalAttempts: {
          $sum: 1,
        },

        passedAttempts: {
          $sum: {
            $cond: ["$passed", 1, 0],
          },
        },

        averageScore: {
          $avg: "$percentage",
        },

        totalCorrectAnswers: {
          $sum: "$correctAnswers",
        },

        totalQuestions: {
          $sum: "$totalQuestions",
        },
      },
    },
    {
      $project: {
        _id: 0,

        totalAttempts: 1,

        passedAttempts: 1,

        averageScore: {
          $round: ["$averageScore", 1],
        },

        passRate: {
          $cond: [
            { $eq: ["$totalAttempts", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$passedAttempts",
                        "$totalAttempts",
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          ],
        },

        overallCorrectPercentage: {
          $cond: [
            { $eq: ["$totalQuestions", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$totalCorrectAnswers",
                        "$totalQuestions",
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          ],
        },
      },
    },
  ]);

  return (
    stats ?? {
      totalAttempts: 0,
      passedAttempts: 0,
      averageScore: 0,
      passRate: 0,
      overallCorrectPercentage: 0,
    }
  );
}