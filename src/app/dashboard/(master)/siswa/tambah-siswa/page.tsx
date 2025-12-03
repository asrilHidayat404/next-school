import db from "@/src/lib/db";
import CreateStudentForm from "@/src/modules/students/components/CreateStudentForm";

const page = async () => {
    const schoolOption = await db.school.findMany()
    const schoolClassOption = await db.schoolClass.findMany()
  return (
    <div>
      <CreateStudentForm schoolOption={schoolOption} classOption={schoolClassOption} />
    </div>
  );
};

export default page;
