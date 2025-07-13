# 📖 Sparky's Logistics Website - LIVE DOC

This is the **working document** for Sparky’s Logistics site. Update it as features are added or requirements change.

---

## 🎯 Goals
- ✅ Provide customers with **dynamic quotes** based on distance and market rate per mile.
- ✅ Allow Jeff (owner) to **manually update rates** and manage leads via an admin dashboard.
- ✅ Build a clean, professional site to attract brokers and direct shippers.
- ✅ Enforce a **pickup radius** around the home base.
- 🟡 Allow customers to **select a pickup/dropoff time** when submitting a quote. *(In Progress)*
- 🟡 Allow Jeff (admin) to **set a calendar of availability** for pickup/dropoff scheduling.
- 🟡 Send Jeff **notifications via the app, text, and email** for new leads.

---

## 🛠 Inputs & Expected Outputs

### Inputs
- **Pickup Location** (Google Places Autocomplete) ✅
- **Dropoff Location** (Google Places Autocomplete) ✅
- **Pickup/Dropoff Time Selection** 🟡 *(Planned)*
- **Optional (Future):**
  - Load Size (Small Box Truck, Large Box Truck)
  - Is Liftgate Required? (Checkbox)
  - Notes to Driver

### Outputs
- ✅ Distance (in miles)
- ✅ Rate per mile (manual entry in Admin Panel)
- ✅ Total Estimated Cost
- ✅ Optional Map Preview
- 🟡 Confirmation of pickup/dropoff time in customer quote.

---

## 🧩 Components

### 1. `QuoteForm.tsx` ✅
- Parent container for quote inputs.
- Shows **distance**, **price**, and a **lead submission form**.

### 2. `LocationInput.tsx` ✅
- Google Places Autocomplete for pickup & dropoff.

### 3. `QuoteResult.tsx` ✅
- Shows calculated distance and estimated cost.

### 4. `MapPreview.tsx` ✅
- Shows route map (future: optional for MVP).

### 5. `AdminPage.tsx` ✅
- Update rate per mile.
- View/manage leads (mark as contacted).
- Set home base location & enforce pickup radius.
- 🟡 Manage availability calendar for pickups/dropoffs.

---

## 🔐 Admin Features

- [x] Firebase Authentication with Google Sign-In.
- [x] Role-based access for Jeff (admin only).
- [x] Update market rate per mile.
- [x] Real-time Firestore listener for leads.
- [x] Mark leads as "Contacted" (with UI filter).
- [x] Set home base & enforce pickup radius.
- 🟡 Notifications: Send new lead alerts via app, text, and email.
- 🟡 Calendar management: Set availability for pickups/dropoffs.

---

## 🚧 Next Steps
### 📝 Short-Term
- [ ] Add time selection to quote form.
- [ ] Build admin availability calendar.
- [ ] Configure notification system (Firebase Cloud Messaging, Twilio for SMS, email via SendGrid or Firebase).
- [ ] Add “About” and “Contact” pages.
- [ ] Add footer navigation across pages.
- [ ] Test enforce radius logic thoroughly.
- [ ] Mobile UI testing and polish.

---

## 📦 Eventually
- [ ] Get LLC info and integrate with Termly for **Terms & Conditions** and Privacy Policy.
- [ ] Add a customer dashboard for repeat users.
- [ ] Fetch live market rates from **123LoadBoard**, **Cargo Chief**, or **GreenScreens** (manual now).
- [ ] Offer load booking directly via the site.
- [ ] Enable payment processing for booking confirmation.

---

## 📅 Build Progress
| Phase                  | Status      | Notes                                 |
|------------------------|-------------|----------------------------------------|
| Core Infrastructure    | ✅ Complete | React, Vite, Firebase setup.          |
| Core Features          | 🟡 In Progress | Quote tool live, admin panel working.|
| Content & Pages        | 🟠 Pending  | About & Contact pages not yet built.  |
| Notifications          | 🟠 Pending  | App, text, and email notifications.   |
| Calendar Availability  | 🟠 Pending  | Admin calendar management.            |
| Testing & Deployment   | 🟠 Pending  | Needs mobile/responsive testing.      |
| Custom Domain Setup    | 🟠 Pending  | To be connected via Firebase Hosting. |

---

## ✍️ Editing Instructions
- Edit this file directly in your code editor (VSCode) or GitHub.  
- If shared as a Google Doc, update in real time and notify Clinton when changes are made.
