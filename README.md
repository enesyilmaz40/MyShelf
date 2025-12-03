# MyShelf

Modern, full-stack dijital koleksiyon yönetim uygulaması. Kitaplarınızı, filmlerinizi ve daha fazlasını organize edin, raflarınızı yönetin ve ilerlemenizi takip edin.

## 🏗️ Mimari

**Clean Architecture** (Onion Architecture) prensiplerine göre tasarlanmıştır:

- **Domain Layer**: Core business entities ve interfaces
- **Application Layer**: DTOs ve business logic
- **Infrastructure Layer**: Data access, repositories, ve external services
- **API Layer**: REST API endpoints ve middleware

## 🛠️ Teknolojiler

### Backend
- **.NET 9** - Web API
- **Entity Framework Core 9** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API Documentation

### Frontend (Yakında)
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **TailwindCSS** - Styling

## 📋 Özellikler

### ✅ Tamamlanan
- [x] JWT Authentication (Register, Login, Refresh Token, Logout)
- [x] Kitap Yönetimi (CRUD, Arama, Filtreleme)
- [x] Raf Organizasyonu (CRUD, Kapasite Yönetimi)
- [x] Kategori Sistemi
- [x] Okuma İlerlemesi Takibi
- [x] PostgreSQL Database
- [x] Clean Architecture
- [x] Repository Pattern
- [x] Unit of Work Pattern

### 🚧 Devam Eden
- [ ] React Frontend
- [ ] Drag & Drop Kitap Yerleştirme
- [ ] Kitap Kapağı Upload
- [ ] ISBN Lookup Entegrasyonu
- [ ] Dashboard ve İstatistikler

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- .NET 9 SDK
- PostgreSQL
- Node.js 18+ (Frontend için)

### Backend Kurulum

1. **PostgreSQL Database Oluşturma**
```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Kullanıcı ve database oluşturun
CREATE USER library_user WITH PASSWORD 'library123';
ALTER USER library_user CREATEDB;
CREATE DATABASE library_app OWNER library_user;
GRANT ALL PRIVILEGES ON DATABASE library_app TO library_user;
\q
```

2. **Backend Çalıştırma**
```bash
# Proje dizinine gidin
cd library

# Restore packages
dotnet restore

# Database migration (zaten yapıldı)
dotnet ef database update --project src/LibraryApp.Infrastructure --startup-project src/LibraryApp.API

# API'yi çalıştırın
dotnet run --project src/LibraryApp.API
```

API şu adreste çalışacak: **http://localhost:5006**

Swagger UI: **http://localhost:5006/swagger**

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/refresh` - Token yenile
- `POST /api/auth/logout` - Çıkış yap
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Books
- `GET /api/books` - Tüm kitapları listele (arama ve filtreleme)
- `GET /api/books/{id}` - Kitap detayı
- `POST /api/books` - Yeni kitap ekle
- `PUT /api/books/{id}` - Kitap güncelle
- `DELETE /api/books/{id}` - Kitap sil

### Shelves
- `GET /api/shelves` - Tüm rafları listele
- `GET /api/shelves/{id}` - Raf detayı (kitaplarla birlikte)
- `POST /api/shelves` - Yeni raf oluştur
- `PUT /api/shelves/{id}` - Raf güncelle
- `DELETE /api/shelves/{id}` - Raf sil

## 🔐 Authentication

API JWT token kullanır. İşleyiş:

1. `/api/auth/register` veya `/api/auth/login` ile giriş yapın
2. Response'da `accessToken` ve `refreshToken` alacaksınız
3. Korumalı endpoint'lere istek yaparken header'a ekleyin:
   ```
   Authorization: Bearer {accessToken}
   ```
4. Access token süresi dolduğunda `/api/auth/refresh` ile yenileyin

## 📊 Database Schema

### Users
- Kullanıcı bilgileri ve authentication

### Books
- Kitap detayları (başlık, yazar, ISBN, yayınevi, vb.)
- Raf ilişkisi ve pozisyon
- Durum (Sahip olunan, İstek Listesi, Ödünç Alınan, Ödünç Verilen)

### Shelves
- Raf bilgileri (isim, konum, sıra, kapasite)
- Renk kodlama

### Categories
- Kitap kategorileri
- Many-to-Many ilişki

### ReadingProgress
- Okuma durumu ve ilerleme
- Sayfa takibi
- Değerlendirme ve notlar

## 🧪 Test

### Swagger ile Test
1. http://localhost:5006/swagger adresine gidin
2. `/api/auth/register` ile yeni kullanıcı oluşturun
3. `/api/auth/login` ile giriş yapın
4. Dönen `accessToken`'ı kopyalayın
5. Sağ üstteki "Authorize" butonuna tıklayın
6. `Bearer {token}` formatında token'ı girin
7. Diğer endpoint'leri test edin

### Örnek Register Request
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "Ahmet",
  "lastName": "Yılmaz"
}
```

### Örnek Book Create Request
```json
{
  "title": "1984",
  "author": "George Orwell",
  "isbn": "9780451524935",
  "publisher": "Signet Classic",
  "publicationYear": 1949,
  "pageCount": 328,
  "language": "Turkish",
  "description": "Distopik bir klasik",
  "status": 1,
  "categoryIds": []
}
```

## 📁 Proje Yapısı

```
library/
├── src/
│   ├── LibraryApp.Domain/          # Entities, Enums, Interfaces
│   ├── LibraryApp.Application/     # DTOs
│   ├── LibraryApp.Infrastructure/  # DbContext, Repositories, Services
│   └── LibraryApp.API/             # Controllers, Program.cs
└── LibraryApp.sln
```

## 🔧 Yapılandırma

`appsettings.json` dosyasında:
- Database connection string
- JWT secret, issuer, audience
- Token expiration süreleri

## 🤝 Katkıda Bulunma

Bu proje şu anda geliştirme aşamasındadır. Frontend geliştirmesi devam etmektedir.

## 📝 Lisans

Bu proje kişisel kullanım içindir.

## 👨‍💻 Geliştirici

Enes - MyShelf Digital Koleksiyon Yöneticisi

---

**Not**: Frontend geliştirmesi için React + TypeScript + TailwindCSS kullanılacaktır. Yakında eklenecek!
