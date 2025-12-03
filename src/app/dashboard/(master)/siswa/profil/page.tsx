import db from "@/src/lib/db";
import { StudentProfile } from "@/src/modules/classes/components/StudentProfile";
import { studentService } from "@/src/modules/students/services/StudentServices";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: {
    student_id: string;
  };
}) => {
  const id = searchParams.student_id;
  if (!id) {
    notFound();
  }
  const student = await studentService.getStudentProfileById(id)
  if (!student) {
    notFound();
  }

  return <StudentProfile student={student} />;
};

export default page;
