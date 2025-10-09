import { Prisma } from "@prisma/client";

export interface Role {
  id: number;
  role_name: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  password?: string | null;
  emailVerified: Date | null;
  avatar: string | null;
  role_id: number;
  role?: Role | null;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

// role bisa null
export type UserWithRole = Prisma.UserGetPayload<{
  include: {
    role: {
      select: { role_name: true };
    };
  };
}> & {
  role: {
    id: number;
    role_name: string;
    createdAt: string | number | Date;
    updatedAt: string | number | Date;
  } | null;
};

export type ActivityLogWithUser = Prisma.ActivityLogGetPayload<{
  include: {
    user: {
      include: {
        role: true;
      };
    };
  };
}>;
