import path from "path";
import { promises as fs } from "fs";


export const StorageDisk = async (file: any, targetDir: string) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), targetDir);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);
    // return informasi berguna
    return {
        fileName,
        filePath,
        url: `/${targetDir}/${fileName}`, // bisa dipakai di frontend
    };
}