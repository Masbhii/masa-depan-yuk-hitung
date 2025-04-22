
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "Memahami Inflasi dan Dampaknya",
    excerpt: "Pelajari apa itu inflasi, bagaimana cara kerjanya, dan mengapa penting untuk dipahami.",
    category: "Dasar Inflasi",
    readTime: "5 menit",
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
