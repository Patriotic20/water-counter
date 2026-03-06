# AquaTrack - Suv Hisoblagich Tizimi

Ushbu loyiha ESP32 qurilmalari orqali suv sarfini hisoblash va uni boshqaruv panelida ko'rsatishga mo'ljallangan.

Loyiha ikki qismdan iborat:
- **Backend (API)**: Python (FastAPI), PostgreSQL ma'lumotlar bazasi va `uv` paket menejeri yordamida yozilgan.
- **Frontend (Web UI)**: React (Vite) va TailwindCSS orqali yaratilgan.

---

## 🚀 Eng Oson Ishga Tushirish (Docker yordamida)

Agar kompyuteringizda Docker o'rnatilgan bo'lsa, butun loyihani (barcha qismlarini) birdaniga quyidagi buyruq orqali ishga tushirishingiz mumkin:

```bash
docker compose up -d
```
> Bu barcha containerlarni internetdan tortib oladi, bazani ko'taradi, va dasturni ishga tushiradi.

---

## 🛠 Dasturchilar Uchun Dasturlarni Alohida Ishga Tushirish (Development Mode)

Agar siz loyiha kodlariga o'zgartirish kiritmoqchi bo'lsangiz, har bir qismni alohida terminalda ishga tushirganingiz ma'qul.

### 1-qadam: Ma'lumotlar Bazasini Ko'tarish (Linux & Windows)

Dastur requires PostgreSQL bazasi. O'rnatish o'rniga, quyidagi kod yordamida faqatgina bazasini Dockerdan ishga tushiring:
```bash
docker compose up db -d
```
*(Bazada `water_counter` degan ma'lumotlar ombori xosil qilinadi).*

### 2-qadam: Backend (API) ni Ishga Tushirish

Backend ishlashi uchun **Python (3.12+)** va **[uv](https://docs.astral.sh/uv/)** o'rnatilgan bo'lishi kerak.

**Linux va macOS uchun:**
```bash
cd backend
# Kerakli modullarni o'rnatish
uv sync
# Serverni ishga tushirish (qayta yuklanish rejimi bilan)
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Windows uchun:**
Terminalda xuddi shu buyruqlarni yozasiz:
```cmd
cd backend
:: Kerakli modullarni o'rnatish
uv sync
:: Serverni ishga tushirish
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*(Server ishga tushgach, hujjatlarni ko'rish uchun `http://localhost:8000/docs` ga kiring).*

> **Eslatma:** Ma'lumotlar bazasi jadvallari (tables) server ilk marotaba bo'sh bo'lganda avtomatik tarzda yaratiladi.

---

### 3-qadam: Frontend (Web) ni Ishga Tushirish

Frontend ishlashi uchun kompyuteringizda **Node.js** (v20+) o'rnatilgan bo'lishi kerak. 

**Windows va Linux uchun buyruqlar bir xil:**
```bash
cd frontend
# Kutubxonalarni o'rnatish
npm install
# Veb serverni ishga tushirish
npm run dev
```

Buyruq muvaffaqiyatli yakunlangach, terminal sizga veb sahifaning manzilini ko'rsatadi (masalan: `http://localhost:5173`). O'sha manzilga brauzer orqali kiring.
