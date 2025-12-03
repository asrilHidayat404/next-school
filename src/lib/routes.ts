import {
  BookOpen,
  Bot,
  Frame,
  GraduationCapIcon,
  PieChart,
  School,
  Settings2,
  SquareTerminal,
  University,
  Users2,
} from "lucide-react";

export const data = {
    /** ==============================
   *  PENGATURAN SISTEM
   *  ============================== */
  settings: [
    // {
    //   title: "Pengaturan",
    //   url: "/dashboard/settings",
    //   icon: Settings2,
    //   roles: ["superadmin", "admin"],
    //   items: [
    //     {
    //       title: "Profil Sekolah",
    //       url: "/dashboard/settings/general",
    //       roles: ["superadmin", "admin"],
    //     },
    //     {
    //       title: "Reset Password",
    //       url: "/dashboard/settings/auth",
    //       roles: ["superadmin"],
    //     },
    //   ],
    // },
  ],

  
  /** ==============================
   *  MANAJEMEN PENGGUNA / USER
   *  ============================== */
  users: [
    // {
    //   title: "Pengguna",
    //   url: "/dashboard/users",
    //   icon: Users2,
    //   roles: ["superadmin", "admin"],
    //   items: [
    //     {
    //       title: "Semua Pengguna",
    //       url: "/dashboard/users",
    //       roles: ["superadmin", "admin"],
    //     },
    //     {
    //       title: "Admin",
    //       url: "/dashboard/users/admin",
    //       roles: ["superadmin"],
    //     },
    //     {
    //       title: "Staff",
    //       url: "/dashboard/users/staff",
    //       roles: ["superadmin", "admin"],
    //     },
    //     {
    //       title: "Teacher",
    //       url: "/dashboard/users/teacher",
    //       roles: ["superadmin", "admin"],
    //     },
    //     {
    //       title: "Student",
    //       url: "/dashboard/users/student",
    //       roles: ["superadmin", "admin"],
    //     },
    //   ],
    // },
  ],



  /** ==============================
   *  MANAJEMEN AKADEMIK
   *  ============================== */
  academic: [
    // {
    //   title: "Laporan",
    //   url: "/dashboard",
    //   icon: SquareTerminal,
    //   roles: ["superadmin", "admin", "teacher", "staff", "student"],
    // },
    {
      title: "Akademik",
      url: "/dashboard/academic",
      icon: GraduationCapIcon,
      roles: ["superadmin", "admin"],
      items: [
        {
          title: "Guru",
          url: "/dashboard/guru",
          roles: ["superadmin", "admin"],
        },
        {
          title: "Siswa",
          url: "/dashboard/siswa",
          roles: ["superadmin", "admin"],
        },
        {
          title: "Kelas",
          url: "/dashboard/kelas",
          roles: ["superadmin", "admin"],
        },
        {
          title: "Mata Pelajaran",
          url: "/dashboard/mata-pelajaran",
          roles: ["superadmin", "admin"],
        },
      ],
    },
    // {
    //   title: "Pembelajaran",
    //   url: "/dashboard/academic",
    //   icon: GraduationCapIcon,
    //   roles: ["superadmin", "admin"],
    //   items: [
    //     {
    //       title: "Mata Pelajaran",
    //       url: "/dashboard/users/teacher",
    //       roles: ["superadmin", "admin"],
    //     },
    //     {
    //       title: "Penilaian",
    //       url: "/dashboard/users/student",
    //       roles: ["superadmin", "admin"],
    //     },
    //   ],
    // },
  ],

  /** ==============================
   *  MANAJEMEN LEMBAGA / SEKOLAH
   *  ============================== */
  institution: [
    //  {
    //   title: "Laporan",
    //   url: "/dashboard",
    //   icon: SquareTerminal,
    //   roles: ["superadmin", "admin", "teacher", "staff", "student"],
    // },
    {
      title: "Lembaga",
      url: "/dashboard/institution",
      icon: School,
      roles: ["superadmin", "admin"],
      items: [
        {
          title: "Madrasah",
          url: "/dashboard/madrasah",
          roles: ["superadmin", "admin"],
        },
        {
          title: "Kelas",
          url: "/dashboard/classess",
          roles: ["superadmin", "admin"],
        },
      ],
    },
  ],


};
