import { useState, useCallback, useMemo } from "react";
import { NeumorphicCard, NeumorphicInput, NeumorphicTabs } from "@/components/ui/skeuomorphic";
import { calculateFutureValue, INFLATION_SCENARIOS } from "@/utils/calculators";
import { formatRupiah, formatNumberWithSeparator } from "@/utils/formatters";

// Life goal options with default costs
const LIFE_GOALS = [
  { id: "wedding", name: "Nikah", defaultCost: 150000000, icon: "💍" },
  { id: "car", name: "Beli Mobil", defaultCost: 250000000, icon: "🚗" },
  { id: "motorcycle", name: "Beli Motor", defaultCost: 25000000, icon: "🏍️" },
  { id: "education", name: "Pendidikan Anak", defaultCost: 300000000, icon: "🎓" },
  { id: "house", name: "Beli Rumah", defaultCost: 800000000, icon: "🏠" },
  { id: "travel", name: "Liburan", defaultCost: 50000000, icon: "✈️" },
];

export default function CostFutureCalculator() {
  const [selectedGoal, setSelectedGoal] = useState<string>("wedding");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [currentCost, setCurrentCost] = useState<string>("150000000"); // Default to wedding cost
  const [years, setYears] = useState<string>("5");
  
  // Error states
  const [costError, setCostError] = useState<string>("");
  const [yearsError, setYearsError] = useState<string>("");

  // Handle goal selection with useCallback
  const handleGoalChange = useCallback((goalId: string) => {
    setSelectedGoal(goalId);
    
    // Set default cost based on selected goal
    if (goalId !== "custom") {
      const goal = LIFE_GOALS.find(g => g.id === goalId);
      if (goal) {
        setCurrentCost(goal.defaultCost.toString());
      }
    }
  }, []);

  // Handle input changes with useCallback
  const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '');
    setCurrentCost(rawValue);
  }, []);

  const handleYearsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setYears(e.target.value);
  }, []);

  const handleCustomDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescription(e.target.value);
  }, []);

  // Validate inputs with useCallback
  const validateInputs = useCallback(() => {
    let isValid = true;
    
    if (!currentCost || isNaN(Number(currentCost)) || Number(currentCost) <= 0) {
      setCostError("Biaya harus berupa angka positif");
      isValid = false;
    } else {
      setCostError("");
    }
    
    if (!years || isNaN(Number(years)) || Number(years) <= 0 || Number(years) > 50) {
      setYearsError("Tahun harus antara 1-50");
      isValid = false;
    } else {
      setYearsError("");
    }
    
    return isValid;
  }, [currentCost, years]);

  // Calculate future costs with useCallback
  const calculateResults = useCallback(() => {
    if (!validateInputs()) return null;
    
    const cost = Number(currentCost);
    const yearCount = Number(years);
    
    return {
      LOW: calculateFutureValue(cost, yearCount, INFLATION_SCENARIOS.LOW),
      MEDIUM: calculateFutureValue(cost, yearCount, INFLATION_SCENARIOS.MEDIUM),
      HIGH: calculateFutureValue(cost, yearCount, INFLATION_SCENARIOS.HIGH)
    };
  }, [validateInputs, currentCost, years]);

  // Memoize results to prevent recalculation on each render
  const results = useMemo(() => calculateResults(), [calculateResults]);

  // Get goal information with useMemo
  const currentGoal = useMemo(() => {
    return selectedGoal === "custom" 
      ? { name: customDescription || "Tujuan Kustom", icon: "🎯" } 
      : LIFE_GOALS.find(g => g.id === selectedGoal) || LIFE_GOALS[0];
  }, [selectedGoal, customDescription]);

  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Kalkulator Biaya Masa Depan</h2>
      <p className="text-sm text-gray-600 mb-4">
        Rencanakan kebutuhan finansial untuk mencapai tujuan hidupmu
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Pilih Tujuan</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {LIFE_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalChange(goal.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                  selectedGoal === goal.id 
                    ? "bg-purple-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)]" 
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl mb-1">{goal.icon}</span>
                <span className="text-sm font-medium">{goal.name}</span>
              </button>
            ))}
            
            <button
              onClick={() => handleGoalChange("custom")}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                selectedGoal === "custom" 
                  ? "bg-purple-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)]" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl mb-1">🎯</span>
              <span className="text-sm font-medium">Kustom</span>
            </button>
          </div>
          
          {selectedGoal === "custom" && (
            <NeumorphicInput
              label="Deskripsi Tujuan"
              type="text"
              value={customDescription}
              onChange={handleCustomDescriptionChange}
              placeholder="Contoh: Beli Laptop Baru"
              className="mb-4"
            />
          )}
          
          <div className="space-y-4">
            <NeumorphicInput
              label="Estimasi Biaya Saat Ini"
              type="text"
              value={formatNumberWithSeparator(currentCost)}
              onChange={handleCostChange}
              prefix="Rp"
              error={costError}
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
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Proyeksi Biaya Masa Depan</h3>
          
          {results ? (
            <div className="flex-1 bg-gradient-to-br from-purple-100/50 to-white rounded-lg overflow-hidden shadow-inner">
              <div className="p-4 bg-purple-500 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{currentGoal.icon}</span>
                  <div>
                    <h3 className="font-bold">{currentGoal.name}</h3>
                    <p className="text-sm text-purple-100">dalam {years} tahun ({new Date().getFullYear() + Number(years)})</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-500 mb-1">Skenario Sedang (Inflasi {INFLATION_SCENARIOS.MEDIUM}%)</p>
                      <p className="text-2xl font-bold">{formatRupiah(results.MEDIUM)}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-1">Skenario Rendah ({INFLATION_SCENARIOS.LOW}%)</p>
                        <p className="text-xl font-bold">{formatRupiah(results.LOW)}</p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-1">Skenario Tinggi ({INFLATION_SCENARIOS.HIGH}%)</p>
                        <p className="text-xl font-bold">{formatRupiah(results.HIGH)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="text-purple-500 text-lg mr-2">💡</span>
                      <p>
                        Untuk mencapai tujuan ini, kamu perlu menyiapkan sekitar 
                        <span className="font-semibold"> {formatRupiah(results.MEDIUM)}</span> dalam {years} tahun ke depan.
                        Mulai nabung dari sekarang ya!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 text-center">
                Masukkan data yang valid untuk melihat hasil perhitungan
              </p>
            </div>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
}
