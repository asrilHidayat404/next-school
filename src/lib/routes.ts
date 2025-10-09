import { BookOpen, Bot, Frame, PieChart, Settings2, SquareTerminal } from "lucide-react"

export const data = {
    navMain: [
         {
            title: "Data Pengguna",
            url: "/dashboard/users",
            icon: SquareTerminal,
            roles: ["superadmin", "admin"], // ✅ semua boleh
            items: [
                {
                    title: "Users",
                    url: "/dashboard/users/",
                    roles: ["superadmin", "admin"], // ✅ khusus admin
                },
                {
                    title: "Admin",
                    url: "/dashboard/users/admin",
                    roles: ["superadmin", "admin"], // ✅ khusus admin
                },
                {
                    title: "Staff",
                    url: "/dashboard/users/staff",
                    roles: ["superadmin", "admin"], // ✅ khusus admin
                },
                {
                    title: "Guru",
                    url: "/dashboard/users/teacher",
                    roles: ["superadmin", "admin"], // ✅ khusus admin
                },
                {
                    title: "Siswa",
                    url: "/dashboard/users/student",
                    roles: ["superadmin", "admin"], // ✅ khusus admin
                },
            ],
        },
        // {
        //     title: "Data Master",
        //     url: "/dashboard/masters",
        //     icon: SquareTerminal,
        //     roles: ["superadmin", "admin"], // ✅ semua boleh
        //     items: [
        //         {
        //             title: "Masters",
        //             url: "/dashboard/masters",
        //             roles: ["superadmin", "admin"], // ✅ khusus admin
        //         },
        //         {
        //             title: "Sekolah",
        //             url: "/dashboard/masters/schools",
        //             roles: ["superadmin", "admin"], // ✅ hanya admin
        //         },
        //         {
        //             title: "Kelas",
        //             url: "/dashboard/masters/classes",
        //             roles: ["superadmin", "admin"], // ✅ hanya admin
        //         },
        //         {
        //             title: "Materi",
        //             url: "/dashboard/masters/subjects",
        //             roles: ["superadmin", "admin"], // ✅ hanya admin
        //         },
        //     ],
        // },

    ],
    projects: [
        {
            name: "Design Engineering",
            url: "/projects/design",
            icon: Frame,
            roles: ["admin", "user"],
        },
        {
            name: "Sales & Marketing",
            url: "/projects/sales",
            icon: PieChart,
            roles: ["admin"],
        },
    ]

}