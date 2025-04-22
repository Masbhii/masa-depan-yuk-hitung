
import { useState } from "react";
import { GlassCard, InfoPanel } from "@/components/ui/skeuomorphic";
import { formatPercentage } from "@/utils/formatters";
import { getCurrentInflationRate } from "@/utils/calculators";

export default function InflationInfoCard() {
  const currentInflation = getCurrentInflationRate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <GlassCard className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Inflasi Indonesia Saat Ini</h2>
          <InfoPanel
            title="Persentase Tahunan"
            value={formatPercentage(currentInflation / 100, 2)}
            trend={currentInflation - 3.5}
          />
        </div>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
        >
          {showInfo ? 'Sembunyikan Info' : 'Apa itu Inflasi?'}
        </button>
      </div>

      {showInfo && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold mb-2">Apa Sih Inflasi Itu?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus-menerus selama periode tertentu. 
            Singkatnya, dengan uang yang sama, kamu bakal dapat barang/jasa yang lebih sedikit di masa depan.
          </p>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm font-medium">Contoh Sederhana:</p>
            <p className="text-sm text-gray-700">
              Indomie 5 tahun lalu Rp2.500, sekarang Rp3.300. Kalau inflasi tetap 3% per tahun, 
              5 tahun lagi harganya bisa Rp3.825!
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
