
import { useState, useCallback, useMemo } from "react";
import { NeumorphicCard, NeumorphicInput, NeumorphicTabs, NeumorphicButton } from "@/components/ui/skeuomorphic";
import { calculateFutureValue, INFLATION_SCENARIOS } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

export default function FuturePriceCalculator() {
  const [currentPrice, setCurrentPrice] = useState<string>("100000");
  const [years, setYears] = useState<string>("5");
  const [scenarioType, setScenarioType] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [customRate, setCustomRate] = useState<string>("4.0");
  const [activeTab, setActiveTab] = useState<"scenarios" | "custom">("scenarios");
  
  // Error states
  const [priceError, setPriceError] = useState<string>("");
  const [yearsError, setYearsError] = useState<string>("");
  const [rateError, setRateError] = useState<string>("");

  // Handle input validation
  const validateInputs = useCallback(() => {
    let isValid = true;
    
    if (!currentPrice || isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      setPriceError("Harga harus berupa angka positif");
      isValid = false;
    } else {
      setPriceError("");
    }
    
    if (!years || isNaN(Number(years)) || Number(years) <= 0 || Number(years) > 50) {
      setYearsError("Tahun harus antara 1-50");
      isValid = false;
    } else {
      setYearsError("");
    }
    
    if (activeTab === "custom" && (!customRate || isNaN(Number(customRate)) || Number(customRate) < 0 || Number(customRate) > 30)) {
      setRateError("Inflasi harus antara 0-30%");
      isValid = false;
    } else {
      setRateError("");
    }
    
    return isValid;
  }, [currentPrice, years, customRate, activeTab]);

  // Calculate future prices for different scenarios
  const calculateResults = useCallback(() => {
    if (!validateInputs()) return null;
    
    const price = Number(currentPrice);
    const yearCount = Number(years);
    
    if (activeTab === "scenarios") {
      const results = {
        LOW: calculateFutureValue(price, yearCount, INFLATION_SCENARIOS.LOW),
        MEDIUM: calculateFutureValue(price, yearCount, INFLATION_SCENARIOS.MEDIUM),
        HIGH: calculateFutureValue(price, yearCount, INFLATION_SCENARIOS.HIGH)
      };
      
      return results;
    } else {
      const inflation = Number(customRate);
      return calculateFutureValue(price, yearCount, inflation);
    }
  }, [currentPrice, years, customRate, activeTab, validateInputs]);

  // Memoize results to prevent recalculation on every render
  const results = useMemo(() => calculateResults(), [calculateResults]);

  // Handle scenario button clicks
  const handleScenarioClick = useCallback((scenario: "LOW" | "MEDIUM" | "HIGH") => {
    setScenarioType(scenario);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as "scenarios" | "custom");
  }, []);

  // Handle input changes with useCallback
  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrice(e.target.value);
  }, []);

  const handleYearsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setYears(e.target.value);
  }, []);

  const handleCustomRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRate(e.target.value);
  }, []);

  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Prediksi Harga Masa Depan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Masukkan Data</h3>
          
          <div className="space-y-4">
            <NeumorphicInput
              label="Harga Saat Ini"
              type="number"
              value={currentPrice}
              onChange={handlePriceChange}
              prefix="Rp"
              error={priceError}
              min={0}
            />
            
            <NeumorphicInput
              label="Berapa Tahun Lagi?"
              type="number"
              value={years}
              onChange={handleYearsChange}
              suffix="tahun"
              error={yearsError}
              min={1}
              max={50}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Inflasi</label>
              <NeumorphicTabs
                tabs={[
                  { id: "scenarios", label: "Skenario" },
                  { id: "custom", label: "Kustom" }
                ]}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
            </div>
            
            {activeTab === "scenarios" ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <NeumorphicButton
                  onClick={() => handleScenarioClick("LOW")}
                  active={scenarioType === "LOW"}
                  className="text-sm py-2"
                >
                  Rendah ({INFLATION_SCENARIOS.LOW}%)
                </NeumorphicButton>
                <NeumorphicButton
                  onClick={() => handleScenarioClick("MEDIUM")}
                  active={scenarioType === "MEDIUM"}
                  className="text-sm py-2"
                >
                  Sedang ({INFLATION_SCENARIOS.MEDIUM}%)
                </NeumorphicButton>
                <NeumorphicButton
                  onClick={() => handleScenarioClick("HIGH")}
                  active={scenarioType === "HIGH"}
                  className="text-sm py-2"
                >
                  Tinggi ({INFLATION_SCENARIOS.HIGH}%)
                </NeumorphicButton>
              </div>
            ) : (
              <NeumorphicInput
                label="Persentase Inflasi"
                type="number"
                value={customRate}
                onChange={handleCustomRateChange}
                suffix="%"
                error={rateError}
                min={0}
                max={30}
                step={0.1}
              />
            )}
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Hasil Prediksi</h3>
          
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 flex flex-col justify-center shadow-inner">
            {results && activeTab === "scenarios" && typeof results === "object" ? (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Skenario {scenarioType === "LOW" ? "Rendah" : scenarioType === "MEDIUM" ? "Sedang" : "Tinggi"}</span>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-gray-800">
                      {formatRupiah(results[scenarioType])}
                    </span>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">Inflasi {formatPercentage(INFLATION_SCENARIOS[scenarioType] / 100, 1)} per tahun</span>
                      <span className="ml-2 px-2 py-0.5 bg-finansial-green/10 text-finansial-green text-xs rounded-full">
                        +{formatPercentage((results[scenarioType] / Number(currentPrice) - 1), 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">Rendah</span>
                    <p className="font-semibold">{formatRupiah(results.LOW)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Sedang</span>
                    <p className="font-semibold">{formatRupiah(results.MEDIUM)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Tinggi</span>
                    <p className="font-semibold">{formatRupiah(results.HIGH)}</p>
                  </div>
                </div>
              </div>
            ) : results && activeTab === "custom" && typeof results === "number" ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Dengan Inflasi {customRate}%</span>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-gray-800">
                    {formatRupiah(results)}
                  </span>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">Dalam {years} tahun</span>
                    <span className="ml-2 px-2 py-0.5 bg-finansial-green/10 text-finansial-green text-xs rounded-full">
                      +{formatPercentage((results / Number(currentPrice) - 1), 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Masukkan data yang valid untuk melihat prediksi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </NeumorphicCard>
  );
}
