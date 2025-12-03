// src/app/dashboard/siswa/profile/components/StudentProfile.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/views/components/ui/card";
import { Badge } from "@/src/views/components/ui/badge";
import { Button } from "@/src/views/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/views/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/views/components/ui/tabs";
import { Student } from "@prisma/client";
import {
  User,
  Mail,
  Hash,
  Calendar,
  School,
  Users,
  MapPin,
  Phone,
  BookOpen,
  Building,
  Edit,
  GraduationCap,
  Home,
} from "lucide-react";
import { Separator } from "@/src/views/components/ui/separator";
import { formatDate } from "@/src/helpers/formatDate";
import { getInitials } from "@/src/helpers/getInitials";


export function StudentProfile({ student }: any) {
  return (
    <div className="container mx-auto space-y-4 w-full">
      {/* Header dengan Profile Card */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <ProfileHeader student={student} />
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Data Pribadi</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Akademik</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Keluarga</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Data Tab */}
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PersonalInfoCard student={student}/>
            <ContactInfoCard student={student} />
          </div>
        </TabsContent>

        {/* Academic Data Tab */}
        <TabsContent value="academic" className="space-y-4">
          <AcademicInfoCard student={student} />
        </TabsContent>

        {/* Family Data Tab */}
        <TabsContent value="family" className="space-y-4">
          <FamilyInfoCard student={student} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =======================================================
// 🎯 Profile Header Component
// =======================================================
function ProfileHeader({
  student,
}: {
  student: any;
}) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-22 w-22 border-2 border-muted">
            <AvatarImage
              src={student.user.avatar ?? "/default/defaultAvatar.png"}
              alt={student.user.full_name}
            />
            <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
              {getInitials(student.user.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold truncate">
                {student.user.full_name}
              </h1>
              <Badge variant="secondary" className="text-xs">
                Siswa
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>NIS: {student.nis}</span>
              </div>

              <Separator orientation="horizontal" />
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{student.user.email}</span>
              </div>
              <Separator className="h-full" orientation="vertical" />

              <div className="flex items-center gap-1">
                <School className="h-3 w-3" />
                <span>
                  Kelas {student.class.class_name}{" "}
                  {student.class.school.school_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =======================================================
// 🎯 Personal Information Card
// =======================================================
function PersonalInfoCard({
  student,
}: {
  student: any;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <InfoField
          icon={<Hash className="h-3 w-3" />}
          label="NIS"
          value={student.nis}
        />
        <InfoField
          icon={<Calendar className="h-3 w-3" />}
          label="Tanggal Lahir"
          value={formatDate(student.birth)}
        />
        <InfoField
          icon={<User className="h-3 w-3" />}
          label="Jenis Kelamin"
          value={student.user.gender}
          capitalize
        />
        <InfoField
          icon={<MapPin className="h-3 w-3" />}
          label="Alamat"
          value={student.user.address}
        />
      </CardContent>
    </Card>
  );
}

// =======================================================
// 🎯 Contact Information Card
// =======================================================
function ContactInfoCard({ student }: { student: any }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Informasi Kontak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <InfoField
          icon={<Mail className="h-3 w-3" />}
          label="Email"
          value={student.user.email}
        />
        <InfoField
          icon={<Phone className="h-3 w-3" />}
          label="Nomor Telepon"
          value={student.user.phone_number}
        />
        <div className="pt-2 border-t">
          <InfoField
            icon={<Calendar className="h-3 w-3" />}
            label="Bergabung Pada"
            value={new Date(student.createdAt).toLocaleDateString("id-ID")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// =======================================================
// 🎯 Academic Information Card
// =======================================================
function AcademicInfoCard({ student }: { student: any }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Informasi Akademik
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField
            icon={<Building className="h-3 w-3" />}
            label="Sekolah"
            value={student.class.school.school_name}
          />
          <InfoField
            icon={<School className="h-3 w-3" />}
            label="Kelas"
            value={student.class.class_name}
          />
        </div>

        <div className="border-t pt-4">
          <InfoField
            icon={<Users className="h-3 w-3" />}
            label="Wali Kelas"
            value={
              student.class.homeroom_teacher?.user.full_name ||
              "Belum ditentukan"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

// =======================================================
// 🎯 Family Information Card
// =======================================================
function FamilyInfoCard({ student }: { student: any }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Home className="h-4 w-4" />
          Informasi Keluarga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField
            icon={<User className="h-3 w-3" />}
            label="Nama Ayah"
            value={student.father_name}
          />
          <InfoField
            icon={<User className="h-3 w-3" />}
            label="Nama Ibu"
            value={student.mother_name}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// =======================================================
// 🎯 Reusable Info Field Component
// =======================================================
function InfoField({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg border bg-card/50">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-sm font-medium ${capitalize ? "capitalize" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
