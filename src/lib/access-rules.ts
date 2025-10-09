export const accessRules: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/dashboard\/users\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/admin$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/staff$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/teacher$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/users\/student$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/masters\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/masters\/schools\/?$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/masters\/classes$/, roles: ["superadmin", "admin"] },
  { pattern: /^\/dashboard\/masters\/lessons$/, roles: ["superadmin", "admin"] },
]
