import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/views/components/ui/select";
import { FilterList } from "../components/FilterList";
import db from "@/src/lib/db";


export async function FilterByClass() {
    const classes = await db.schoolClass.findMany({
        include:{
            school: true
        }
    })

  return <FilterList classes={classes} />
}
