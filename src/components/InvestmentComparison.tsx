
import { useState, useCallback, useMemo } from "react";
import { NeumorphicCard, NeumorphicInput, NeumorphicTabs } from "@/components/ui/skeuomorphic";
import { calculateInvestmentReturn, AssetType, ASSET_RETURNS } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

export default function InvestmentComparison() {
  const currentYear = new Date().getFullYear();
  const [initialAmount, setInitialAmount] = useState<string>("10000000"); 
  const [startYear, setStartYear] = useState<string>("2015");
  const [activeTab, setActiveTab] = useState<AssetType>("stocks");
  
  // Error states
  const [amountError, setAmountError] = useState<string>("");
  const [yearError, setYearError] = useState<string>("");
  
  // Handle input changes with useCallback
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialAmount(e.target.value);
  }, []);
  
  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartYear(e.target.value);
  }, []);
  
  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as AssetType);
  }, []);
  
  // Validate inputs with useCallback
  const validateInputs = useCallback(() => {
    let isValid = true;
    
    if (!initialAmount || isNaN(Number(initialAmount)) || Number(initialAmount) <= 0) {
      setAmountError("Investasi awal harus berupa angka positif");
      isValid = false;
    } else {
      setAmountError("");
    }
    
    if (!startYear || isNaN(Number(startYear))) {
      setYearError("Pilih tahun mulai investasi");
      isValid = false;
    } else {
      setYearError("");
    }
    
    return isValid;
  }, [initialAmount, startYear]);
  
  // Get available years for dropdown using useMemo
  const availableYears = useMemo(() => {
    const assetTypeData = ASSET_RETURNS[activeTab];
    return Object.keys(assetTypeData)
      .map(Number)
      .filter(year => year < currentYear)
      .sort((a, b) => b - a); // Sort descending
  }, [activeTab, currentYear]);
  
  // Calculate results with useCallback
  const calculateResults = useCallback(() => {
    if (!validateInputs()) return null;
    
    const amount = Number(initialAmount);
    const year = Number(startYear);
    
    // Calculate returns for each asset type
    const results = {
      stocks: calculateInvestmentReturn(amount, "stocks", year),
      crypto: calculateInvestmentReturn(amount, "crypto", year),
      commodity: calculateInvestmentReturn(amount, "commodity", year)
    };
    
    return {
      results,
      percentages: {
        stocks: (results.stocks / amount - 1) * 100,
        crypto: (results.crypto / amount - 1) * 100,
        commodity: (results.commodity / amount - 1) * 100
      },
      yearDifference: currentYear - year
    };
  }, [initialAmount, startYear, validateInputs, currentYear]);
  
  // Memoize results to prevent recalculation on each render
  const results = useMemo(() => calculateResults(), [calculateResults]);
  
  // Get asset returns for the selected type with useMemo
  const assetReturnsData = useMemo(() => {
    const data = ASSET_RETURNS[activeTab];
    return Object.keys(data)
      .map(Number)
      .filter(year => year >= Number(startYear) && year < currentYear)
      .sort((a, b) => a - b)
      .map(year => ({
        year,
        return: data[year]
      }));
  }, [activeTab, startYear, currentYear]);
  
  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Komparasi Investasi</h2>
      <p className="text-sm text-gray-600 mb-4">
        Bandingkan kinerja historis berbagai aset investasi
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <NeumorphicInput
              label="Investasi Awal"
              type="number"
              value={initialAmount}
              onChange={handleAmountChange}
              prefix="Rp"
              error={amountError}
              min={10000}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Mulai Investasi</label>
              <select
                value={startYear}
                onChange={handleYearChange}
                className="w-full py-3 px-4 bg-white rounded-lg text-gray-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Pilih Tahun</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {yearError && <p className="mt-1 text-sm text-finansial-red">{yearError}</p>}
            </div>
            
            <div className="mt-4">
              <NeumorphicTabs
                tabs={[
                  { id: "stocks", label: "Saham" },
                  { id: "crypto", label: "Crypto" },
                  { id: "commodity", label: "Komoditas" }
                ]}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Return {activeTab === "stocks" ? "Saham" : activeTab === "crypto" ? "Crypto" : "Komoditas"} Tahunan</h3>
              
              {startYear && !yearError ? (
                <div className="grid grid-cols-3 gap-2">
                  {assetReturnsData.slice(0, 9).map(({ year, return: returnValue }) => (
                    <div key={year} className="mb-1">
                      <span className="font-medium">{year}:</span>{' '}
                      <span className={returnValue >= 0 ? "text-finansial-green" : "text-finansial-red"}>
                        {returnValue >= 0 ? '+' : ''}{returnValue}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Pilih tahun untuk melihat data return</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Hasil Investasi</h3>
          
          {results ? (
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 flex flex-col justify-center shadow-inner">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Jika investasi {formatRupiah(Number(initialAmount))} di {startYear}:</h4>
                  
                  <div className="mt-3 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-finansial-blue rounded-full flex items-center justify-center text-white mr-3">
                          📈
                        </div>
                        <div>
                          <p className="font-medium">Saham</p>
                          <p className="text-sm text-gray-500">IDX Composite</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatRupiah(results.results.stocks)}</p>
                        <p className={`text-sm ${results.percentages.stocks >= 0 ? "text-finansial-green" : "text-finansial-red"}`}>
                          {results.percentages.stocks >= 0 ? "+" : ""}{formatPercentage(results.percentages.stocks / 100, 0)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-finansial-orange rounded-full flex items-center justify-center text-white mr-3">
                          🪙
                        </div>
                        <div>
                          <p className="font-medium">Crypto</p>
                          <p className="text-sm text-gray-500">Bitcoin & Altcoins</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatRupiah(results.results.crypto)}</p>
                        <p className={`text-sm ${results.percentages.crypto >= 0 ? "text-finansial-green" : "text-finansial-red"}`}>
                          {results.percentages.crypto >= 0 ? "+" : ""}{formatPercentage(results.percentages.crypto / 100, 0)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-finansial-green rounded-full flex items-center justify-center text-white mr-3">
                          🧩
                        </div>
                        <div>
                          <p className="font-medium">Komoditas</p>
                          <p className="text-sm text-gray-500">Emas, Perak, dll</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatRupiah(results.results.commodity)}</p>
                        <p className={`text-sm ${results.percentages.commodity >= 0 ? "text-finansial-green" : "text-finansial-red"}`}>
                          {results.percentages.commodity >= 0 ? "+" : ""}{formatPercentage(results.percentages.commodity / 100, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    Dalam {results.yearDifference} tahun, investasi terbaik adalah{' '}
                    <span className="font-bold">
                      {results.percentages.stocks > results.percentages.crypto && results.percentages.stocks > results.percentages.commodity
                        ? "Saham"
                        : results.percentages.crypto > results.percentages.stocks && results.percentages.crypto > results.percentages.commodity
                          ? "Crypto"
                          : "Komoditas"
                      }
                    </span>{' '}
                    dengan return {formatPercentage(
                      Math.max(
                        results.percentages.stocks,
                        results.percentages.crypto,
                        results.percentages.commodity
                      ) / 100,
                      0
                    )}.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 text-center">
                Masukkan data yang valid untuk melihat hasil investasi
              </p>
            </div>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
}
