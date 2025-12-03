import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const roles = ["superadmin", "admin", "staff", "teacher", "student"];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role_name: role },
      update: {}, // tidak di-update kalau sudah ada
      create: { role_name: role },
    });
  }

  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      full_name: "Super Admin",
      email: "super.admin@gmail.com",
      password: hashedPassword,
      role_id: 1,
      phone_number: "082324892",
      address: "Indonesia",
      gender: "male",
      avatar: "", // nanti bisa isi default avatar
    },
  });

  console.log("✅ Default roles and user seeded:", roles.join(", "));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding roles:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
