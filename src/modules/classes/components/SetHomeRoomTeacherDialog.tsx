"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/views/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/views/components/ui/select";
import { SetHomeRoomTeacher } from "../action/SetHomeroomTeacherAction";
import { Button } from "@/src/views/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { DropdownMenuItem } from "@/src/views/components/ui/dropdown-menu";
import {
  Pen,
  UserCheck,
  Users,
  Loader2,
  Shield,
  Search,
  GraduationCap,
  X,
} from "lucide-react";
import { Badge } from "@/src/views/components/ui/badge";
import { Card, CardContent } from "@/src/views/components/ui/card";
import { Input } from "@/src/views/components/ui/input";
import { ScrollArea, ScrollBar } from "@/src/views/components/ui/scroll-area";

// =======================================================
// 🎯 Dialog: Set Wali Kelas - Compact dengan Pencarian
// =======================================================
export function SetHomeroomTeacherDialog({
  class_id,
  class_name,
  school_name,
  teacher_choices,
  current_homeroom_teacher = null,
  openHomeroomDialog,
  setOpenHomeroomDialog,
}: {
  class_id: string;
  class_name: string;
  school_name: string;
  teacher_choices: any[];
  current_homeroom_teacher?: {
    id_teacher: string;
    user: { full_name: string };
  } | null;
  openHomeroomDialog: boolean;
  setOpenHomeroomDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery) return teacher_choices;

    return teacher_choices.filter(
      (teacher) =>
        teacher.user.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        teacher.homeroom_of?.class_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ""
    );
  }, [teacher_choices, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId) {
      toast.error("Pilih guru terlebih dahulu!");
      return;
    }

    startTransition(async () => {
      const res = await SetHomeRoomTeacher(class_id, teacherId);
      if (res?.status === 200) {
        toast.success(res?.message || "Guru dijadikan wali kelas");
        router.refresh();
        setOpenHomeroomDialog(false);
        setTeacherId("");
        setSearchQuery("");
      } else {
        toast.error(res?.error || "Something went wrong");
      }
    });
  };

  const selectedTeacher = teacher_choices.find(
    (t) => t.id_teacher === teacherId
  );
  const currentTeacher = current_homeroom_teacher;

  const clearSelection = () => {
    setTeacherId("");
    setSearchQuery("");
  };

  console.log(teacher_choices);
  

  return (
    <Dialog
      open={openHomeroomDialog}
      onOpenChange={(open) => {
        setOpenHomeroomDialog(open);
        if (!open) {
          setTeacherId("");
          setSearchQuery("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[450px] max-h-[85vh] overflow-y-auto">
        {/* Header Compact */}
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base flex items-center gap-2">
                Atur Wali Kelas
                <Badge variant="secondary" className="text-xs">
                  {class_name}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-sm">
                {school_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {/* Current Teacher - Compact */}
          {currentTeacher && (
            <Card className="border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">
                        Wali Kelas Saat Ini
                      </p>
                      <p className="text-sm font-semibold text-amber-900">
                        {currentTeacher.user.full_name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-800 text-xs">
                    Aktif
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Teacher Selection dengan Search */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Pilih Guru Baru
                </label>
                {teacherId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-7 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Hapus
                  </Button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama guru atau kelas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 h-9 text-sm"
                />
              </div>

              {/* Teacher List */}
              <ScrollArea className="max-h-[60vh]">
                <div className="border rounded-lg max-h-48">
                  {filteredTeachers?.length > 0 ? (
                    <div className="divide-y">
                      {filteredTeachers.map((teacher) => (
                        <div
                          key={teacher.id_teacher}
                          className={`p-3 cursor-pointer transition-colors ${
                            teacherId === teacher.id_teacher
                              ? " border-blue-200"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => setTeacherId(teacher.id_teacher)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full border-2 ${
                                  teacherId === teacher.id_teacher
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <div>
                                <p className="text-sm font-medium ">
                                  {teacher.user.full_name}
                                </p>
                                {teacher.homeroom_of && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Wali Kelas {teacher.homeroom_of.class_name}
                                  </p>
                                )}
                                {!teacher.homeroom_of && (
                                  <p className="text-xs text-green-600 mt-0.5">
                                    Tersedia
                                  </p>
                                )}
                              </div>
                            </div>
                            {teacher.homeroom_of && (
                              <Badge variant="outline" className="text-xs ">
                                Sudah punya kelas
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada guru ditemukan</p>
                      <p className="text-xs mt-1">Coba kata kunci lain</p>
                    </div>
                  )}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
            {/* Selected Teacher Preview - Compact */}
            {selectedTeacher && (
              <Card className="border">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            Calon Wali Kelas Baru
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {selectedTeacher.homeroom_of
                              ? "Akan Dipindahkan"
                              : "Baru"}
                          </Badge>
                        </div>

                        <p className="text-sm font-semibold">
                          {selectedTeacher.user.full_name}
                        </p>

                        {selectedTeacher.homeroom_of && (
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>
                              Saat ini: Wali Kelas{" "}
                              {selectedTeacher.homeroom_of.class_name}{" "}
                              {selectedTeacher.homeroom_of.school.school_name}
                            </p>
                            <p className="text-destructive">
                              Akan dipindahkan ke Kelas {class_name}{" "}
                              {school_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Statistics */}
            <div className="flex items-center justify-between text-xs  bg-primary text-accent p-2 rounded-lg">
              <span>Total guru: {teacher_choices.length}</span>
              <span>
                Tersedia: {teacher_choices.filter((t) => !t.homeroom_of).length}
              </span>
              <span>Ditampilkan: {filteredTeachers.length}</span>
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none h-9"
                  disabled={isPending}
                >
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !teacherId}
                className="flex-1 sm:flex-none gap-2 h-9 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3 w-3" />
                    Tetapkan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>

          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
