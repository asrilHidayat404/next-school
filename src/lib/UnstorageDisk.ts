import path from "path";
import { promises as fs } from "fs";

export const UnstorageDisk =async (filePath: string) => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    await fs.unlink(absolutePath);
    console.log(`✅ File deleted: ${absolutePath}`);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`⚠️ File not found: ${filePath}`);
    } else {
      throw error;
    }
  }
}