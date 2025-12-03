import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Data sekolah dan kelas
  const schoolsData = [
    {
      school_name: "TK",
      classes: ["Nol Kecil", "Nol Besar"],
    },
    {
      school_name: "Madrasah Ibtidaiyah",
      classes: ["1", "2", "3", "4", "5", "6"],
    },
    {
      school_name: "Madrasah Tsanawiyah",
      classes: ["1", "2", "3"],
    },
    {
      school_name: "Madrasah Aliyah",
      classes: ["1", "2", "3"],
    },
  ];

  for (const school of schoolsData) {
    // 🔹 Pastikan `school_name` unik di Prisma schema
    const createdSchool = await prisma.school.upsert({
      where: { school_name: school.school_name },
      update: {},
      create: { school_name: school.school_name },
    });

    console.log(`✅ Sekolah: ${createdSchool.school_name}`);

    for (const className of school.classes) {
      // 🔹 Pastikan `class_name` benar-benar unik secara global
      const uniqueClassName = `${school.school_name} - ${className}`;

      const createdClass = await prisma.schoolClass.upsert({
        where: {
          school_id_class_name: {
            school_id: createdSchool.id_school,
            class_name: uniqueClassName,
          },
        },
        update: {},
        create: {
          class_name: uniqueClassName,
          school_id: createdSchool.id_school,
        },
      });

      console.log(
        `  🏫 Kelas: ${createdClass.class_name} (Sekolah: ${createdSchool.school_name})`
      );
    }
  }

  console.log("✅ Seeder sekolah dan kelas selesai dijalankan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding schools and classes:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
