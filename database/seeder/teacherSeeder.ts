import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { copyDefaultAvatar } from "@/src/action/AuthenticationAction"; // sesuaikan path sesuai proyekmu

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  // Ambil semua kelas beserta nama sekolahnya
  const allClasses = await prisma.schoolClass.findMany({
    include: {
      school: true,
    },
  });

  if (allClasses.length === 0) {
    console.log("❌ Tidak ada kelas ditemukan! Jalankan seeder sekolah & kelas dulu.");
    return;
  }

  const genders = ["Laki-laki", "Perempuan"];

  for (const classData of allClasses) {
    const gender = genders[Math.floor(Math.random() * genders.length)];

    // Nama guru berdasarkan kelas dan sekolah
    const fullName = `Guru Kelas ${classData.class_name} ${classData.school.school_name}`;

    // Email unik berdasarkan kelas
    const safeClass = classData.class_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "");
    const safeSchool = classData.school.school_name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "");

    const email = `${safeClass}_${safeSchool}@gmail.com`;

    const teacherData = {
      full_name: fullName,
      email,
      password: hashedPassword,
      role_id: 4, // role guru
      gender,
      address: `Jl. Pendidikan ${classData.class_name} ${classData.school.school_name}`,
      phone_number: `08${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      class_id: classData.id_class,
    };

    // 🔹 Buat User
    const createdUser = await prisma.user.upsert({
      where: { email: teacherData.email },
      update: {},
      create: {
        full_name: teacherData.full_name,
        email: teacherData.email,
        password: teacherData.password,
        role_id: teacherData.role_id,
        gender: teacherData.gender,
        address: teacherData.address,
        phone_number: teacherData.phone_number,
        avatar: "",
      },
    });

    // 🔹 Copy avatar default
    const avatarPath = await copyDefaultAvatar(
      "public/storage/avatar",
      createdUser.id
    );

    await prisma.user.update({
      where: { id: createdUser.id },
      data: { avatar: avatarPath },
    });

    // 🔹 Buat data guru terkait user & kelas
    await prisma.teacher.upsert({
      where: { user_id: createdUser.id },
      update: {},
      create: {
        nip: `NIP${Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(9, "0")}`,
        user_id: createdUser.id,
        teaching_classes_id: teacherData.class_id,
      },
    });

    console.log(`👨‍🏫 ${fullName} (${email}) berhasil dibuat!`);
  }

  console.log(`✅ ${allClasses.length} guru berhasil di-seed sesuai kelasnya!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding teachers:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
