
import { useState, useEffect, useCallback, useMemo } from "react";
import { NeumorphicCard, NeumorphicInput, NeumorphicButton, GlassCard } from "@/components/ui/skeuomorphic";
import { calculateInvestmentReturn, AssetType } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

// Asset choices
const ASSETS = [
  { id: "crypto", name: "Bitcoin", type: "crypto", iconColor: "text-finansial-orange" },
  { id: "stocks", name: "BBCA", type: "stocks", iconColor: "text-finansial-blue" },
  { id: "commodity", name: "Emas", type: "commodity", iconColor: "text-finansial-yellow" },
];

export default function InvestmentComparison() {
  const currentYear = new Date().getFullYear();
  const [amount, setAmount] = useState<string>("1000000");
  const [startYear, setStartYear] = useState<string>("2015");
  const [selectedAsset, setSelectedAsset] = useState<AssetType>("stocks");
  const [results, setResults] = useState<Record<AssetType, number>>({
    crypto: 0,
    stocks: 0,
    commodity: 0,
  });
  const [amountError, setAmountError] = useState<string>("");
  const [yearError, setYearError] = useState<string>("");
  const [showAllResults, setShowAllResults] = useState(false);

  // Validate inputs - wrapped in useCallback to prevent recreation on every render
  const validateInputs = useCallback(() => {
    let isValid = true;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError("Nominal investasi harus berupa angka positif");
      isValid = false;
    } else {
      setAmountError("");
    }
    
    const year = Number(startYear);
    if (!startYear || isNaN(year) || year < 2010 || year >= currentYear) {
      setYearError(`Tahun harus antara 2010-${currentYear - 1}`);
      isValid = false;
    } else {
      setYearError("");
    }
    
    return isValid;
  }, [amount, startYear, currentYear]);

  // Calculate investment returns - wrapped in useEffect with proper dependencies
  useEffect(() => {
    if (!validateInputs()) return;
    
    const initialAmount = Number(amount);
    const year = Number(startYear);
    
    // Calculate returns for all asset types
    const newResults = {
      crypto: calculateInvestmentReturn(initialAmount, "crypto", year),
      stocks: calculateInvestmentReturn(initialAmount, "stocks", year),
      commodity: calculateInvestmentReturn(initialAmount, "commodity", year),
    };
    
    setResults(newResults);
  }, [amount, startYear, validateInputs]);

  // Get the ROI percentage - wrapped in useCallback
  const calculateROI = useCallback((currentValue: number) => {
    const initialAmount = Number(amount);
    return ((currentValue / initialAmount) - 1) * 100;
  }, [amount]);

  // Get the leading asset (highest return) - memoized with useMemo
  const leadingAsset = useMemo(() => {
    let highest: { type: AssetType; value: number } = { type: "stocks", value: 0 };
    
    Object.entries(results).forEach(([type, value]) => {
      if (value > highest.value) {
        highest = { type: type as AssetType, value };
      }
    });
    
    return highest;
  }, [results]);

  // Event handlers with useCallback
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleStartYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartYear(e.target.value);
  }, []);

  const handleAssetSelection = useCallback((assetType: AssetType) => {
    setSelectedAsset(assetType);
  }, []);

  const toggleShowAllResults = useCallback(() => {
    setShowAllResults(prev => !prev);
  }, []);

  return (
    <NeumorphicCard className="w-full mb-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Komparasi Investasi</h2>
        <p className="text-sm text-gray-600">
          Simulasikan nilai investasimu pada berbagai aset dari tahun lalu hingga sekarang
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NeumorphicInput
            label="Nominal Investasi"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            prefix="Rp"
            error={amountError}
            min={1000}
          />
          
          <NeumorphicInput
            label="Tahun Investasi"
            type="number"
            value={startYear}
            onChange={handleStartYearChange}
            error={yearError}
            min={2010}
            max={currentYear - 1}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Aset</label>
            <div className="grid grid-cols-3 gap-2">
              {ASSETS.map((asset) => (
                <NeumorphicButton
                  key={asset.id}
                  onClick={() => handleAssetSelection(asset.id as AssetType)}
                  active={selectedAsset === asset.id}
                  className="text-sm py-2"
                >
                  <span className={`${asset.iconColor} mr-1`}>●</span> {asset.name}
                </NeumorphicButton>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {validateInputs() && (
          <div className="mt-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold">Hasil Investasi</h3>
              <button 
                onClick={toggleShowAllResults}
                className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
              >
                {showAllResults ? 'Tampilkan Terpilih' : 'Bandingkan Semua'}
              </button>
            </div>
            
            {showAllResults ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ASSETS.map((asset) => {
                  const assetType = asset.id as AssetType;
                  const value = results[assetType];
                  const roi = calculateROI(value);
                  const isHighest = leadingAsset.type === assetType;
                  
                  return (
                    <GlassCard 
                      key={asset.id}
                      className={`${isHighest ? 'border-2 border-finansial-green' : ''}`}
                      colorClass={
                        assetType === "crypto" 
                          ? "from-finansial-orange/10 to-white/90" 
                          : assetType === "stocks" 
                            ? "from-finansial-blue/10 to-white/90" 
                            : "from-finansial-yellow/10 to-white/90"
                      }
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{asset.name}</h4>
                          {isHighest && (
                            <span className="bg-finansial-green text-white text-xs px-2 py-0.5 rounded-full">
                              Terbaik
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold">{formatRupiah(value)}</p>
                        <div className="flex items-center mt-1">
                          <span className={`text-sm font-medium ${roi >= 0 ? 'text-finansial-green' : 'text-finansial-red'}`}>
                            {roi >= 0 ? '+' : ''}{formatPercentage(roi / 100, 0)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">dari {formatRupiah(Number(amount))}</span>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            ) : (
              <GlassCard
                colorClass={
                  selectedAsset === "crypto" 
                    ? "from-finansial-orange/10 to-white/90" 
                    : selectedAsset === "stocks" 
                      ? "from-finansial-blue/10 to-white/90" 
                      : "from-finansial-yellow/10 to-white/90"
                }
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h4 className="font-medium mb-1">
                      {ASSETS.find(asset => asset.id === selectedAsset)?.name}
                    </h4>
                    <p className="text-3xl font-bold">
                      {formatRupiah(results[selectedAsset])}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`text-sm font-medium ${calculateROI(results[selectedAsset]) >= 0 ? 'text-finansial-green' : 'text-finansial-red'}`}>
                        {calculateROI(results[selectedAsset]) >= 0 ? '+' : ''}{formatPercentage(calculateROI(results[selectedAsset]) / 100, 0)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">dari {formatRupiah(Number(amount))}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-sm text-gray-500">Nilai investasi sejak {startYear}</p>
                    <p className="text-lg mt-1">
                      {formatRupiah(Number(amount))} → {formatRupiah(results[selectedAsset])}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(currentYear - Number(startYear))} tahun performa investasi
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </NeumorphicCard>
  );
}
