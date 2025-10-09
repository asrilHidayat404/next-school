import { auth } from "@/src/lib/auth";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/views/components/ui/card";
import { Button } from "@/src/views/components/ui/button";
import { Badge } from "@/src/views/components/ui/badge";
import db from "@/src/lib/db";
import { LogIn, LogOut, UserPlus, Plus, Edit, Trash2, Activity, Lock } from "lucide-react";


// Komponen PieChart yang dinamis
const PieChart = ({ active, newUsers, returning }: { active: number; newUsers: number; returning: number }) => {
  const total = active + newUsers + returning;
  const activePercentage = total > 0 ? (active / total) * 100 : 0;
  const newUsersPercentage = total > 0 ? (newUsers / total) * 100 : 0;
  const returningPercentage = total > 0 ? (returning / total) * 100 : 0;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="absolute inset-0 rounded-full border-6 border-primary"></div>
      <div
        className="absolute inset-0 rounded-full border-6 border-green-500 transform -rotate-90"
        style={{ clipPath: "inset(0 50% 0 0)" }}
      ></div>
      <div
        className="absolute inset-0 rounded-full border-6 border-purple-500 transform -rotate-180"
        style={{ clipPath: "inset(0 0 0 50%)" }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-sm font-bold">{total}</span>
          <span className="text-xs block text-muted-foreground">Users</span>
        </div>
      </div>
    </div>
  );
};

