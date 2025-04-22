
import { useState, useCallback, useMemo } from "react";
import { NeumorphicCard, NeumorphicInput } from "@/components/ui/skeuomorphic";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateInvestmentReturn, AssetType, ASSET_RETURNS } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

export default function InvestmentComparison() {
  const currentYear = new Date().getFullYear();
  const [initialAmount, setInitialAmount] = useState<string>("10000000");
  const [startYear, setStartYear] = useState<string>("2015");
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>(["stocks"]);
  
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
  
  const handleAssetToggle = useCallback((asset: AssetType) => {
    setSelectedAssets(prev => {
      if (prev.includes(asset)) {
        return prev.filter(a => a !== asset);
      } else {
        return [...prev, asset];
      }
    });
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
    return Object.keys(ASSET_RETURNS.stocks)
      .map(Number)
      .filter(year => year < currentYear)
      .sort((a, b) => b - a);
  }, [currentYear]);
  
  // Calculate results with useCallback
  const calculateResults = useCallback(() => {
    if (!validateInputs() || selectedAssets.length === 0) return null;
    
    const amount = Number(initialAmount);
    const year = Number(startYear);
    
    const results = selectedAssets.reduce((acc, asset) => {
      acc[asset] = calculateInvestmentReturn(amount, asset, year);
      return acc;
    }, {} as Record<AssetType, number>);
    
    return {
      results,
      percentages: Object.entries(results).reduce((acc, [asset, value]) => {
        acc[asset] = (value / amount - 1) * 100;
        return acc;
      }, {} as Record<string, number>),
      yearDifference: currentYear - year
    };
  }, [initialAmount, startYear, selectedAssets, validateInputs, currentYear]);
  
  // Memoize results
  const results = useMemo(() => calculateResults(), [calculateResults]);
  
  // Get asset returns for selected assets
  const assetReturnsData = useMemo(() => {
    if (!startYear || yearError) return [];
    
    const year = Number(startYear);
    return Object.keys(ASSET_RETURNS.stocks)
      .map(Number)
      .filter(y => y >= year && y < currentYear)
      .sort((a, b) => a - b)
      .map(y => ({
        year: y,
        returns: selectedAssets.reduce((acc, asset) => {
          acc[asset] = ASSET_RETURNS[asset][y];
          return acc;
        }, {} as Record<AssetType, number>)
      }));
  }, [startYear, yearError, currentYear, selectedAssets]);

  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Komparasi Investasi</h2>
      <p className="text-sm text-gray-600 mb-4">
        Bandingkan kinerja historis berbagai aset investasi. {Number(startYear) < 2010 && selectedAssets.includes('crypto') && 
        <span className="text-finansial-red">*Bitcoin baru ada sejak tahun 2010</span>}
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
              className="[&::-webkit-inner-spin-button]:appearance-none"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pilih Instrumen Investasi:</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stocks"
                    checked={selectedAssets.includes('stocks')}
                    onCheckedChange={() => handleAssetToggle('stocks')}
                  />
                  <label htmlFor="stocks" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Saham
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="crypto"
                    checked={selectedAssets.includes('crypto')}
                    onCheckedChange={() => handleAssetToggle('crypto')}
                  />
                  <label htmlFor="crypto" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Crypto
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="commodity"
                    checked={selectedAssets.includes('commodity')}
                    onCheckedChange={() => handleAssetToggle('commodity')}
                  />
                  <label htmlFor="commodity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Komoditas
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Return Tahunan</h3>
              <ScrollArea className="h-[200px]">
                <div className="pr-4">
                  {startYear && !yearError ? (
                    assetReturnsData.map(({ year, returns }) => (
                      <div key={year} className="mb-2 p-2 bg-white rounded-lg shadow-sm">
                        <div className="font-medium">{year}</div>
                        {Object.entries(returns).map(([asset, returnValue]) => (
                          <div key={asset} className="text-sm">
                            <span className="capitalize">{asset === 'stocks' ? 'Saham' : asset === 'crypto' ? 'Crypto' : 'Komoditas'}:</span>{' '}
                            <span className={returnValue >= 0 ? "text-finansial-green" : "text-finansial-red"}>
                              {returnValue >= 0 ? '+' : ''}{returnValue}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Pilih tahun untuk melihat data return</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Hasil Investasi</h3>
          
          {results && selectedAssets.length > 0 ? (
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 flex flex-col justify-center shadow-inner">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Jika investasi {formatRupiah(Number(initialAmount))} di {startYear}:
                  </h4>
                  
                  <div className="mt-3 space-y-4">
                    {selectedAssets.map(asset => (
                      <div key={asset} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${
                            asset === 'stocks' ? 'bg-finansial-blue' : 
                            asset === 'crypto' ? 'bg-finansial-orange' : 'bg-finansial-green'
                          }`}>
                            {asset === 'stocks' ? '📈' : asset === 'crypto' ? '🪙' : '🧩'}
                          </div>
                          <div>
                            <p className="font-medium">{asset === 'stocks' ? 'Saham' : asset === 'crypto' ? 'Crypto' : 'Komoditas'}</p>
                            <p className="text-sm text-gray-500">
                              {asset === 'stocks' ? 'IDX Composite' : asset === 'crypto' ? 'Bitcoin & Altcoins' : 'Emas, Perak, dll'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatRupiah(results.results[asset])}</p>
                          <p className={`text-sm ${results.percentages[asset] >= 0 ? "text-finansial-green" : "text-finansial-red"}`}>
                            {results.percentages[asset] >= 0 ? "+" : ""}{formatPercentage(results.percentages[asset] / 100, 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedAssets.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      Dalam {results.yearDifference} tahun, investasi terbaik adalah{' '}
                      <span className="font-bold">
                        {Object.entries(results.percentages)
                          .sort(([,a], [,b]) => b - a)[0][0] === 'stocks' ? 'Saham' : 
                          Object.entries(results.percentages)
                          .sort(([,a], [,b]) => b - a)[0][0] === 'crypto' ? 'Crypto' : 'Komoditas'
                        }
                      </span>{' '}
                      dengan return {formatPercentage(
                        Math.max(...Object.values(results.percentages)) / 100,
                        0
                      )}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 text-center">
                {selectedAssets.length === 0 
                  ? "Pilih minimal satu instrumen investasi"
                  : "Masukkan data yang valid untuk melihat hasil investasi"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
}
