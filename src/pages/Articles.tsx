
import { Link, useParams } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "Memahami Inflasi dan Dampaknya",
    excerpt: "Pelajari apa itu inflasi, bagaimana cara kerjanya, dan mengapa penting untuk dipahami.",
    category: "Dasar Inflasi",
    readTime: "5 menit",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4">Apa Itu Inflasi?<br /><span className="text-base font-normal">(Dan Kenapa Harga Indomie Naik Terus?)</span></h2>
        <p className="mb-4">Kalau kamu merasa harga-harga barang makin mahal dari tahun ke tahun, itu bukan cuma perasaan — itu yang disebut inflasi.<br />Secara sederhana, inflasi adalah kenaikan harga barang dan jasa secara umum dalam suatu periode waktu tertentu. Artinya, nilai uang yang kita pegang sekarang perlahan menurun daya belinya.</p>
        <p className="mb-4">Bayangkan, 5 tahun lalu harga sebungkus Indomie mungkin Rp2.500. Sekarang, kamu harus merogoh kocek sekitar Rp3.500 bahkan lebih. Dengan jumlah uang yang sama, barang yang bisa kamu beli jadi lebih sedikit. Itulah dampak nyata inflasi dalam kehidupan sehari-hari.</p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Kenapa Inflasi Terjadi?</h3>
        <p className="mb-2">Inflasi bisa disebabkan oleh banyak faktor, misalnya:</p>
        <ul className="list-disc ml-6 mb-4">
          <li><b>Permintaan meningkat:</b> Kalau banyak orang ingin membeli suatu barang, sedangkan stoknya terbatas, harga biasanya naik.</li>
          <li><b>Biaya produksi naik:</b> Harga bahan baku, transportasi, atau energi naik, sehingga produsen menaikkan harga jual.</li>
          <li><b>Kebijakan moneter:</b> Ketika pemerintah atau bank sentral mencetak lebih banyak uang, nilai mata uang bisa melemah, memicu kenaikan harga.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-2">Apakah Inflasi Selalu Buruk?</h3>
        <p className="mb-4">Tidak selalu. Inflasi dalam level wajar sebenarnya menunjukkan ekonomi yang tumbuh. Tapi kalau inflasi terlalu tinggi (hyperinflasi) atau terlalu rendah (deflasi), keduanya bisa berdampak buruk ke daya beli, tabungan, hingga kestabilan ekonomi.</p>
        <p className="mb-4">Itulah kenapa penting untuk memahami inflasi — supaya kita bisa membuat keputusan keuangan yang lebih bijak, seperti menabung, berinvestasi, atau merencanakan pembelian besar di masa depan.</p>
      </>
    ),
  },
  {
    id: 2,
    title: "Strategi Investasi Menghadapi Inflasi",
    excerpt: "Tips dan strategi untuk melindungi aset Anda dari dampak inflasi melalui investasi yang tepat.",
    category: "Investasi",
    readTime: "7 menit",
  },
  {
    id: 3,
    title: "Mengelola Keuangan di Tengah Inflasi Tinggi",
    excerpt: "Panduan praktis untuk mengelola keuangan pribadi saat tingkat inflasi sedang tinggi.",
    category: "Manajemen Keuangan",
    readTime: "6 menit",
  },
];


export default function Articles() {
  const { id } = useParams();
  const selectedArticle = id ? articles.find((a) => a.id === Number(id)) : null;

  if (selectedArticle && selectedArticle.content) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/articles" className="text-purple-600 hover:underline mb-4 inline-block">← Kembali ke daftar artikel</Link>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded">
              {selectedArticle.category}
            </span>
            <span className="text-gray-500 text-sm">{selectedArticle.readTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-purple-600">{selectedArticle.title}</h1>
          <div className="prose prose-lg max-w-none text-gray-800">
            {selectedArticle.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Artikel Edukasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded">
                  {article.category}
                </span>
                <span className="text-gray-500 text-sm">{article.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Link
                to={`/articles/${article.id}`}
                className="inline-flex items-center text-purple-600 hover:text-purple-700"
              >
                Baca selengkapnya →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
