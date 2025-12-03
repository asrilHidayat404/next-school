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
  CardDescription,
  CardHeader,
  CardTitle,
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
  Group,
  Map,
  Phone,
  User2Icon,
  University,
} from "lucide-react";

import {
  createStudentSchema,
  CreateStudentSchema,
} from "@/src/modules/students/schemas/CreateStudentSchema";
import { School as SchoolType, SchoolClass } from "@prisma/client";
import { CreateStudentAction } from "../action/StudentAction";

const CreateStudentForm = ({
  schoolOption = [],
  classOption = [],
}: {
  schoolOption: SchoolType[];
  classOption: SchoolClass[];
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateStudentSchema>({
    resolver: zodResolver(createStudentSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState("data-diri");

  const selectedgender = watch("gender");
  const selectedSchool = watch("school_id");
  const selectedClass = watch("class_id");
  const filteredClass = selectedSchool
    ? classOption.filter((kelas) => kelas.school_id === selectedSchool)
    : [];

  const onSubmit = async (data: CreateStudentSchema) => {
    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("nis", data.nis);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      if (data.class_id) formData.append("class_id", data.class_id);
      if (data.school_id) formData.append("school_id", data.school_id);
      if (data.birth) formData.append("birth", data.birth);
      if (data.address) formData.append("address", data.address);
      if (data.gender) formData.append("gender", data.gender);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.father_name) formData.append("father_name", data.father_name);
      if (data.mother_name) formData.append("mother_name", data.mother_name);

      const res = await CreateStudentAction(formData);
      if (res.success) {
        toast.success(res.message || "✅ Siswa berhasil dibuat");
        reset();
        router.push("/dashboard/siswa");
      } else {
        toast.error(`❌ ${res.message}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Gagal membuat siswa");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className=" mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Form Data Siswa
          </CardTitle>
          <CardDescription>
            Lengkapi informasi siswa di bawah ini
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <TabsList className="flex w-full rounded-lg p-1 h-auto">
              <TabsTrigger
                value="data-diri"
                className="flex items-center gap-2 py-2 data-[state=active]:shadow-none"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Data Diri</span>
              </TabsTrigger>
              <TabsTrigger
                value="sekolah"
                className="flex items-center gap-2 py-2 data-[state=active]:shadow-none"
              >
                <School className="h-4 w-4" />
                <span className="hidden sm:inline">Sekolah & Kelas</span>
              </TabsTrigger>
              <TabsTrigger
                value="akun"
                className="flex items-center gap-2 py-2 data-[state=active]:shadow-none"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Akun</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="data-diri" className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Lengkap */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="full_name"
                      {...register("full_name")}
                      placeholder="John Doe"
                      className={errors.full_name ? "border-destructive" : ""}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-destructive">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="john@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* NIS */}
                  <div className="space-y-2">
                    <Label htmlFor="nis" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      NIS
                    </Label>
                    <Input
                      id="nis"
                      type="text"
                      {...register("nis")}
                      placeholder="Nomor Induk Siswa"
                      className={errors.nis ? "border-destructive" : ""}
                    />
                    {errors.nis && (
                      <p className="text-xs text-destructive">
                        {errors.nis.message}
                      </p>
                    )}
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="space-y-2">
                    <Label htmlFor="birth" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal Lahir
                    </Label>
                    <Input
                      id="birth"
                      type="date"
                      {...register("birth")}
                      className={errors.birth ? "border-destructive" : ""}
                    />
                    {errors.birth && (
                      <p className="text-xs text-destructive">
                        {errors.birth.message}
                      </p>
                    )}
                  </div>

                  {/* Jenis Kelasmin */}
                  <div className="space-y-2">
                    <Label htmlFor="birth" className="flex items-center gap-2">
                      <User2Icon className="h-4 w-4" />
                      Jenis Kelamin
                    </Label>
                   <Select
                   value={selectedgender}
                      onValueChange={(value) => {
                        setValue("gender", value);
                      }}
                    >
                      <SelectTrigger
                        id="gender"
                        className="w-full"
                      >
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        {["laki-laki", "perempuan"].map((g, i) => (
                          <SelectItem key={i} value={g} className="capitalize">
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-destructive">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                   {/* Nama alamat */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <Map className="h-4 w-4" />
                      Alamat
                    </Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="contoh: kapedi, bluto"
                    />
                  </div>

                   {/* NOmor hp */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone_number"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone_number"
                      {...register("phone_number")}
                      placeholder="0812xxxxx"
                    />
                  </div>

                  {/* Nama Ayah */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="father_name"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Nama Ayah
                    </Label>
                    <Input
                      id="father_name"
                      {...register("father_name")}
                      placeholder="Nama Ayah"
                    />
                  </div>

                  {/* Nama Ibu */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="mother_name"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Nama Ibu
                    </Label>
                    <Input
                      id="mother_name"
                      {...register("mother_name")}
                      placeholder="Nama Ibu"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab("sekolah")}>
                    Lanjut ke Sekolah & Kelas
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sekolah" className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Sekolah */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="school_id"
                      className="flex items-center gap-2"
                    >
                      <School className="h-4 w-4" />
                      Madrasah
                    </Label>
                    <Select
                      value={selectedSchool}
                      onValueChange={(value) => {
                        setValue("school_id", value);
                        setValue("class_id", "");
                      }}
                    >
                      <SelectTrigger
                        id="school_id"
                        className={errors.school_id ? "border-destructive" : "w-full"}
                      >
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
                    {errors.school_id && (
                      <p className="text-xs text-destructive">
                        {errors.school_id.message}
                      </p>
                    )}
                  </div>

                  {/* Kelas */}
                  {selectedSchool && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="class_id"
                        className="flex items-center gap-2"
                      >
                        <University className="h-4 w-4" />
                        Kelas
                        {filteredClass.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {filteredClass.length} kelas tersedia
                          </Badge>
                        )}
                      </Label>
                      <Select
                        value={selectedClass}
                        onValueChange={(value) => setValue("class_id", value)}
                      >
                        <SelectTrigger
                          id="class_id"
                          className={
                            errors.class_id ? "border-destructive" : "w-full"
                          }
                        >
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredClass.length > 0 ? (
                            filteredClass.map((kelas) => (
                              <SelectItem
                                key={kelas.id_class}
                                value={kelas.id_class}
                              >
                                {kelas.class_name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-class">
                              Tidak ada kelas di madrasah ini
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.class_id && (
                        <p className="text-xs text-destructive">
                          {errors.class_id.message}
                        </p>
                      )}
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

              <TabsContent value="akun" className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className={
                          errors.password ? "border-destructive pr-10" : "pr-10"
                        }
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
                    {errors.password && (
                      <p className="text-xs text-destructive">
                        {errors.password.message}
                      </p>
                    )}
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

                  {/* Tampilkan Password */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Input
                      id="showPassword"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="showPassword"
                      className="text-sm font-normal"
                    >
                      Tampilkan Password
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("sekolah")}
                  >
                    Kembali ke Sekolah & Kelas
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="min-w-32"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Siswa"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStudentForm;
