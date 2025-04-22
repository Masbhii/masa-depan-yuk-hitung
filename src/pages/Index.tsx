
import { useState } from "react";
import { NeumorphicTabs } from "@/components/ui/skeuomorphic";
import InflationInfoCard from "@/components/InflationInfoCard";
import FuturePriceCalculator from "@/components/FuturePriceCalculator";
import InvestmentComparison from "@/components/InvestmentComparison";
import HistoricalValueCalculator from "@/components/HistoricalValueCalculator";
import CostFutureCalculator from "@/components/CostFutureCalculator";
import LivingCostCalculator from "@/components/LivingCostCalculator";

export default function Index() {
  const [activeTab, setActiveTab] = useState<string>("inflation");
  
  const tabs = [
    { id: "inflation", label: "Prediksi Harga" },
    { id: "historical", label: "Nilai Historis" },
    { id: "investments", label: "Komparasi Investasi" },
    { id: "future-costs", label: "Biaya Masa Depan" },
    { id: "living-costs", label: "Biaya Hidup vs UMR" },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-10">
      <header className="bg-white shadow-md py-4 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-purple-600">BerapaNanti?</h1>
              <p className="text-gray-600">Bantu kamu tahu harga masa depan!</p>
            </div>
            <InflationInfoCard />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <div className="mb-6">
          <NeumorphicTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="w-full md:w-auto"
          />
        </div>
        
        <div>
          {activeTab === "inflation" && <FuturePriceCalculator />}
          {activeTab === "historical" && <HistoricalValueCalculator />}
          {activeTab === "investments" && <InvestmentComparison />}
          {activeTab === "future-costs" && <CostFutureCalculator />}
          {activeTab === "living-costs" && <LivingCostCalculator />}
        </div>
        
        <div className="mt-10 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Kenapa Harus Peduli dengan Inflasi?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl mb-3">
                💰
              </div>
              <h3 className="font-semibold mb-2">Daya Beli Menurun</h3>
              <p className="text-sm text-gray-600">
                Uang Rp100 ribu hari ini nggak akan bisa beli barang yang sama 5 tahun lagi. Inflasi bikin nilai uangmu turun!
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl mb-3">
                📈
              </div>
              <h3 className="font-semibold mb-2">Investasi Tepat</h3>
              <p className="text-sm text-gray-600">
                Uang yang cuma disimpan di bawah bantal bakal kehilangan nilai. Dengan investasi tepat, uangmu bisa ngalahin inflasi!
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl mb-3">
                🔮
              </div>
              <h3 className="font-semibold mb-2">Rencanakan Masa Depan</h3>
              <p className="text-sm text-gray-600">
                Mau nikah? Beli rumah? Sekolahin anak? Kamu harus perhitungkan inflasi supaya danamu nggak kurang di masa depan.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 py-8 bg-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">BerapaNanti?</h2>
              <p className="text-sm text-purple-200">
                Membantu kamu memahami & mengelola dampak inflasi dalam hidup
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-purple-200">© {new Date().getFullYear()} BerapaNanti</p>
              <p className="text-xs text-purple-300 mt-1">
                Semua data yang digunakan adalah perkiraan dan tidak menjamin keakuratan 100%
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
