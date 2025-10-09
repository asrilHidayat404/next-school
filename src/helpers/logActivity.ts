// lib/activity-logger.ts

import db from "@/src/lib/db";
import { headers } from "next/headers";

interface LogActivityParams {
  userId?: string;
  event: string;
  type: string;
  effected: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(params: LogActivityParams) {
  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";
  console.log({ipAddress, userAgent});
  
  try {
    const log = await db.activityLog.create({
      data: {
        userId: params.userId,
        event: params.event,
        type: params.type,
        effected: params.effected,
        details: params.details,
        ipAddress: ipAddress,
        userAgent: userAgent,
        timestamp: new Date(),
      },
    });
    return log;
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// Contoh penggunaan:
// await logActivity({
//   userId: user.id,
//   event: 'Profile Update',
//   type: 'Update',
//   effected: `User: ${user.email}`,
//   details: { old: oldData, new: newData },
//   ipAddress: req.ip,
//   userAgent: req.headers['user-agent']
// })
