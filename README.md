# Event Booking & Event Management App

A full event booking and service management mobile app built with **React Native (Expo)** and **Firebase**.  
This app lets users view event services, book a service, and receive instant confirmation, while admins manage bookings through a simple panel.

---

## 📌 Features

- Browse event services with clean UI and hero images.  
- Book a service by filling a form (guests, venue, phone, special requirements).  
- Real‑time booking stored in **Firebase Firestore** (`bookings` collection).  
- `progress: "pending"` status for new bookings; admin panel approves/rejects.  
- Responsive modal form with keyboard behavior and validation.  
- Success confirmation popup after booking.  
- User‑based booking flow:  
  - If user is logged in → opens booking modal.  
  - If user is logged out → redirects to `/login` route.

---

## 📱 Screens

1. **Login & Register Screens**
   - Standard email‑based login and registration using Firebase Auth.  
   - After successful login, user is redirected to the main event listing / service list.  
   - Only logged‑in users can:  
     - Submit a booking.  
     - Submit or update a rating.

2. **Event / Service Listing Screen**
   - Grid or list of event services with thumbnails, titles, and starting prices.  
   - Each item has a “View Details” button that opens the Service Details screen.

3. **Service Details Screen**
   - Hero image, service name, price, and detailed description.  
   - “Book this Service” button:  
     - If user is logged in → opens a booking modal.  
     - If user is not logged in → redirects to the `/login` route.  
   - Optional **Rating card** that shows average rating and total counts (only visible if at least one rating exists).

4. **Booking Modal**
   - Auto‑filled service details (name, price, booked‑by).  
   - Form fields:  
     - Number of guests.  
     - Event location.  
     - Phone number.  
     - Special requirements.  
   - Status info section: booking starts as `Pending` — representative will contact you.  
   - On submit: data is sent to Firestore `bookings` collection with status `pending` and real‑time confirmation.

5. **Success / Confirmation Popup**
   - Displays after a successful booking.  
   - Text: “Booking received — our representative will contact you shortly.”  
   - Simple “Done” button to close the popup.

6. **Rating / Review Screen (if user is logged in)**
   - Users can rate services on a 5‑star scale (including half‑stars).  
   - Each user can submit **only one rating**, which can be updated later.  
   - If the user is not logged in, the rating form is hidden and the app shows a “Login to rate” prompt that redirects to the `/login` route.

---

## 📦 Usage

1. Clone this repo:
   ```bash
   git clone https://github.com/khadizajarin/eveplano
   cd your-event-booking-app
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Add your Firebase config in `app/hooks/firebase.config.ts`.

4. Run the app:
   ```bash
   npx expo start
   ```

---

## 📲 APK / Demo

Download APK or view demo:

🔗 **APK file / Demo link**:  
👉 [https://your-demo-link-or-apk-url.com](https://your-demo-link-or-apk-url.com)


---

## 🎯 Why This Project?

This app demonstrates a **production‑like event booking flow** covering:
- Service listing → service detail → booking → confirmation.  
- Authentication‑aware routing (`/login` redirect if not logged in).  
- Clean UI, reusable components, and real‑time Firestore data.

Perfect for portfolio or as a starting point for a full event management system.