import AppError from "@/common/errors/appError";
import { Cart } from "@/modules/cart/cart.types";
import { Chapter } from "@/modules/chapters/chapter.types";
import { Course, CourseStatus } from "@/modules/courses/course.types";
import { Enrollment } from "@/modules/enrollments/enrollment.types";
import { Lesson } from "@/modules/lessons/lesson.types";
import { Progress } from "@/modules/progress/progress.types";
import { Quiz } from "@/modules/quiz/quiz.types";
import { Rating } from "@/modules/ratings/rating.types";
import { PublicUser } from "@/modules/users/user.types";
import { Wishlist } from "@/modules/wishlists/wishlist.types";


export function getUserPermissions(user: PublicUser) {
  const builder = new PermissionBuilder();
  const role = user.role;

  switch (role) {
    case "admin":
      addAdminPermissions(builder)
      break;
    case "teacher":
      addTeacherPermissions(builder, user)
      break;
    case "student":
      addStudentPermissions(builder, user)
      break;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
  return builder.build();
}

type UserPermissions = ReturnType<typeof getUserPermissions>;

export function assertPermission<Res extends keyof Resources>(
  permissions: UserPermissions,
  resource: Res,
  action: Resources[Res]["action"],
  data?: Resources[Res]["condition"],
  field?: keyof Resources[Res]["data"],
  message = "You do not have permission to perform this action",
) {
  if (!permissions.can(resource, action, data, field)) {
    throw new AppError(message, 403);
  }
}

function addAdminPermissions(builder: PermissionBuilder) {
  builder
    .allow("user", "create")
    .allow("user", "read")
    .allow("user", "update")
    .allow("user", "delete")

    .allow("course", "create")
    .allow("course", "read")
    .allow("course", "update")
    .allow("course", "delete")

    .allow("chapter", "create")
    .allow("chapter", "read")
    .allow("chapter", "update")
    .allow("chapter", "delete")

    .allow("lesson", "create")
    .allow("lesson", "read")
    .allow("lesson", "update")
    .allow("lesson", "delete")

    .allow("enrollment", "create")
    .allow("enrollment", "read")
    .allow("enrollment", "delete")

    .allow("progress", "read")
    .allow("progress", "update")

    .allow("rating", "create")
    .allow("rating", "read")
    .allow("rating", "update")
    .allow("rating", "delete")

    .allow("wishlist", "create")
    .allow("wishlist", "read")
    .allow("wishlist", "delete")

    .allow("cart", "create")
    .allow("cart", "read")
    .allow("cart", "update")
    .allow("cart", "delete")

    .allow("quiz", "create")
    .allow("quiz", "read")
    .allow("quiz", "update")
    .allow("quiz", "delete")
}

function addTeacherPermissions(builder: PermissionBuilder, user: PublicUser) {
  builder
    .allow("user", "read", { id: user.id })
    .allow("user", "update", { id: user.id }, ["username", "bio", "headline", "socialMedia", "profilePicture"])

    .allow("course", "create")
    .allow("course", "read", { instructorId: user.id })
    .allow("course", "read", { status: CourseStatus.Published })
    .allow("course", "update", { instructorId: user.id })
    .allow("course", "delete", { instructorId: user.id })

    .allow("chapter", "create", { instructorId: user.id })
    .allow("chapter", "read", { instructorId: user.id })
    .allow("chapter", "update", { instructorId: user.id })
    .allow("chapter", "delete", { instructorId: user.id })

    .allow("lesson", "create", { instructorId: user.id })
    .allow("lesson", "read", { instructorId: user.id })
    .allow("lesson", "update", { instructorId: user.id })
    .allow("lesson", "delete", { instructorId: user.id })

    .allow("quiz", "create")
    .allow("quiz", "read", { instructorId: user.id })
    .allow("quiz", "update", { instructorId: user.id })
    .allow("quiz", "delete", { instructorId: user.id })


    .allow("enrollment", "create")
    .allow("enrollment", "read", { userId: user.id })
    .allow("enrollment", "delete", { userId: user.id })

    .allow("rating", "read")
}

function addStudentPermissions(builder: PermissionBuilder, user: PublicUser) {
  builder
    .allow("user", "read", { id: user.id })
    .allow("user", "update", { id: user.id }, ["username", "bio", "headline", "socialMedia", "profilePicture"])

    .allow("course", "read", { status: CourseStatus.Published })

    .allow("enrollment", "create")
    .allow("enrollment", "read", { userId: user.id })
    .allow("enrollment", "delete", { userId: user.id })

    .allow("progress", "read", { userId: user.id })
    .allow("progress", "update", { userId: user.id })

    .allow("rating", "create")
    .allow("rating", "read")
    .allow("rating", "update", { userId: user.id })
    .allow("rating", "delete", { userId: user.id })

    .allow("wishlist", "create")
    .allow("wishlist", "read", { userId: user.id })
    .allow("wishlist", "delete", { userId: user.id })

    .allow("cart", "create")
    .allow("cart", "read", { userId: user.id })
    .allow("cart", "update", { userId: user.id })
    .allow("cart", "delete", { userId: user.id })
}


export interface Resources {
  user: {
    action: "create" | "read" | "update" | "delete";
    condition: Pick<PublicUser, "id">;
    data: PublicUser;
  },
  course: {
    action: "create" | "read" | "update" | "delete";
    condition: Partial<{ instructorId: string; status: CourseStatus }>;
    data: Course;
  },
  chapter: {
    action: "create" | "read" | "update" | "delete";
    condition: Partial<{ instructorId: string }>
    data: Chapter;
  },
  lesson: {
    action: "create" | "read" | "update" | "delete";
    condition: Partial<{ instructorId: string; }>
    data: Lesson;
  },
  enrollment: {
    action: "create" | "read" | "delete",
    condition: Partial<{ userId: string; courseId: string; }>
    data: Enrollment
  },
  progress: {
    action: "read" | "update",
    condition: Partial<{ userId: string; courseId: string; }>
    data: Progress
  },
  rating: {
    action: "create" | "read" | "update" | "delete",
    condition: Partial<{ userId: string; courseId: string; }>
    data: Rating
  },
  wishlist: {
    action: "create" | "read" | "delete",
    condition: Partial<{ userId: string; courseId: string; }>
    data: Wishlist
  },
  cart: {
    action: "create" | "read" | "update" | "delete",
    condition: Partial<{ userId: string; courseId: string; }>
    data: Cart
  },
  quiz: {
    action: "create" | "read" | "update" | "delete",
    condition: Partial<{ instructorId: string; }>
    data: Quiz
  }
}


type Permission<Res extends keyof Resources> = {
  action: Resources[Res]["action"];
  condition: Partial<Resources[Res]["condition"]>;
  fields?: (keyof Resources[Res]["data"])[];
}

type PermissionStore = {
  [Res in keyof Resources]: Permission<Res>[]
}

export class PermissionBuilder {
  #permissions: PermissionStore = {
    user: [],
    course: [],
    chapter: [],
    lesson: [],
    enrollment: [],
    progress: [],
    rating: [],
    wishlist: [],
    cart: [],
    quiz: []
  }

  allow<Res extends keyof Resources>(
    resource: Res,
    action: Resources[Res]["action"],
    condition: Partial<Resources[Res]["condition"]> = {},
    fields?: (keyof Resources[Res]["data"])[]
  ) {
    this.#permissions[resource].push({ action, condition, fields });
    return this;
  }

  private matchCondition(
    condition: Record<string, unknown>,
    data: Record<string, unknown>,
  ): boolean {
    return Object.entries(condition).every(([key, expected]) => {
      const actual = data[key];

      return Array.isArray(expected)
        ? expected.includes(actual)
        : actual === expected;
    });
  }

  build() {
    const permissions = this.#permissions;
    const matchCondition = this.matchCondition.bind(this);

    return {
      can<Res extends keyof Resources>(
        resource: Res,
        action: Resources[Res]["action"],
        data?: Resources[Res]["condition"],
        field?: (keyof Resources[Res]["data"])
      ) {
        const resourcePermissions = permissions[resource] ?? [];

        return resourcePermissions.some(permission => {
          if (permission.action !== action) {
            return false;
          }

          const hasCondition = Object.keys(permission.condition ?? {}).length > 0;

          if (
            hasCondition &&
            (!data || !matchCondition(permission.condition, data))
          ) {
            return false;
          }

          if (!permission.fields || !field) {
            return true;
          }

          return permission.fields.includes(field);
        }

        )
      },

      pickPermittedFields<Res extends keyof Resources>(
        resource: Res,
        action: Resources[Res]["action"],
        newData: Partial<Resources[Res]["data"]>,
        data?: Resources[Res]["condition"],
      ): Partial<Resources[Res]["data"]> {
        const rules = permissions[resource] as Permission<Res>[];

        const matching = rules.filter(permission => {
          if (permission.action !== action) {
            return false;
          }

          if (!permission.condition) {
            return true;
          }

          return data != null &&
            matchCondition(permission.condition, data);
        });

        if (matching.length === 0) {
          return {};
        }

        if (matching.some(permission => permission.fields == null)) {
          return newData;
        }

        const allowedFields = new Set(
          matching.flatMap(permission => permission.fields ?? [])
        );

        const result: Partial<Resources[Res]["data"]> = {};

        for (const field of allowedFields) {
          if (field in newData) {
            result[field] = newData[field];
          }
        }

        return result;
      }
    }
  }

}