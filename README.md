
# 🔐 TrueAuth — Basic Authentication System

TrueAuth is a minimal authentication starter (Backend + React Frontend) that provides email OTP signup, password reset, Firebase Google sign-in, GitHub OAuth, and JWT-based sessions — focused only on authentication features.

---

## ✨ Features
- ✉️ Email signup with OTP verification
- 🔒 Password reset with OTP
- 🔁 Google Sign-In via Firebase + server-side user upsert
- 🐙 GitHub OAuth (passport-github2)
- 🔑 JWT-protected API endpoints
- 🔍 Live existence check for username / email
- ✅ Auto-login after password reset / OAuth sign-in

---

## 📁 Repo layout
- BACKEND/ — Express API, MongoDB models, auth routes
- FRONTEND/ — React (CRA), Firebase, auth UI

---

## 🛠️ Prerequisites
- Node.js v16+
- npm
- MongoDB Atlas (or MongoDB)
- Firebase project + web app
- GitHub OAuth app (optional)

---

## 🔐 Environment variables

BACKEND/.env (example):
- JWT_SECRET=your_jwt_secret
- MONGO_URI=your_mongo_uri
- PORT=5000
- USER=your_email_for_nodemailer
- PASS=email_app_password
- GITHUB_CLIENT_ID=...
- GITHUB_CLIENT_SECRET=...
- CALLBACKURL=https://your-backend.com/auth/github/callback
- B_URL=https://your-backend.com
- F_URL=https://your-frontend.com

FRONTEND/.env (REACT_APP_ prefix):
- REACT_APP_B_URL=https://your-backend.com/api/auth
- REACT_APP_API_KEY=...
- REACT_APP_AUTH_DOMAIN=...
- REACT_APP_PROJECT_ID=...
- REACT_APP_STORAGE_BUCKET=...
- REACT_APP_MESSAGING_SENDER_ID=...
- REACT_APP_APP_ID=...
- REACT_APP_MEASUREMENT_ID=...
- REACT_APP_GITHUB_CALLBACK=https://your-backend.com/auth/github/callback

Note: Restart React dev server after editing .env.

---

## ▶️ Run locally

Backend:
- cd BACKEND
- npm install
- npm run dev (or node server.js)

Frontend:
- cd FRONTEND
- npm install
- npm start
- Open http://localhost:3000

---

## 🔗 Key API endpoints
Base: {REACT_APP_B_URL || http://localhost:5000/api/auth}

- POST /verify — send OTP (body: { email, Mode })
- POST /check-otp — validate OTP (body: { email, otp })
- POST /signup — register (firstname, lastname, email, password, otp)
- POST /login — email/password
- POST /forgot — reset password (email, newPassword)
- POST /exist — check email/username ({ email } or { username })
- POST /google-signin — exchange Firebase/Google data for server JWT
- GET /me — protected user info (Authorization: Bearer <token>)
- GET /auth/github & /auth/github/callback — GitHub OAuth

---

## 🔄 Auth flows (summary)
- Signup: /verify → enter OTP + details → /signup → receive JWT  
- Forgot: /verify (Mode=false) → /check-otp → /forgot → receive JWT  
- Google: client signs in with Firebase → frontend posts to /google-signin → backend issues JWT  
- GitHub: server-side passport flow → callback redirects to frontend with token

---

## 🧰 Troubleshooting
- ❗ REACT_APP_... undefined: ensure FRONTEND/.env exists at FRONTEND root and restart CRA.  
- ❗ manifest.json shows "<!DOCTYPE html>": ensure public/manifest.json exists and is served as JSON.  
- ❗ OAuth not saving to DB: confirm App handles Firebase redirect (getRedirectResult) and posts to /google-signin.  
- Use browser Network tab + backend logs for failing requests.

---

## 🔒 Security notes
- Demo stores JWT in localStorage (convenient but XSS risk). For production prefer httpOnly, Secure cookies and refresh tokens.  
- Add rate limits for OTP endpoints and server-side throttling.  
- Use a strong JWT_SECRET and rotate keys as needed.

---

## ⚙️ Suggestions & Improvements
- Debounce live exist checks to reduce requests.  
- Add loading states for async ops (OTP send/check).  
- Migrate to httpOnly cookies and refresh-token flow for production.

---

## ❤️ Contributing
- Fork → feature branch → PR  
- Keep secrets out of commits

---

