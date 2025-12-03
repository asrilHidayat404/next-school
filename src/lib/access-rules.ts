export const accessRules: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/dashboard\/?$/, roles: ["superadmin", "admin", "staff", "teacher", "student"] },
  { pattern: /^\/dashboard\/log-activity\/?$/, roles: ["superadmin", "admin"] },

  { pattern: /^\/dashboard\/users\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/admin$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/staff$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/teacher$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/student$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/guru$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/guru\/tambah-guru$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/guru\/edit-guru$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/?$/, roles: ["superadmin", "admin"] },
  
  { pattern: /^\/dashboard\/madrasah\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/madrasah\/tambah-madrasah$/, roles: ["superadmin", "admin"] },

  { pattern: /^\/dashboard\/kelas$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/kelas\/tambah-kelas$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/kelas\/[^\/]+$/, roles: ["superadmin", "admin"] },
  
  { pattern: /^\/dashboard\/siswa$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/siswa\/tambah-siswa$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/siswa\/edit-siswa$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/siswa\/profil$/, roles: ["superadmin", "admin"] },

  { pattern: /^\/dashboard\/mata-pelajaran\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/mata-pelajaran\/tambah-mata-pelajaran$/, roles: ["superadmin", "admin"] },

  
]
