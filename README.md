# RTK Query Blog Uygulaması

Modern ve kullanıcı dostu bir blog yönetim sistemi. Redux Toolkit Query, Next.js ve TailwindCSS kullanılarak geliştirilmiştir.

![RTK Query Blog](./preview.png)

## 🚀 Özellikler

- ✨ Modern ve responsive tasarım
- 📱 Mobil uyumlu arayüz
- 📝 Blog gönderisi oluşturma, düzenleme ve silme
- 🔄 Sayfalama sistemi (her sayfada 10 gönderi)
- ⚡ Optimistic Updates ile anlık UI güncellemeleri
- 🎯 RTK Query ile etkin state yönetimi
- 🎨 TailwindCSS ile modern görünüm

## 🛠️ Teknolojiler

- [Next.js](https://nextjs.org/) - React framework
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) - Veri yönetimi
- [TailwindCSS](https://tailwindcss.com/) - Stil ve tasarım
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği

### Blog Gönderisi Oluşturma

- Ana sayfadaki form aracılığıyla yeni blog gönderisi oluşturabilirsiniz
- Başlık ve içerik alanlarını doldurmanız yeterli
- Gönderi otomatik olarak listenin en başına eklenecektir

### Gönderileri Görüntüleme

- Ana sayfada tüm gönderiler listelenir
- Her sayfada 10 gönderi gösterilir
- Sayfalama kontrolleri ile gönderiler arasında gezinebilirsiniz

### Gönderi Düzenleme ve Silme

- Her gönderinin detay sayfasında düzenleme yapabilirsiniz
- Silme işlemi hem ana sayfadan hem de detay sayfasından yapılabilir
- Tüm değişiklikler anlık olarak UI'da görüntülenir

## 📝 Proje Yapısı

\`\`\`
rtk-query-blog/
├── app/
│ ├── posts/ # Post detay sayfaları
│ ├── store/ # Redux store ve RTK Query servisleri
│ ├── layout.tsx # Ana sayfa düzeni
│ └── page.tsx # Ana sayfa
├── public/ # Statik dosyalar
├── styles/ # Global stiller
├── package.json # Proje bağımlılıkları
└── README.md # Proje dokümantasyonu
\`\`\`
