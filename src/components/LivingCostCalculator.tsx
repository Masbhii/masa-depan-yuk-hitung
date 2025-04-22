
import { useState } from "react";
import { NeumorphicCard, NeumorphicInput } from "@/components/ui/skeuomorphic";
import { UMR_DATA, calculatePercentageDifference } from "@/utils/calculators";
import { formatRupiah, formatPercentage } from "@/utils/formatters";

// Default living cost categories
const COST_CATEGORIES = [
  { id: "food", name: "Makanan", defaultCost: 1200000, icon: "🍲" },
  { id: "rent", name: "Sewa/Cicilan", defaultCost: 1500000, icon: "🏠" },
  { id: "transport", name: "Transportasi", defaultCost: 600000, icon: "🚌" },
  { id: "utilities", name: "Tagihan", defaultCost: 500000, icon: "💡" },
  { id: "entertainment", name: "Hiburan", defaultCost: 300000, icon: "🎬" },
  { id: "others", name: "Lainnya", defaultCost: 400000, icon: "📦" },
];

export default function LivingCostCalculator() {
  const [location, setLocation] = useState<string>("Jakarta");
  const [customUMR, setCustomUMR] = useState<string>("0");
  const [costs, setCosts] = useState<Record<string, number>>({
    food: 1200000,
    rent: 1500000,
    transport: 600000,
    utilities: 500000,
    entertainment: 300000,
    others: 400000,
  });
  
  // Error state
  const [customUMRError, setCustomUMRError] = useState<string>("");
  
  // Handle cost changes
  const handleCostChange = (category: string, value: string) => {
    const newValue = value === "" ? 0 : Number(value);
    setCosts({
      ...costs,
      [category]: newValue,
    });
  };
  
  // Calculate total living cost
  const totalLivingCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  
  // Get UMR value based on location or custom input
  const getUMRValue = () => {
    if (location === "custom") {
      const value = Number(customUMR);
      return isNaN(value) ? 0 : value;
    }
    return UMR_DATA[location] || 0;
  };
  
  const umrValue = getUMRValue();
  
  // Calculate the percentage difference between UMR and living cost
  const umrVsCostDifference = umrValue - totalLivingCost;
  const percentageDifference = calculatePercentageDifference(umrValue, totalLivingCost);
  
  // Calculate personal inflation
  const calculatePersonalInflation = () => {
    // In a real app, this would compare against historical cost data
    // For now, we'll use a simplified estimate based on total cost vs average UMR
    const averageUMR = Object.values(UMR_DATA).reduce((sum, umr) => sum + umr, 0) / Object.keys(UMR_DATA).length;
    const personalInflation = ((totalLivingCost / averageUMR) - 1) * 100;
    
    // Cap at reasonable values for demonstration
    return Math.max(Math.min(personalInflation, 15), 1.5);
  };
  
  return (
    <NeumorphicCard className="w-full mb-6">
      <h2 className="text-xl font-bold mb-4">Perbandingan Biaya Hidup vs UMR</h2>
      <p className="text-sm text-gray-600 mb-4">
        Bandingkan pengeluaran bulananmu dengan UMR daerah
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Pilih Lokasi</h3>
          
          <div className="mb-4">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-3 px-4 bg-white rounded-lg text-gray-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {Object.keys(UMR_DATA).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="custom">Input UMR Manual</option>
            </select>
          </div>
          
          {location === "custom" && (
            <NeumorphicInput
              label="UMR Daerahmu"
              type="number"
              value={customUMR}
              onChange={(e) => setCustomUMR(e.target.value)}
              prefix="Rp"
              error={customUMRError}
              min={0}
              className="mb-4"
            />
          )}
          
          <h3 className="text-sm font-medium text-gray-500 mb-3">Biaya Hidup Bulanan</h3>
          
          <div className="space-y-3">
            {COST_CATEGORIES.map((category) => (
              <div key={category.id} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg mr-3">
                  <span>{category.icon}</span>
                </div>
                <div className="flex-1">
                  <NeumorphicInput
                    label={category.name}
                    type="number"
                    value={costs[category.id]}
                    onChange={(e) => handleCostChange(category.id, e.target.value)}
                    prefix="Rp"
                    min={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Hasil Analisis</h3>
          
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-lg overflow-hidden shadow-inner">
            <div className="p-4 bg-purple-500 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Ringkasan Finansial</h3>
                <p className="text-sm">{location === "custom" ? "Daerahmu" : location}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">UMR Daerah</p>
                  <p className="text-xl font-bold">{formatRupiah(umrValue)}</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Biaya Hidup</p>
                  <p className="text-xl font-bold">{formatRupiah(totalLivingCost)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium">Selisih</p>
                  <p className={`text-sm font-medium ${umrVsCostDifference >= 0 ? 'text-finansial-green' : 'text-finansial-red'}`}>
                    {umrVsCostDifference >= 0 ? '+' : ''}{formatRupiah(umrVsCostDifference)}
                  </p>
                </div>
                
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 h-full rounded-full ${
                      umrVsCostDifference >= 0 ? 'bg-finansial-green' : 'bg-finansial-red'
                    }`} 
                    style={{ 
                      width: umrVsCostDifference >= 0 
                        ? '100%' 
                        : `${Math.min(100, (totalLivingCost / umrValue) * 100)}%`,
                      left: umrVsCostDifference >= 0 ? '0' : 'auto',
                      right: umrVsCostDifference >= 0 ? 'auto' : '0',
                    }}
                  ></div>
                  {umrVsCostDifference >= 0 && (
                    <div className="absolute top-0 h-full bg-gray-300" style={{ width: `${Math.min(100, (totalLivingCost / umrValue) * 100)}%` }}></div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Tingkat Inflasi Pribadimu</h4>
                  <p className="font-bold text-xl text-finansial-orange">
                    {formatPercentage(calculatePersonalInflation() / 100, 1)}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {umrVsCostDifference >= 0 
                    ? `UMR di ${location === "custom" ? "daerahmu" : location} cukup untuk menutupi biaya hidup bulananmu dengan sisa ${formatRupiah(umrVsCostDifference)}.` 
                    : `UMR di ${location === "custom" ? "daerahmu" : location} tidak cukup untuk menutupi biaya hidupmu. Ada selisih kekurangan ${formatRupiah(Math.abs(umrVsCostDifference))}.`
                  }
                </p>
                
                <div className="text-sm bg-purple-50 p-3 rounded-lg mt-3">
                  <div className="flex items-start">
                    <span className="text-purple-500 text-lg mr-2">💡</span>
                    <p>
                      {umrVsCostDifference >= 0 
                        ? `Kamu termasuk beruntung karena pengeluaranmu masih di bawah UMR. Coba tingkatkan tabungan atau investasi dengan sisa ${formatPercentage(Math.abs(percentageDifference) / 100, 0)} dari pendapatanmu.` 
                        : `Biaya hidupmu ${formatPercentage(Math.abs(percentageDifference) / 100, 0)} lebih tinggi dari UMR. Pertimbangkan untuk mencari sumber penghasilan tambahan atau mengurangi pengeluaran.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NeumorphicCard>
  );
}
