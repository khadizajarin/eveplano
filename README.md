# 🎉 EvePlano – Event Booking & Event Management App

A full event booking and service management mobile app built with **React Native (Expo)** and **Firebase**, designed to let users browse, book, rate, comment, and interact with event services in real time, while admins manage everything through a simple panel.

---

## 🔧 Primary Technologies

- 📱 **React Native (Expo)** – Mobile app UI and navigation  
- ☁️ **Firebase**:  
  - Auth (email, password, session)  
  - Firestore (real‑time data: bookings, ratings, comments, users, services, etc.)  
- 📊 Database‑driven web features (dummy backend / Node.js mock for web demos)  
- 🎞️ **YouTube / External media** – Embedded video previews   
- 💻 **Git + modern workflow tools** (Git, Webpack, ESLint, etc.)

---

## 📌 Core Features

- Browse event services with **clean UI, hero images, and pagination**.  
- Book a service with instant real‑time confirmation stored in **Firebase Firestore** (`bookings` collection).  
- Admin panel to **manage bookings, users, and services**.  
- Responsive **modal booking form** with validation and keyboard behavior.  
- **Real‑time commenting** on posts/services without page refresh (like Facebook).  
- **Like / dislike buttons with count** for each service or post (like Facebook).  
- **Real‑time unique username verification** against your own database (no reload).  
- **Multiple text boxes and multiple dropdown lists** for event setup, location, country, division, city, etc.  
- Interactive **real‑time rating system** for each service.  
- **Pagination on services** list (infinite / page‑based loading, depending on implementation).  
- **Embedded YouTube videos** and external media (not hosted on your own server).  
- **Image / file uploading** and display in the app (profile photos, service thumbnails, etc.).  

---

## 📱 Screens & User Flow

### 1. **Login & Register Screens**

- Email‑based login/register using **Firebase Auth**.  
- After successful login:  
  - User is redirected to the **event / service list**.  
- Only logged‑in users can:  
  - Submit or update **bookings**.  
  - Add / update **ratings and reviews**.  
  - Add / edit **comments** under services or posts.  
- Login state is stored in **Firebase session and local state**.

---

### 2. **Event / Service Listing Screen**

- Grid or list of **event services** with thumbnails, title, price, and “Rating stars”.  
- Supports **pagination** for large catalogs.  
- Each item clicks into the **Service Details screen**.  

---

### 3. **Service Details Screen**

- Hero image, service name, pricing, short description.  
- “Book this Service” button:  
  - If user is logged in → opens **Booking Modal**.  
  - Otherwise → redirect to `/login`.  
- **Rating card** showing:  
  - Average rating (e.g., 4.7★).  
  - Total rating count.  
- **Comment section** with real‑time comments (no page reload, like Facebook).  
- **Like / Dislike buttons** with live counts.  
- **Interactive rating widget** for logged‑in user to rate this service.  
- **Embedded media** (YouTube / external video) related to the service.  
- **Map / location** view (embedded Google Maps).

---

### 4. **Service Booking / Form Modal**

- Auto‑filled service details:  
  - Name, price, organizer name, etc.  
- Form fields:  
  - Number of guests.  
  - Event location (country, division, city – via multi‑dropdown).  
  - Phone number, special requirements.  
- Status text:  
  - Booking created as `Progress: "pending"` in Firestore.  
- On submit:  
  - Data sent to Firestore (`bookings` collection) → real‑time status update.  
- Success popup on completion.

---

### 5. **Success / Confirmation Popup**

- Shows after successful booking:  
  - “Booking received — our representative will contact you shortly.”  
- Simple “Done” button to close.  

---

### 6. **Rating & Review System**

- Users rate services on a **5‑star scale** (including half‑stars).  
- Each user can submit **only one rating per service**, which can be updated.  
- Logged‑in requirement:  
  - If not logged in → “Login to rate” prompt with redirect to `/login`.  
- Rating counts and average calculated from database and updated in real time.

---

### 7. **Commenting / Like & Dislike Features**

- Real‑time **commenting** (like Facebook):  
  - Comment added → Firestore updates → UI updates without page reload.  
- **Like / Dislike** buttons with count shown next to each service / post.  
- Counts stored in **Firestore** and updated in real time.

---

### 8. **Admin Management Panel**

- **Admin Users** list with role (`admin` / `user` / `deleted`).  
- Admin‑only management of:  
  - **Bookings** (approve / reject, change status).  
  - **Users** (promote, block, delete).  
  - **Services** (create, edit, deactivate).  
- Admin‑only **CSV export** for users or bookings (optional / mock / node‑based in docs).

---

### 9. **File / Image Upload & Display**

- Users can upload **profile pictures** and **documents**.  
- Uploaded images displayed inside the app in:  
  - Profile screen.  
  - Admin panel.  
- Files stored in **Firebase Storage** and paths referenced in Firestore.

---

## 📦 Usage (How to Run)

1. Clone this repo:

```bash
git clone https://github.com/khadizajarin/eveplano
cd eveplano
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Add your **Firebase config** in:

```bash
app/hooks/firebase.config.ts
```

4. Run the app:

```bash
npx expo start
```

5. (Optional) For **web**:

```bash
npm run web
# or
npx expo start --web
```

---

## 📲 Live Demo / APK (Placeholder)

🔗 **APK file / Demo link**:  
👉 [https://drive.google.com/file/d/18WyjgGPqT1HvU4XONWgOq0IGxZSkCt8v/view?usp=drive_link](https://drive.google.com/file/d/18WyjgGPqT1HvU4XONWgOq0IGxZSkCt8v/view?usp=drive_link)


---

## 🎯 Why This Project?

EvePlano demonstrates a **production‑ready event booking system** covering:

- Service listing → detail view → real‑time booking → admin panel.  
- **Authentication‑aware routing** (only logged‑in users can book / rate / comment).  
- **Real‑time commenting, likes, ratings, and user verification** without page reload.  
- **Modern mobile UI** with reusable components, clean typography, and responsive layout.  

This app is ideal as:
- 🎓 **Final project / thesis app**  
- 📂 **Portfolio project** to showcase Firestore, authentication, real‑time data, maps, and TensorFlow Lite  
- ▶️ **Starting point** for a full event / booking / service management system.

---

If you like it, **Star this repo** ⭐ and share with teammates!  