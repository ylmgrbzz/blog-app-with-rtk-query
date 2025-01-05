# RTK Query Blog Uygulaması

Bu proje, Next.js 13+ App Router, RTK Query ve MongoDB kullanılarak geliştirilmiş modern bir blog uygulamasıdır.

## Özellikler

- 📝 Blog gönderilerini görüntüleme, oluşturma, düzenleme ve silme
- 🔄 RTK Query ile otomatik önbellek yönetimi ve optimistik güncellemeler
- 📱 Responsive tasarım
- 🎨 Tailwind CSS ile modern UI
- 🗄️ MongoDB veritabanı entegrasyonu
- 🚀 Next.js 13+ App Router ile gelişmiş performans
- 🔍 Sayfalama desteği
- 🗑️ Soft delete özelliği (Silinen gönderiler veritabanından silinmez, sadece gizlenir)

## Teknolojiler

- [Next.js 13+](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Başlangıç

1. Projeyi klonlayın:
   \`\`\`bash
   git clone [repo-url]
   cd rtk-query-blog
   \`\`\`

2. Bağımlılıkları yükleyin:
   \`\`\`bash
   npm install
   \`\`\`

3. `.env.local` dosyası oluşturun ve MongoDB bağlantı bilgilerinizi ekleyin:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   \`\`\`

4. Geliştirme sunucusunu başlatın:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

\`\`\`
rtk-query-blog/
├── app/
│ ├── api/ # API route'ları
│ ├── components/ # Paylaşılan bileşenler
│ ├── models/ # Mongoose modelleri
│ ├── posts/ # Post sayfaları
│ ├── store/ # Redux store ve RTK Query servisleri
│ ├── utils/ # Yardımcı fonksiyonlar
│ ├── layout.tsx # Root layout
│ └── page.tsx # Ana sayfa
├── public/ # Statik dosyalar
├── styles/ # Global stiller
├── .env.local # Ortam değişkenleri
└── package.json
\`\`\`

## API Endpoints

- `GET /api/posts` - Tüm aktif gönderileri getir (sayfalama destekli)
- `GET /api/posts/:id` - Belirli bir gönderiyi getir
- `POST /api/posts` - Yeni gönderi oluştur
- `PATCH /api/posts/:id` - Gönderiyi güncelle
- `DELETE /api/posts/:id` - Gönderiyi soft delete ile gizle
