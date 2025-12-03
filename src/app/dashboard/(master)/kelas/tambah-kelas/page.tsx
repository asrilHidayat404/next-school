import db from "@/src/lib/db"
import CreateClassForm from "@/src/modules/classes/components/CreateClassForm"

const page = async () => {
  const schoolOption = await db.school.findMany()
  return (
    <div>
      <CreateClassForm schoolOption={schoolOption} />
    </div>
  )
}

export default page