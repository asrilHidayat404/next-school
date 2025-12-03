import { copyDefaultAvatar } from "@/src/action/AuthenticationAction";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  // Ambil semua kelas yang tersedia
  const classes = await prisma.schoolClass.findMany();

  if (classes.length === 0) {
    console.log("❌ Tidak ada kelas ditemukan. Buat dulu data kelas sebelum seed siswa!");
    return;
  }

  // Tentukan total siswa
  const totalStudents = 1000;

  // Bagi rata siswa ke semua kelas
  const studentsPerClass = Math.ceil(totalStudents / classes.length);

  const genders = ["Laki-laki", "Perempuan"];

  // Generate data siswa
  const students = classes.flatMap((cls, classIdx) =>
    Array.from({ length: studentsPerClass }, (_, i) => {
      const index = classIdx * studentsPerClass + i + 1;
      return {
        full_name: `Student ${cls.class_name} ${i + 1}`,
        email: `student${index}@gmail.com`,
        password: hashedPassword,
        role_id: 5, // role_id untuk student
        class_id: cls.id_class,
        gender: genders[Math.floor(Math.random() * genders.length)],
        address: `Jl. Pendidikan No.${index}, Desa Pintar`,
        phone_number: `0812${Math.floor(10000000 + Math.random() * 89999999)}`,
      };
    })
  ).slice(0, totalStudents); // pastikan hanya 30 siswa

  // Loop buat seed
  for (const student of students) {
    // Buat user
    const createdUser = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        full_name: student.full_name,
        email: student.email,
        password: student.password,
        role_id: student.role_id,
        avatar: "",
        gender: student.gender,
        address: student.address,
        phone_number: student.phone_number,
      },
    });

    // Copy avatar default
    const avatarPath = await copyDefaultAvatar(
      "public/storage/avatar",
      createdUser.id
    );

    await prisma.user.update({
      where: { id: createdUser.id },
      data: { avatar: avatarPath },
    });

    // Buat data student yang terkait user dan kelas
    await prisma.student.upsert({
      where: { user_id: createdUser.id },
      update: {},
      create: {
        nis: `NIS${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")}`,
        user_id: createdUser.id,
        class_id: student.class_id,
        birth: new Date(),
        father_name: "Father",
        mother_name: "Mother"
      },
    });
  }

  console.log(`✅ ${students.length} siswa berhasil di-seed!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding students:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
