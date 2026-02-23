# VibeZee Backend — Setup Guide

## 📁 Folder Structure

```
vibezee/
├── frontend/              ← HTML/CSS/JS files တွေ ဒီမှာ
│   ├── index.html
│   ├── shop.html
│   ├── cart.html
│   ├── login.html
│   ├── admin.html
│   ├── manifest.json
│   ├── css/
│   ├── js/
│   └── img/
└── backend/               ← Node.js server ဒီမှာ
    ├── server.js
    ├── .env
    ├── package.json
    ├── config/
    │   ├── db.js
    │   └── telegram.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    ├── middleware/
    │   └── authMiddleware.js
    └── routes/
        ├── auth.js
        ├── products.js
        ├── orders.js
        └── admin.js
```

---

## ⚙️ Setup Steps

### 1. Node.js & MongoDB Install
```bash
# Node.js — https://nodejs.org မှ download
# MongoDB — https://www.mongodb.com/try/download/community မှ download
```

### 2. Backend folder ထဲ ဝင်ပြီး packages install
```bash
cd backend
npm install
```

### 3. .env ဖိုင် ပြင်ဆင်
```env
MONGO_URI=mongodb://localhost:27017/vibezee
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@vibezee.com
ADMIN_PASSWORD=your_strong_password
TELEGRAM_BOT_TOKEN=xxxxxx:xxxxxxxxx
TELEGRAM_GROUP_ID=-100xxxxxxxxx
KBZPAY_NUMBER=09xxxxxxxxx
WAVEPAY_NUMBER=09xxxxxxxxx
```

---

## 📱 Telegram Bot Setup

### Step 1 — Bot တည်ဆောက်ပါ
1. Telegram မှာ `@BotFather` ကို message ပို့ပါ
2. `/newbot` ဆိုပြီး ရိုက်ပါ
3. Bot name (e.g. `VibeZee Shop`) ထည့်ပါ
4. Username (e.g. `vibezee_shop_bot`) ထည့်ပါ
5. Bot token ရလာမယ် — `.env` ထဲ `TELEGRAM_BOT_TOKEN` မှာ ထည့်ပါ

### Step 2 — Group ID ရယူပါ
1. Telegram Group တစ်ခု ဆောက်ပါ (Public Group ဖြစ်ရမည်)
2. Bot ကို Group ထဲ admin အဖြစ် ထည့်ပါ
3. Browser မှာ `https://api.telegram.org/bot<TOKEN>/getUpdates` ဖွင့်ပါ
4. Group ID ကို `chat.id` field မှာ တွေ့ရမည် (e.g. `-1001234567890`)
5. `.env` ထဲ `TELEGRAM_GROUP_ID` မှာ ထည့်ပါ

---

## 🚀 Run Server

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server ပြင်ဆင်ပြီးရင် `http://localhost:5000` မှာ ဝင်ကြည့်ပါ။

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description          | Auth     |
|--------|-----------------------------|----------------------|----------|
| POST   | /api/auth/register          | Customer Register    | Public   |
| POST   | /api/auth/login             | Customer Login       | Public   |
| POST   | /api/auth/admin-login       | Admin Login          | Public   |
| GET    | /api/auth/me                | Get current user     | Customer |
| GET    | /api/products               | Get all products     | Public   |
| POST   | /api/products               | Add product          | Admin    |
| PUT    | /api/products/:id           | Update product       | Admin    |
| DELETE | /api/products/:id           | Delete product       | Admin    |
| POST   | /api/orders                 | Place order + Telegram | Public |
| GET    | /api/orders                 | Get all orders       | Admin    |
| PUT    | /api/orders/:id/status      | Update order status  | Admin    |
| GET    | /api/orders/stats/summary   | Sales stats          | Admin    |
| GET    | /api/admin/dashboard        | Dashboard stats      | Admin    |
| GET    | /api/admin/users            | All users            | Admin    |

---

## 🔑 Admin Login

Default credentials (`.env` မှာ ပြောင်းနိုင်သည်):
- Email: `admin@vibezee.com`
- Password: `vibezee@2025`

**⚠️ Deploy မတင်မီ password ကို ပြောင်းပါ!**
