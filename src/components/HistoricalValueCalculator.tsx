import { useState, useCallback, useMemo } from "react";
import { useEffect } from "react";
import { NeumorphicCard, NeumorphicInput } from "@/components/ui/skeuomorphic";
import { calculateInflationAdjustedValue } from "@/utils/calculators";
import { readInflasiExcel } from "@/utils/readInflasiExcel";
import { formatRupiah, formatPercentage, formatNumberWithSeparator } from "@/utils/formatters";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HistoricalValueCalculator() {
  const currentYear = new Date().getFullYear();
  const [historicalValue, setHistoricalValue] = useState<string>("1000000");
  const [purchaseYear, setPurchaseYear] = useState<string>("");
  const [historicalValueError, setHistoricalValueError] = useState<string>("");
  const [yearError, setYearError] = useState<string>("");
  const [inflationRates, setInflationRates] = useState<Array<{ tahun: number; inflasi: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    readInflasiExcel("/data/inflasi_ri_2003_2024.xlsx")
      .then(data => {
        setInflationRates(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data inflasi. Silakan coba lagi nanti.");
        setLoading(false);
      });
  }, []);

  const validateInputs = useCallback(() => {
    let isValid = true;
    
    if (!historicalValue || isNaN(Number(historicalValue)) || Number(historicalValue) <= 0) {
      setHistoricalValueError("Nilai harus berupa angka positif");
      isValid = false;
    } else {
      setHistoricalValueError("");
    }
    
    const year = Number(purchaseYear);
    const minYear = inflationRates.length > 0 ? Math.min(...inflationRates.map(i => i.tahun)) : 1900;
    const maxYear = currentYear - 1;
    if (!purchaseYear || isNaN(year) || year < minYear || year > maxYear) {
      setYearError(`Tahun harus antara ${minYear}-${maxYear}`);
      isValid = false;
    } else {
      setYearError("");
    }
    
    return isValid;
  }, [historicalValue, purchaseYear, currentYear]);
  
  const calculateResults = useCallback(() => {
    if (!validateInputs() || inflationRates.length === 0) return null;
    const originalValue = Number(historicalValue);
    const year = Number(purchaseYear);
    // Compose a rates object for calculation
    const ratesObj: Record<number, number> = {};
    inflationRates.forEach(item => {
      ratesObj[item.tahun] = item.inflasi;
    });
    // Custom calculation using loaded rates
    let adjustedValue = originalValue;
    for (let y = year; y < currentYear; y++) {
      if (ratesObj[y]) {
        adjustedValue *= (1 + ratesObj[y] / 100);
      }
    }
    return {
      originalValue,
      currentValue: adjustedValue,
      yearDifference: currentYear - year,
      percentageChange: (adjustedValue / originalValue - 1) * 100
    };
  }, [validateInputs, historicalValue, purchaseYear, currentYear, inflationRates]);
  
  const results = useMemo(() => calculateResults(), [calculateResults]);
  
  const handleHistoricalValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '');
    setHistoricalValue(rawValue);
  }, []);
  
  const handlePurchaseYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPurchaseYear(e.target.value);
  }, []);
  
  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        inflationRates
          .map(item => item.tahun)
          .filter(year => !isNaN(year) && year <= currentYear)
      )
    ).sort((a, b) => b - a);
  }, [inflationRates, currentYear]);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const inflationData = useMemo(() => {
    return inflationRates
      .filter(item => item.tahun <= currentYear)
      .map(item => ({
        year: item.tahun,
        month: item.bulan,
        inflasi: item.inflasi
      }));
  }, [inflationRates, currentYear]);
  
  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Kalkulator Nilai Historis</h2>
      <p className="text-sm text-gray-600 mb-4">
        Hitung berapa nilai uang dari masa lalu dalam nilai Rupiah saat ini
      </p>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500">Memuat data inflasi...</div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[200px] text-finansial-red">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <NeumorphicInput
                label="Nilai Rupiah di Masa Lalu"
                type="text"
                value={formatNumberWithSeparator(historicalValue)}
                onChange={handleHistoricalValueChange}
                prefix="Rp"
                error={historicalValueError}
                className="[&::-webkit-inner-spin-button]:appearance-none"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pembelian</label>
                <select
                  value={purchaseYear}
                  onChange={handlePurchaseYearChange}
                  className="w-full py-3 px-4 bg-white rounded-lg text-gray-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Pilih Tahun</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {yearError && <p className="mt-1 text-sm text-finansial-red">{yearError}</p>}
              </div>
              <div className="p-4 bg-purple-50 rounded-lg mt-4">
                <h3 className="font-medium mb-2">Inflasi Tahunan</h3>
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-3 gap-2 pr-4">
                    {purchaseYear && !yearError && inflationData.map(item => (
                      <div key={item.year + '-' + item.month} className="mb-1">
                        <span className="font-medium">{item.year}-{item.month?.toString().padStart(2, '0')} ({monthNames[(item.month ?? 1) - 1]}):</span>{' '}
                        {item.inflasi}%
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Hasil Kalkulasi</h3>
            {results ? (
              <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 flex flex-col justify-center shadow-inner">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Nilai di {purchaseYear}</span>
                      <span className="font-medium">{formatRupiah(results.originalValue)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-purple-500 rounded" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Nilai di {currentYear}</span>
                      <span className="font-medium">{formatRupiah(results.currentValue)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-purple-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">
                          {formatRupiah(results.currentValue - results.originalValue)}
                        </p>
                        <p className="text-sm text-gray-500">Selisih Nilai</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-finansial-green">
                          +{formatPercentage(results.percentageChange / 100, 1)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Dalam {results.yearDifference} tahun
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p>
                      Dengan kata lain, {formatRupiah(results.originalValue)} di tahun {purchaseYear} setara dengan {formatRupiah(results.currentValue)} di tahun {currentYear} karena inflasi.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-6">
                <p className="text-gray-500 text-center">
                  Masukkan data yang valid untuk melihat hasil kalkulasi
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
}
