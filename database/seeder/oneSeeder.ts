import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Memulai proses seeding...\n");

  // 1️⃣ Role
  const rolesData = [
    { name: "superadmin" },
    { name: "admin" },
    { name: "staff" },
    { name: "teacher" },
    { name: "student" },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { role_name: role.name },
      update: {},
      create: { role_name: role.name },
    });
  }
  console.log("✅ Role berhasil dibuat!\n");

  // 2️⃣ Super Admin
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.upsert({
    where: { email: "super.admin@gmail.com" },
    update: {},
    create: {
      full_name: "Super Admin",
      email: "super.admin@gmail.com",
      password: hashedPassword,
      role_id: 1,
      avatar: "",
    },
  });
  console.log("👑 Super Admin dibuat!\n");

  // 3️⃣ Sekolah + Kelas
  const schoolsData = [
    { school_name: "Madrasah Ibtidaiyah", classCount: 6 },
    { school_name: "Madrasah Tsanawiyah", classCount: 3 },
    { school_name: "Madrasah Aliyah", classCount: 3 },
  ];

  for (const school of schoolsData) {
    const createdSchool = await prisma.school.upsert({
      where: { school_name: school.school_name },
      update: {},
      create: { school_name: school.school_name },
    });

    console.log(`🏫 ${createdSchool.school_name}`);

    // Buat kelas
    const classRecords = [];
    for (let i = 1; i <= school.classCount; i++) {
      const fullClassName = `${school.school_name} - Kelas ${i}`;
      const newClass = await prisma.schoolClass.upsert({
        where: {
          school_id_class_name: {
            school_id: createdSchool.id_school,
            class_name: fullClassName,
          },
        },
        update: {},
        create: {
          class_name: fullClassName,
          school_id: createdSchool.id_school,
        },
      });

      classRecords.push(newClass);
      console.log(`   ↳ Kelas dibuat: ${fullClassName}`);
    }

    // 4️⃣ Guru
    const teacherUsers = [];
    for (let i = 1; i <= 10; i++) {
      const name = `Guru ${school.school_name.split(" ")[1]} ${i}`;
      const email = `guru${i}.${school.school_name
        .replace(/\s+/g, "")
        .toLowerCase()}@example.com`;

      const user = await prisma.user.create({
        data: {
          full_name: name,
          email,
          password: await bcrypt.hash("password123", 10),
          role: { connect: { role_name: "teacher" } },
        },
      });
      const teacher = await prisma.teacher.create({
        data: {
          nip: `${createdSchool.id_school}${i.toString().padStart(3, "0")}`,
          user_id: user.id,
        },
      });
      teacherUsers.push(teacher);
    }
    console.log(`   👨‍🏫 ${teacherUsers.length} guru dibuat!`);

    // 5️⃣ Siswa per kelas
    for (const classItem of classRecords) {
      for (let j = 1; j <= 30; j++) {
        const name = `Siswa ${classItem.class_name.split(" ").pop()}-${j}`;
        const email = `siswa${j}.${classItem.class_name
          .replace(/\s+/g, "")
          .toLowerCase()}@example.com`;

        const user = await prisma.user.create({
          data: {
            full_name: name,
            email,
            password: await bcrypt.hash("password123", 10),
            role: { connect: { role_name: "student" } },
          },
        });

        await prisma.student.create({
          data: {
            nis: `${classItem.id_class}${j.toString().padStart(3, "0")}`,
            user_id: user.id,
            class_id: classItem.id_class,
          },
        });
      }
      console.log(`   👦 30 siswa dibuat untuk ${classItem.class_name}`);
    }

    // 6️⃣ Set Wali Kelas
    for (const [index, classItem] of classRecords.entries()) {
      const selectedTeacher = teacherUsers[index % teacherUsers.length];
      await prisma.schoolClass.update({
        where: { id_class: classItem.id_class },
        data: { homeroom_teacher_id: selectedTeacher.id_teacher },
      });
    }

    console.log(
      `📘 Wali kelas ditetapkan untuk semua kelas di ${school.school_name}\n`
    );
  }

  console.log("🎉 SEEDING SELESAI TANPA ERROR!\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
