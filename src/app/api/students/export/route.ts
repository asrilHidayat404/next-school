"use server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import db from "@/src/lib/db";

// Helper function to calculate age
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+62${cleaned.slice(1)}`;
  }
  return phone;
}

// Style definitions
const styles = {
  // Title style - Blue background, white text, bold
  title: {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    fill: { fgColor: { rgb: "2E86AB" } },
    alignment: { horizontal: "center", vertical: "center" }
  },
  // Subtitle style - Light blue background, dark text
  subtitle: {
    font: { bold: false, color: { rgb: "333333" }, sz: 11 },
    fill: { fgColor: { rgb: "E8F4F8" } },
    alignment: { horizontal: "center", vertical: "center" }
  },
  // Header style - Dark blue background, white text
  header: {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
    fill: { fgColor: { rgb: "1A5276" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "1A5276" } },
      bottom: { style: "thin", color: { rgb: "1A5276" } },
      left: { style: "thin", color: { rgb: "1A5276" } },
      right: { style: "thin", color: { rgb: "1A5276" } }
    }
  },
  // Data style - Center aligned, borders
  data: {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E5E5" } },
      bottom: { style: "thin", color: { rgb: "E5E5E5" } },
      left: { style: "thin", color: { rgb: "E5E5E5" } },
      right: { style: "thin", color: { rgb: "E5E5E5" } }
    }
  },
  // Highlight style - Light green for important data
  highlight: {
    fill: { fgColor: { rgb: "E8F5E8" } },
    font: { bold: true, color: { rgb: "2E7D32" } },
    alignment: { horizontal: "center", vertical: "center" }
  },
  // Summary header style - Medium blue
  summaryHeader: {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
    fill: { fgColor: { rgb: "3498DB" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "3498DB" } },
      bottom: { style: "thin", color: { rgb: "3498DB" } },
      left: { style: "thin", color: { rgb: "3498DB" } },
      right: { style: "thin", color: { rgb: "3498DB" } }
    }
  }
};

export async function GET() {
  try {
    // Ambil data siswa dengan relasi lengkap
    const students = await db.student.findMany({
      include: {
        user: true,
        class: {
          include: {
            school: true,
            homeroom_teacher: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: {
        user: {
          full_name: 'asc'
        }
      }
    });

    const currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 🔹 Data Utama Siswa (Main Sheet) dengan Header Profesional
    const mainHeader = [
      ["LAPORAN DATA SISWA LENGKAP"],
      [`Dicetak pada: ${currentDate}`],
      [`Total Siswa: ${students.length} orang`],
      [""], // Empty row for spacing
      ["NO", "NIS", "NAMA LENGKAP SISWA", "EMAIL", "JENIS KELAMIN", "ALAMAT LENGKAP", "NOMOR TELEPON", 
       "TANGGAL LAHIR", "USIA", "NAMA AYAH", "NAMA IBU", "KELAS", "MADRASAH", "WALI KELAS", 
       "STATUS", "LAMA BERGABUNG", "TANGGAL BERGABUNG", "TERAKHIR DIUPDATE"]
    ];

    const mainData = students.map((student, index) => {
      const age = calculateAge(student.birth);
      const joinDuration = Math.floor((new Date().getTime() - student.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));

      return [
        index + 1,
        student.nis,
        student.user.full_name,
        student.user.email,
        student.user.gender,
        student.user.address,
        formatPhoneNumber(student.user.phone_number),
        new Date(student.birth).toLocaleDateString('id-ID'),
        `${age} tahun`,
        student.father_name,
        student.mother_name,
        student.class?.class_name || "Belum ditentukan",
        student.class?.school.school_name || "Belum ditentukan",
        student.class?.homeroom_teacher?.user.full_name || "Belum ditentukan",
        "Aktif",
        `${joinDuration} bulan`,
        new Date(student.createdAt).toLocaleDateString('id-ID'),
        new Date(student.updatedAt).toLocaleDateString('id-ID')
      ];
    });

    const mainSheetData = [...mainHeader, ...mainData];

    // 🔹 Data Ringkasan Statistik (Summary Sheet) dengan Format Profesional
    const summaryHeader = [
      ["RINGKASAN STATISTIK SISWA"],
      [`Dicetak pada: ${currentDate}`],
      [""],
      ["STATISTIK UMUM", "JUMLAH"],
      ["Total Siswa", students.length]
    ];

    const totalStudents = students.length;
    const genderStats = students.reduce((acc, student) => {
      const gender = student.user.gender.toLowerCase();
      if (gender.includes('laki')) {
        acc.lakiLaki++;
      } else if (gender.includes('perempuan')) {
        acc.perempuan++;
      } else {
        acc.lainnya++;
      }
      return acc;
    }, { lakiLaki: 0, perempuan: 0, lainnya: 0 });

    const ageDistribution = students.reduce((acc, student) => {
      const age = calculateAge(student.birth);
      if (age <= 12) acc['6-12 tahun']++;
      else if (age <= 15) acc['13-15 tahun']++;
      else if (age <= 18) acc['16-18 tahun']++;
      else acc['>18 tahun']++;
      return acc;
    }, { '6-12 tahun': 0, '13-15 tahun': 0, '16-18 tahun': 0, '>18 tahun': 0 });

    const averageAge = (students.reduce((acc, student) => acc + calculateAge(student.birth), 0) / totalStudents).toFixed(1);

    const summaryData = [
      ...summaryHeader,
      ["Siswa Laki-laki", genderStats.lakiLaki],
      ["Siswa Perempuan", genderStats.perempuan],
      ["Lainnya", genderStats.lainnya],
      [""],
      ["PERSENTASE GENDER", ""],
      ["Laki-laki", `${((genderStats.lakiLaki / totalStudents) * 100).toFixed(1)}%`],
      ["Perempuan", `${((genderStats.perempuan / totalStudents) * 100).toFixed(1)}%`],
      [""],
      ["DISTRIBUSI USIA", ""],
      ["6-12 tahun", ageDistribution['6-12 tahun']],
      ["13-15 tahun", ageDistribution['13-15 tahun']],
      ["16-18 tahun", ageDistribution['16-18 tahun']],
      [">18 tahun", ageDistribution['>18 tahun']],
      [""],
      ["RATA-RATA USIA", `${averageAge} tahun`],
      ["USIA TERMUDA", `${Math.min(...students.map(s => calculateAge(s.birth)))} tahun`],
      ["USIA TERTUA", `${Math.max(...students.map(s => calculateAge(s.birth)))} tahun`]
    ];

    // 🔹 Data Distribusi per Kelas (Class Distribution Sheet)
    const classDistribution = students.reduce((acc, student) => {
      const className = student.class?.class_name || "Belum Ditentukan";
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const classHeader = [
      ["DISTRIBUSI SISWA PER KELAS"],
      [`Dicetak pada: ${currentDate}`],
      [`Total Kelas: ${Object.keys(classDistribution).length}`],
      [""],
      ["KELAS", "JUMLAH SISWA", "PERSENTASE", "RANKING"]
    ];

    const classData = Object.entries(classDistribution)
      .sort(([,a], [,b]) => b - a)
      .map(([className, count], index) => [
        className,
        count,
        `${((count / totalStudents) * 100).toFixed(1)}%`,
        index + 1
      ]);

    const classSheetData = [...classHeader, ...classData];

    // 🔹 Data Distribusi per Madrasah (School Distribution Sheet)
    const schoolDistribution = students.reduce((acc, student) => {
      const schoolName = student.class?.school.school_name || "Belum Ditentukan";
      acc[schoolName] = (acc[schoolName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const schoolHeader = [
      ["DISTRIBUSI SISWA PER MADRASAH"],
      [`Dicetak pada: ${currentDate}`],
      [`Total Madrasah: ${Object.keys(schoolDistribution).length}`],
      [""],
      ["NAMA MADRASAH", "JUMLAH SISWA", "PERSENTASE", "RATA-RATA PER KELAS", "RANKING"]
    ];

    const schoolData = Object.entries(schoolDistribution)
      .sort(([,a], [,b]) => b - a)
      .map(([schoolName, count], index) => {
        const schoolClasses = students.filter(s => s.class?.school.school_name === schoolName);
        const uniqueClasses = new Set(schoolClasses.map(s => s.class?.class_name)).size;
        const avgPerClass = uniqueClasses > 0 ? (count / uniqueClasses).toFixed(1) : "0";
        
        return [
          schoolName,
          count,
          `${((count / totalStudents) * 100).toFixed(1)}%`,
          avgPerClass,
          index + 1
        ];
      });

    const schoolSheetData = [...schoolHeader, ...schoolData];

    // Buat workbook dengan multiple sheets
    const workbook = XLSX.utils.book_new();

    // Helper function to apply styles
    const applyStyles = (worksheet: XLSX.WorkSheet, data: any[][]) => {
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          
          if (!worksheet[cellAddress]) continue;

          // Title rows (first 3 rows)
          if (R === 0) {
            worksheet[cellAddress].s = styles.title;
          }
          // Subtitle rows (next rows until empty row)
          else if (R === 1 || R === 2) {
            worksheet[cellAddress].s = styles.subtitle;
          }
          // Header rows (first row after empty row)
          else if (data[R] && data[R].some(cell => typeof cell === 'string' && cell.toUpperCase() === cell)) {
            worksheet[cellAddress].s = styles.header;
          }
          // Data rows
          else {
            worksheet[cellAddress].s = styles.data;
            
            // Highlight important numbers
            if (typeof worksheet[cellAddress].v === 'number' && worksheet[cellAddress].v > 0) {
              worksheet[cellAddress].s = { ...styles.data, ...styles.highlight };
            }
          }
        }
      }
    };

    // Sheet 1: Data Siswa Lengkap
    const mainWorksheet = XLSX.utils.aoa_to_sheet(mainSheetData);
    applyStyles(mainWorksheet, mainSheetData);
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Data Siswa");

    // Sheet 2: Ringkasan Statistik
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    applyStyles(summaryWorksheet, summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Ringkasan");

    // Sheet 3: Distribusi Kelas
    const classWorksheet = XLSX.utils.aoa_to_sheet(classSheetData);
    applyStyles(classWorksheet, classSheetData);
    XLSX.utils.book_append_sheet(workbook, classWorksheet, "Distribusi Kelas");

    // Sheet 4: Distribusi Madrasah
    const schoolWorksheet = XLSX.utils.aoa_to_sheet(schoolSheetData);
    applyStyles(schoolWorksheet, schoolSheetData);
    XLSX.utils.book_append_sheet(workbook, schoolWorksheet, "Distribusi Madrasah");

    // Set merges for titles
    const setMerges = (worksheet: XLSX.WorkSheet, cols: number) => {
      worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: cols } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: cols } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: cols } }
      ];
    };

    setMerges(mainWorksheet, 16);
    setMerges(summaryWorksheet, 1);
    setMerges(classWorksheet, 4);
    setMerges(schoolWorksheet, 4);

    // Set column widths
    mainWorksheet['!cols'] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 }, { wch: 25 }, { wch: 12 }, 
      { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 8 }, { wch: 20 }, 
      { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, 
      { wch: 12 }, { wch: 12 }, { wch: 12 }
    ];
    
    summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    classWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];
    schoolWorksheet['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];

    // Set row heights for better appearance
    [mainWorksheet, summaryWorksheet, classWorksheet, schoolWorksheet].forEach(ws => {
      ws['!rows'] = [
        { hpt: 25 }, // Title row
        { hpt: 20 }, // Subtitle row
        { hpt: 20 }, // Subtitle row
        { hpt: 5 },  // Spacing row
        { hpt: 22 }  // Header row
      ];
    });

    const buffer = XLSX.write(workbook, { 
      bookType: "xlsx", 
      type: "buffer",
      cellStyles: true 
    });

    // 🔹 Return sebagai file download
    const fileNameDate = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Laporan-Data-Siswa-${fileNameDate}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ 
      error: "Gagal mengekspor data siswa. Silakan coba lagi." 
    }, { status: 500 });
  }
}