import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🧩 Definisi daftar pelajaran per jenjang
  const subjectData = [
    {
      school_name: "TK",
      subjects: ["Mewarnai", "Berhitung Dasar", "Membaca", "Doa dan Adab"],
    },
    {
      school_name: "Madrasah Ibtidaiyah",
      subjects: [
        "Matematika",
        "Bahasa Indonesia",
        "IPA",
        "IPS",
        "Pendidikan Agama Islam",
        "Bahasa Arab",
      ],
    },
    {
      school_name: "Madrasah Tsanawiyah",
      subjects: [
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Arab",
        "Aqidah Akhlak",
        "Al-Qur'an Hadits",
        "Fiqih",
        "Sejarah Kebudayaan Islam",
      ],
    },
    {
      school_name: "Madrasah Aliyah",
      subjects: [
        "Matematika",
        "Bahasa Inggris",
        "Bahasa Arab",
        "Tafsir Hadits",
        "Fiqih",
        "Aqidah Akhlak",
        "Sejarah Kebudayaan Islam",
      ],
    },
  ];

  for (const item of subjectData) {
    // 🔹 Cari sekolah berdasarkan nama
    const school = await prisma.school.findUnique({
      where: { school_name: item.school_name },
      include: { classes: true },
    });

    if (!school) {
      console.warn(`⚠️ Sekolah ${item.school_name} tidak ditemukan, dilewati.`);
      continue;
    }

    console.log(`🏫 Menambahkan pelajaran untuk ${school.school_name}`);

    // 🔹 Tambahkan subject ke setiap kelas dalam sekolah
    for (const schoolClass of school.classes) {
      for (const subjectName of item.subjects) {
        await prisma.subject.upsert({
          where: {
            subject_name_class_id: {
              subject_name: subjectName,
              class_id: schoolClass.id_class,
            },
          },
          update: {},
          create: {
            subject_name: subjectName,
            class_id: schoolClass.id_class,
          },
        });
        console.log(`  📘 ${subjectName} → ${schoolClass.class_name}`);
      }
    }
  }

  console.log("✅ Seeder mata pelajaran selesai dijalankan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding subjects:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
