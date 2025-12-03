import db from "@/src/lib/db";
import EditStudentForm from "@/src/modules/students/components/EditStudentForm";

type Props = {
  searchParams: { student_id: string };
};

const page = async ({ searchParams }: Props) => {
  const student_id = searchParams.student_id;
  console.log("Student ID:", student_id);

  const student = await db.student.findUnique({
    where: { id_student: student_id },
    include: { 
        user: true, 
        class: true
    },
  });
  console.log({student});
  

  if (!student) return <div>Siswa tidak ditemukan</div>;
  
  const studentData = {
    id_student: student.id_student,
    nis: student.nis,
    full_name: student.user.full_name,
    email: student.user.email,
    school_id: student.class.school_id,
    class_id: student.class.id_class,
    father_name: student.father_name,
    mother_name: student.mother_name,
    address: student.user.address,
    birth: student.birth?.toISOString().split("T")[0] || "",
    gender: student.user.gender,
    phone_number: student.user.phone_number,
  };

  const schools = await db.school.findMany();
  const classes = await db.schoolClass.findMany();
  return (
    <main>
        <EditStudentForm studentData={studentData} schoolOption={schools} classOption={classes} />
    </main>
  )

//   return 
};

export default page;
