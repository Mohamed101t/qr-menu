# QR Menu

منصة قوائم وطلبات عبر QR للمطاعم والمقاهي ومحلات العصائر.

## الفكرة الأساسية

QR ثابت لكل نشاط تجاري.

مسار العميل:

QR
→ القائمة مباشرة
→ اختيار المنتجات
→ السلة
→ تأكيد الطلب

## Current Status

تم تنفيذ واختبار:

- Restaurant template
- Menu categories and products
- Cart add/increase/decrease/remove
- Local order creation
- Empty cart protection

Backend وقاعدة البيانات لم يتم تنفيذهما بعد.

## Tech Stack

- React
- TypeScript
- Vite

## Development

Install dependencies:

npm install

Run development server:

npm run dev

Production build:

npm run build

## Architecture

src/
- app
- core
- shared
- features/
  - restaurant
  - menu
  - cart
  - orders
  - upsell
  - analytics
  - admin

Business logic يجب أن يبقى منفصلًا عن Presentation قدر الإمكان.
