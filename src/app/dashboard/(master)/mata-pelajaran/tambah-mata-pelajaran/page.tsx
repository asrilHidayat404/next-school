import db from "@/src/lib/db"
import CreateSubjectForm from "@/src/modules/subjects/features/CreateSubjectForm"

const page = async () => {
  const schoolOption = await db.school.findMany({
    include: {
        classes: true
    }
  })
  
  return (
    <div>
      <CreateSubjectForm schoolOption={schoolOption} />
    </div>
  )
}

export default page