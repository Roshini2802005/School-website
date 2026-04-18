# 🌅 ABC School Website

A complete, full-stack school website with an admission enquiry form, admin dashboard, and MongoDB backend.

---

## 📁 Project Structure

```
school-website/
├── frontend/
│   ├── index.html          ← Main website (all sections)
│   ├── admin.html          ← Admin dashboard to view enquiries
│   ├── css/
│   │   └── style.css       ← Full stylesheet
│   └── js/
│       └── main.js         ← Navbar, slider, form, animations
│
├── backend/
│   ├── server.js           ← Express server entry point
│   ├── package.json
│   ├── .env.example        ← Environment variable template
│   ├── config/
│   │   └── db.js           ← MongoDB connection
│   ├── models/
│   │   └── Enquiry.js      ← Mongoose schema
│   └── routes/
│       └── enquiry.js      ← POST/GET/PATCH /api/enquiry
│
└── package.json
```

---

## 🚀 How to Run

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

### Step 1 — Install dependencies

```bash
cd school-website/backend
npm install
```

---

### Step 2 — Configure environment

```bash
# In backend/ folder
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/school_website
PORT=5000

# Optional — for email notifications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourschool.com
```

> **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string.

---

### Step 3 — Start the server

```bash
# Development (auto-restart on change)
npm run dev

# OR Production
npm start
```

Server starts at: **http://localhost:5000**

---

### Step 4 — Open the website

| Page | URL |
|------|-----|
| 🏫 Main Website | http://localhost:5000 |
| 📋 Admin Dashboard | http://localhost:5000/admin.html |
| 🔌 API Health | http://localhost:5000/api/health |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enquiry` | Submit new enquiry |
| GET | `/api/enquiry` | Get all enquiries (admin) |
| PATCH | `/api/enquiry/:id` | Update enquiry status |

### POST `/api/enquiry` — Request Body

```json
{
  "studentName": "Arjun Sharma",
  "parentName": "Rajesh Sharma",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "classApplying": "Class 6",
  "message": "Optional message here"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Enquiry submitted successfully! We will contact you soon.",
  "data": { "id": "..." }
}
```

---

## ✉️ Email Notifications (Optional)

The backend sends two emails on each enquiry:
1. **Admin notification** — full enquiry details
2. **Parent confirmation** — thank-you email to the parent

To enable, add Gmail credentials to `.env`. For Gmail, use an **App Password** (not your main password):
1. Enable 2-Step Verification on your Google account
2. Go to: Google Account → Security → App Passwords
3. Generate a password for "Mail" and paste it as `EMAIL_PASS`

---

## 🎨 Customisation

| What to change | Where |
|----------------|-------|
| School name, tagline | `frontend/index.html` (hero section) |
| Colours (navy, gold) | `frontend/css/style.css` `:root` variables |
| Contact details | `frontend/index.html` (contact section & footer) |
| Google Maps location | `frontend/index.html` (iframe `src`) |
| Admission dates | `frontend/index.html` (dates-card) |
| Courses offered | `frontend/index.html` (academics section) |

---

## 🌐 Deploying to Production

**Option A — Railway / Render / Fly.io:**
1. Push the repo to GitHub
2. Connect to Railway/Render
3. Set environment variables in the platform dashboard
4. Deploy!

**Option B — VPS (Ubuntu):**
```bash
npm install -g pm2
pm2 start backend/server.js --name school-website
pm2 save && pm2 startup
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Email | Nodemailer (optional) |

---

Made with ❤️ for ABC School
