
import { useState } from "react";
import { NeumorphicCard, NeumorphicInput } from "@/components/ui/skeuomorphic";
import { calculateInflationAdjustedValue, INFLATION_RATES } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

export default function HistoricalValueCalculator() {
  const currentYear = new Date().getFullYear();
  const [historicalValue, setHistoricalValue] = useState<string>("1000000");
  const [purchaseYear, setPurchaseYear] = useState<string>("2015");
  const [historicalValueError, setHistoricalValueError] = useState<string>("");
  const [yearError, setYearError] = useState<string>("");
  
  // Function to validate inputs
  const validateInputs = () => {
    let isValid = true;
    
    if (!historicalValue || isNaN(Number(historicalValue)) || Number(historicalValue) <= 0) {
      setHistoricalValueError("Nilai harus berupa angka positif");
      isValid = false;
    } else {
      setHistoricalValueError("");
    }
    
    const year = Number(purchaseYear);
    if (!purchaseYear || isNaN(year) || year < 2010 || year >= currentYear) {
      setYearError(`Tahun harus antara 2010-${currentYear - 1}`);
      isValid = false;
    } else {
      setYearError("");
    }
    
    return isValid;
  };
  
  // Calculate current value
  const calculateResults = () => {
    if (!validateInputs()) return null;
    
    const originalValue = Number(historicalValue);
    const year = Number(purchaseYear);
    
    return {
      originalValue,
      currentValue: calculateInflationAdjustedValue(originalValue, year),
      yearDifference: currentYear - year,
      percentageChange: (calculateInflationAdjustedValue(originalValue, year) / originalValue - 1) * 100
    };
  };
  
  const results = calculateResults();
  
  // Generate years for the dropdown
  const availableYears = Object.keys(INFLATION_RATES)
    .map(Number)
    .filter(year => year < currentYear)
    .sort((a, b) => b - a); // Sort descending
  
  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Kalkulator Nilai Historis</h2>
      <p className="text-sm text-gray-600 mb-4">
        Hitung berapa nilai uang dari masa lalu dalam nilai Rupiah saat ini
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <NeumorphicInput
              label="Nilai Rupiah di Masa Lalu"
              type="number"
              value={historicalValue}
              onChange={(e) => setHistoricalValue(e.target.value)}
              prefix="Rp"
              error={historicalValueError}
              min={1000}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pembelian</label>
              <select
                value={purchaseYear}
                onChange={(e) => setPurchaseYear(e.target.value)}
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
              <div className="text-sm text-gray-700">
                {purchaseYear && !yearError ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: Math.min(6, currentYear - Number(purchaseYear)) }, (_, i) => Number(purchaseYear) + i)
                      .map(year => (
                        <div key={year} className="mb-1">
                          <span className="font-medium">{year}:</span> {INFLATION_RATES[year]}%
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p>Pilih tahun untuk melihat data inflasi</p>
                )}
              </div>
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
    </NeumorphicCard>
  );
}
