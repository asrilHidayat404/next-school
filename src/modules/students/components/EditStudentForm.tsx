"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/src/views/components/ui/button";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/views/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/views/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/views/components/ui/tabs";
import { Badge } from "@/src/views/components/ui/badge";
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Hash,
  Calendar,
  Users,
  School,
  Lock,
  University,
  User2Icon,
  Map,
  Phone,
} from "lucide-react";

import { School as SchoolType, SchoolClass } from "@prisma/client";
import { EditStudentAction } from "../action/StudentAction";
import { editStudentSchema, EditStudentSchema } from "../schemas/EditStudentSchema";

type EditStudentFormProps = {
  studentData: {
    id_student: string;
    nis: string;
    full_name: string;
    email: string;
    school_id: string;
    class_id: string;
    father_name?: string;
    mother_name?: string;
    address?: string;
    birth?: string;
    gender?: string;
    phone_number?: string;
  };
  schoolOption: SchoolType[];
  classOption: SchoolClass[];
};

const EditStudentForm = ({
  studentData,
  schoolOption,
  classOption,
}: EditStudentFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState("data-diri");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditStudentSchema>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      full_name: studentData.full_name,
      email: studentData.email,
      nis: studentData.nis,
      school_id: studentData.school_id,
      class_id: studentData.class_id,
      father_name: studentData.father_name || "",
      mother_name: studentData.mother_name || "",
      address: studentData.address || "",
      birth: studentData.birth || "",
      gender: studentData.gender || "",
      phone_number: studentData.phone_number || "",
      password: "",
      password_confirmation: "",
    },
     mode: "onSubmit",
  });

  const selectedgender = watch("gender");
  const selectedSchool = watch("school_id");
  const selectedClass = watch("class_id");
  const filteredClass = selectedSchool
    ? classOption.filter((k) => k.school_id === selectedSchool)
    : [];

  const onSubmit = async (data: EditStudentSchema) => {
    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append("student_id", studentData.id_student);
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await EditStudentAction(formData);

      if (res.success) {
        toast.success(res.message || "✅ Data siswa berhasil diupdate");
        router.push("/dashboard/siswa");
      } else {
        toast.error(`${res.message}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Gagal update siswa");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="mx-auto space-y-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" /> Edit Data Siswa{" "}
          <b>{studentData.full_name}</b>
        </CardTitle>
        <CardDescription>Update informasi siswa di bawah ini</CardDescription>
      </CardHeader>

      <CardContent className="p-0 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full rounded-lg p-1 h-auto">
            <TabsTrigger
              value="data-diri"
              className="flex items-center gap-2 py-2"
            >
              Data Diri
            </TabsTrigger>
            <TabsTrigger
              value="sekolah"
              className="flex items-center gap-2 py-2"
            >
              Sekolah & Kelas
            </TabsTrigger>
            <TabsTrigger value="akun" className="flex items-center gap-2 py-2">
              Akun
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* === Data Diri Tab === */}
            <TabsContent value="data-diri" className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    <User className="h-4 w-4" /> Nama Lengkap
                  </Label>
                  <Input {...register("full_name")} id="full_name" />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input {...register("email")} id="email" type="email" />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nis">
                    <Hash className="h-4 w-4" /> NIS
                  </Label>
                  <Input {...register("nis")} id="nis" />
                  {errors.nis && (
                    <p className="text-xs text-destructive">
                      {errors.nis.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth">
                    <Calendar className="h-4 w-4" /> Tanggal Lahir
                  </Label>
                  <Input {...register("birth")} id="birth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    <User2Icon className="h-4 w-4" /> Jenis Kelamin
                  </Label>
                  <Select
                    value={selectedgender}
                    onValueChange={(value) => setValue("gender", value)}
                  >
                    <SelectTrigger className="w-full" id="gender">
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      {["laki-laki", "perempuan"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    <Map className="h-4 w-4" /> Alamat
                  </Label>
                  <Input {...register("address")} id="address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">
                    <Phone className="h-4 w-4" /> Nomor Telepon
                  </Label>
                  <Input {...register("phone_number")} id="phone_number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_name">
                    <Users className="h-4 w-4" /> Nama Ayah
                  </Label>
                  <Input {...register("father_name")} id="father_name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_name">
                    <Users className="h-4 w-4" /> Nama Ibu
                  </Label>
                  <Input {...register("mother_name")} id="mother_name" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="button" onClick={() => setActiveTab("sekolah")}>
                  Lanjut ke Sekolah & Kelas
                </Button>
              </div>
            </TabsContent>

            {/* === Sekolah Tab === */}
            <TabsContent value="sekolah" className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school_id">
                    <School className="h-4 w-4" /> Madrasah
                  </Label>
                  <Select
                    value={selectedSchool}
                    onValueChange={(v) => {
                      setValue("school_id", v);
                      setValue("class_id", "");
                    }}
                  >
                    <SelectTrigger className="w-full" id="school_id">
                      <SelectValue placeholder="Pilih Madrasah" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolOption.map((s) => (
                        <SelectItem key={s.id_school} value={s.id_school}>
                          {s.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSchool && (
                  <div className="space-y-2">
                    <Label htmlFor="class_id">
                      <University className="h-4 w-4" /> Kelas
                      {filteredClass.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {filteredClass.length} kelas tersedia
                        </Badge>
                      )}
                    </Label>
                    <Select
                      value={selectedClass}
                      onValueChange={(v) => setValue("class_id", v)}
                    >
                      <SelectTrigger className="w-full" id="class_id">
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredClass.length > 0 ? (
                          filteredClass.map((k) => (
                            <SelectItem key={k.id_class} value={k.id_class}>
                              {k.class_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="no-class">
                            Tidak ada kelas
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("data-diri")}
                >
                  Kembali ke Data Diri
                </Button>
                <Button type="button" onClick={() => setActiveTab("akun")}>
                  Lanjut ke Akun
                </Button>
              </div>
            </TabsContent>

            {/* === Akun Tab === */}
            <TabsContent value="akun" className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* Konfirmasi Password */}
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Konfirmasi Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    {...register("password_confirmation")}
                    className={
                      errors.password_confirmation ? "border-destructive" : ""
                    }
                  />
                  {errors.password_confirmation && (
                    <p className="text-xs text-destructive">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("sekolah")}
                  >
                    Kembali ke Sekolah & Kelas
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                        Menyimpan...
                      </>
                    ) : (
                      "Update Siswa"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditStudentForm;
