import { copyDefaultAvatar } from "@/src/action/AuthenticationAction";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  // Generate 20 user dummy
  const users = Array.from({ length: 20 }, (_, i) => ({
    full_name: `User ${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    password: hashedPassword,
    role_id: 2,
    avatar: "", // nanti bisa isi default avatar
  }));

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email }, // unique
      update: {},
      create: user,
    });
    // Copy avatar setelah user dibuat
    const avatarPath = await copyDefaultAvatar(
      "public/storage/avatar",
      createdUser.id.toString()
    );

    // Update avatar user
    await prisma.user.update({
      where: { id: createdUser.id },
      data: { avatar: avatarPath },
    });
  }

  console.log("✅ 20 users dengan role_id = 2 berhasil di-seed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding users:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
