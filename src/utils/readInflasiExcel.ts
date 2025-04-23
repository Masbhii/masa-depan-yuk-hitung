import * as XLSX from "xlsx";

export async function readInflasiExcel(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (string | number)[][];
  // Asumsi header: [Periode, Inflasi]
  return data.slice(1).map(row => {
    const periode = String(row[0] || "");
    const inflasiStr = String(row[1] || "").replace(",", "."); // ganti koma ke titik
    const [tahun, bulan] = periode.split("-");
    return {
      periode, // contoh: "2025-03"
      tahun: Number(tahun),
      bulan: Number(bulan),
      inflasi: parseFloat(inflasiStr)
    };
  });
}
