import db from '@/src/lib/db';
import { EditTeacherForm } from '@/src/modules/teachers/components/EditTeacherForm'
import React from 'react'

type Props = {
  searchParams: { teacher_id: string };
};

const page = async ({ searchParams }: Props) => {
      const teacher_id = searchParams.teacher_id;
  console.log("Teacher ID:", teacher_id);

  const teacher = await db.teacher.findUnique({
    where: { id_teacher: teacher_id },
    include: { 
        user: true, 
    },
  });
  

  if (!teacher) return <div>Siswa tidak ditemukan</div>;
  return (
    <div>
      <EditTeacherForm teacherData={teacher} />
    </div>
  )
}

export default page