// Komponen Stat Card yang compact
const StatCard = ({
  title,
  value,
  change,
  icon,
  color,
  period,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  period?: "day" | "week" | "month";
}) => {
  const isPositive = change.startsWith("+");

  // mapping teks pembanding
  const compareText =
    period === "day"
      ? "dari kemarin"
      : period === "week"
      ? "dari minggu lalu"
      : "dari bulan lalu";

  return (
    <Card className={`border-l-4 ${color}`}>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            <p
              className={`text-xs ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} {compareText}
            </p>
          </div>
          <div className="p-2 bg-muted rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};


const RecentActivity = ({ activities }: { activities: any[] }) => {
  const getActivityIcon = (type: string) => {
    const iconClass = "h-3.5 w-3.5";
    
    switch (type) {
      case 'Login': return <LogIn className={iconClass} />;
      case 'Logout': return <LogOut className={iconClass} />;
      case 'Register': return <UserPlus className={iconClass} />;
      case 'Reset Password': return <Lock className={iconClass} />;
      case 'Create': return <Plus className={iconClass} />;
      case 'Update': return <Edit className={iconClass} />;
      case 'Delete': return <Trash2 className={iconClass} />;
      default: return <Activity className={iconClass} />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="text-muted-foreground">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.type} • {activity.effected}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {formatTimeAgo(new Date(activity.timestamp))}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-3 text-sm">
            Tidak ada aktivitas
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// Komponen Progress Bar
const ProgressBar = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => {
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

async function getActivityStats(period: "day" | "week" | "month") {
  const now = new Date();
  let startOfCurrent: Date;
  let endOfCurrent: Date;
  let startOfPrevious: Date;
  let endOfPrevious: Date;

  if (period === "day") {
    // Hari ini
    startOfCurrent = new Date(now);
    startOfCurrent.setHours(0, 0, 0, 0);
    endOfCurrent = new Date(now);
    endOfCurrent.setHours(23, 59, 59, 999);

    // Kemarin
    startOfPrevious = new Date(startOfCurrent);
    startOfPrevious.setDate(startOfPrevious.getDate() - 1);
    endOfPrevious = new Date(endOfCurrent);
    endOfPrevious.setDate(endOfPrevious.getDate() - 1);

  } else if (period === "week") {
    // Minggu ini
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day; // Senin sebagai awal minggu
    
    startOfCurrent = new Date(now);
    startOfCurrent.setDate(now.getDate() + diffToMonday);
    startOfCurrent.setHours(0, 0, 0, 0);

    endOfCurrent = new Date(startOfCurrent);
    endOfCurrent.setDate(endOfCurrent.getDate() + 6);
    endOfCurrent.setHours(23, 59, 59, 999);

    // Minggu lalu
    startOfPrevious = new Date(startOfCurrent);
    startOfPrevious.setDate(startOfPrevious.getDate() - 7);
    endOfPrevious = new Date(endOfCurrent);
    endOfPrevious.setDate(endOfPrevious.getDate() - 7);

  } else {
    // period === "month"
    // Bulan ini
    startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    endOfCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Bulan lalu
    startOfPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endOfPrevious = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  }

  // Query database dengan model ActivityLog
  const currentCount = await db.activityLog.count({
    where: { timestamp: { gte: startOfCurrent, lte: endOfCurrent } },
  });

  const previousCount = await db.activityLog.count({
    where: { timestamp: { gte: startOfPrevious, lte: endOfPrevious } },
  });

  // Hitung persentase perubahan
  let change: string;
  if (previousCount === 0) {
    change = currentCount > 0 ? "+100%" : "0%";
  } else {
    const percent = ((currentCount - previousCount) / previousCount) * 100;
    change = (percent >= 0 ? "+" : "") + percent.toFixed(1) + "%";
  }

  return { currentCount, change };
}

// Fungsi untuk mendapatkan distribusi pengguna berdasarkan model User
async function getUserDistribution() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Total pengguna
  const totalUsers = await db.user.count();

  // Pengguna aktif (login dalam 7 hari terakhir) - menggunakan sessions
  const activeUsers = await db.user.count({
    where: {
      sessions: {
        some: {
          expires: {
            gte: now
          }
        }
      }
    }
  });

  // Pengguna baru (dibuat dalam 30 hari terakhir)
  const newUsers = await db.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo
      }
    }
  });

  // Pengguna returning (pernah login sebelumnya dan masih aktif)
  const returningUsers = await db.user.count({
    where: {
      sessions: {
        some: {
          expires: {
            gte: now
          }
        }
      },
      createdAt: {
        lt: thirtyDaysAgo
      }
    }
  });

  return {
    total: totalUsers,
    active: activeUsers,
    new: newUsers,
    returning: returningUsers
  };
}

// Fungsi untuk mendapatkan aktivitas terbaru dari ActivityLog
async function getRecentActivities() {
  const activities = await db.activityLog.findMany({
    take: 5,
    orderBy: {
      timestamp: 'desc'
    },
    include: {
      user: {
        select: {
          full_name: true,
          email: true
        }
      }
    }
  });

  return activities;
}

// Fungsi untuk mendapatkan statistik user changes
async function getUserChanges() {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  
  const yesterdayUsers = await db.user.count({
    where: {
      createdAt: {
        lt: yesterday
      }
    }
  });

  const totalUsers = await db.user.count();
  
  // Hitung perubahan
  const change = totalUsers - yesterdayUsers;
  
  return {
    total: totalUsers,
    change: change > 0 ? `+${change}` : change === 0 ? "0" : `${change}`
  };
}

const DashboardPage = async () => {
  const session = await auth();
  const userName = session?.user?.fullName || "Pengguna";
  
  // Data aktivitas
  const { currentCount: dailyCount, change: dailyChange } = await getActivityStats("day");
  const { currentCount: weeklyCount, change: weeklyChange } = await getActivityStats("week");
  const { currentCount: monthlyCount, change: monthlyChange } = await getActivityStats("month");

  // Data pengguna
  const userStats = await getUserChanges();
  
  // Data distribusi pengguna
  const userDistribution = await getUserDistribution();
  
  // Data aktivitas terbaru
  const recentActivities = await getRecentActivities();

  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  const currentDay = days[now.getDay()];
  const currentDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Hitung persentase distribusi
  const activePercentage = userDistribution.total > 0 
    ? (userDistribution.active / userDistribution.total) * 100 
    : 0;
  const newUsersPercentage = userDistribution.total > 0 
    ? (userDistribution.new / userDistribution.total) * 100 
    : 0;
  const returningPercentage = userDistribution.total > 0 
    ? (userDistribution.returning / userDistribution.total) * 100 
    : 0;

  return (
    <main className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Great to be back, {userName}! 👋
            </h1>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-muted-foreground">
              {currentDay}, {currentDate}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pengguna"
            value={userStats.total.toString()}
            change={userStats.change}
            color="border-l-primary"
            period="day"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Aktivitas Hari Ini"
            value={dailyCount.toString()}
            change={dailyChange}
            color="border-l-green-500"
            period="day"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <StatCard
            title="Aktivitas Minggu Ini"
            value={weeklyCount.toString()}
            change={weeklyChange}
            color="border-l-purple-500"
            period="week"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <StatCard
            title="Aktivitas Bulan Ini"
            value={monthlyCount.toString()}
            change={monthlyChange}
            color="border-l-yellow-500"
            period="month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart Section - NOW DYNAMIC */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-center">
                Distribusi Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PieChart 
                active={userDistribution.active}
                newUsers={userDistribution.new}
                returning={userDistribution.returning}
              />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      Aktif (7 hari)
                    </span>
                    <span className="font-medium">{activePercentage.toFixed(0)}%</span>
                  </div>
                  <ProgressBar percentage={activePercentage} color="bg-primary" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {userDistribution.active} pengguna
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Baru (30 hari)
                    </span>
                    <span className="font-medium">{newUsersPercentage.toFixed(0)}%</span>
                  </div>
                  <ProgressBar percentage={newUsersPercentage} color="bg-green-500" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {userDistribution.new} pengguna
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Returning
                    </span>
                    <span className="font-medium">{returningPercentage.toFixed(0)}%</span>
                  </div>
                  <ProgressBar percentage={returningPercentage} color="bg-purple-500" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {userDistribution.returning} pengguna
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-center">
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RecentActivity activities={recentActivities} />
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
};

export default DashboardPage;