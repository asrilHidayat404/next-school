import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import db from "@/src/lib/db";
import { paginate } from "@/src/lib/paginate";
import { Prisma } from "@prisma/client";

const getAllStudents = async (
  searchQuery: string,
  currentPage: number
) => {
  const whereClause = buildSearchWhere({}, searchQuery, [
    "nis",
    "user.full_name",
    "user.email",
  ]);
  const { data: student, pagination } = await paginate<
    typeof db.student,
    Prisma.StudentFindManyArgs,
    Prisma.StudentGetPayload<{
      include: {
        user: true;
      };
    }>[]
  >({
    model: db.student,
    args: {
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    },
    page: currentPage,
    perPage: 10,
  });

  return { student, pagination };
};

const getStudentProfileById = async (studentId: string) => {
  const student = await db.student.findUnique({
    where: {
      id_student: studentId,
    },
    include: {
      user: true,
      class: {
        include: {
          homeroom_teacher: {
            include: {
              user: true,
            },
          },
          school: true,
        },
      },
    },
  });

  return student;
};

export const studentService = {
    getAllStudents, getStudentProfileById
}
