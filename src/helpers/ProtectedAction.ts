import { auth } from "../lib/auth";

export const ProtectedAction = async (
  allowedRoles: string[],
  callback: () => void,
  successMessage?: string | undefined,
  errorMessage?: string | undefined
): Promise<  {
    status: 200 | 400 | 409, 
    success: boolean, 
    message: string,
  }> => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: No session found");
  }
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden: insufficient permissions");
  }

  try {
    await callback();
    return {
      status: 200,
      success: true,
      message: successMessage || "Success",
    };
  } catch (error: any) {
    // Handle unique constraint race condition (if DB has unique index)
    console.log(error);
    
    if (error?.code === 'P2002') {
      return {
        status: 409,
        success: false,
        message: `Data sudah digunakan`,
      };
    }
    return {
      status: 400,
      success: false,
      message: errorMessage || "Something went wrong",
    };
  }
};
