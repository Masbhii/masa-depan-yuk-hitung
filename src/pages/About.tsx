
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Tentang BerapaNanti?</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
        <p className="text-gray-700 mb-6">
          BerapaNanti hadir untuk membantu masyarakat Indonesia memahami dan mengelola dampak inflasi dalam kehidupan sehari-hari. 
          Kami percaya bahwa dengan pemahaman yang lebih baik tentang inflasi, setiap orang dapat membuat keputusan finansial yang lebih baik untuk masa depan mereka.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Apa yang Kami Tawarkan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Kalkulator Inflasi</h3>
            <p className="text-gray-600">
              Hitung proyeksi harga di masa depan dan nilai historis uang dengan mempertimbangkan dampak inflasi.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Perbandingan Investasi</h3>
            <p className="text-gray-600">
              Bandingkan berbagai instrumen investasi untuk membantu Anda membuat keputusan investasi yang tepat.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Perencanaan Biaya</h3>
            <p className="text-gray-600">
              Rencanakan biaya masa depan untuk pendidikan, pernikahan, dan kebutuhan penting lainnya.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Edukasi Finansial</h3>
            <p className="text-gray-600">
              Akses artikel dan materi edukatif untuk meningkatkan literasi finansial Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
