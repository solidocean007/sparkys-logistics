# Sparky's Logistics Website

## Overview

This is a React + Vite single-page web application for a trucking/delivery business. The purpose of this site is to:

* Allow customers to get dynamic delivery quotes based on distance and current market rate per mile.
* Present the business professionally to attract more load opportunities.
* Allow the owner to update market rates manually through a simple admin interface.

## Example customers and their experience

### Example 1: Freight Broker - "Jake from BlueLine Freight Solutions"

* **Profile**: Jake is a freight broker coordinating dozens of loads per day for clients across multiple states. He uses load boards and has a list of reliable carriers for quick fulfillment.
* **Needs**: Jake wants to confirm availability and competitive pricing for short-haul and regional box truck moves. He doesn’t need a lot of hand-holding, just efficiency and accurate info.
* **Experience**: Jake bookmarks the quote page and inputs new loads quickly by pasting in pickup/dropoff locations. The rate shows instantly, and he submits contact info and job reference. Sparky’s team responds quickly, and Jake adds them to his preferred carrier list for light freight.

### Example 2: Distribution Center Manager - "Mike from Midwest Wholesale"

* **Profile**: Mike runs shipping at a regional warehouse. He uses outside trucks when internal capacity is full or for last-mile deliveries within 300 miles.
* **Needs**: Fast quoting, clear load size restrictions (box truck only), and confirmation that the driver won’t be responsible for loading/unloading.
* **Experience**: Mike uses the site on desktop. He inputs a shipment from his dock to a retail location. After seeing the quote, he sends it to his dispatch team and fills out a short form requesting service with a note: "No driver assist. Liftgate required."

### Example 3: Event Logistics Planner - "Tina with TopTier Exhibits"

* **Profile**: Tina coordinates booth setup for trade shows. Her job is to get event materials and displays from her company’s warehouse to venues on strict delivery windows.
* **Needs**: A clean experience with estimated delivery times, optional email confirmations, and confidence that freight won’t be mishandled.
* **Experience**: Tina uses the quote form a week in advance, sees the rate, and submits a request for a delivery from their regional staging warehouse to the convention center. She adds a comment that the venue requires a specific arrival location and time.

### Example 4: Independent Furniture Retailer - "Jorge from Carolina Rustic Living"

* **Profile**: Jorge owns a small showroom selling rustic and reclaimed furniture. He occasionally needs to ship a few large pieces to customers across state lines.
* **Needs**: A dependable carrier for irregular long-distance deliveries. Wants clarity on what handling is included and a mobile-friendly interface.
* **Experience**: Jorge visits the site on his phone, enters his store as the origin, and a customer’s house as the destination. The quote displays clearly, and he’s prompted to confirm whether the customer will help unload. Jorge submits the form and gets a follow-up call that afternoon.

---

## Features

### 1. Dynamic Pricing Tool

* Customer inputs pickup and dropoff locations.

* System calculates route mileage using Google Maps API.

* Cost is calculated using a manually updated market rate per mile.

* Right now on 123LoadBoard Jeff views these tools to determine where he wants to bid so that he can come in a little bit under the daily load rate.  He can enter this manually here but it would be better to derive this data to the site eventually.

  * marketRate is a tool that provides the average market rate to help compare lane rates before posting loads and better     estimate your load revenues
  * Cargo Chief shows market rate estimates baed on the highest, middle and lowest rtes gathered from actual freight bills rather than quoted prices

- greenscreens is a tool that shows both quotes and verified load

### 2. Google Maps Integration

* Location autocomplete fields
* Distance calculation using Directions and DistanceMatrix services

### 3. Pages / Sections

* **Landing Page**: Includes quote calculator and welcome text
* **About Page**: Describes the company and service areas
* **Contact Page**: Email/phone form
* **Admin Page** (optional): For setting daily rate per mile

### 4. Technology Stack

* React + Vite + TypeScript
* Material UI (MUI) for styling
* Google Maps JavaScript API
* Optional: Firebase for lead storage and admin access

### 5. Firebase Authentication

* Admin access is protected using Firebase Authentication (Google Sign-In).
* Unauthenticated users attempting to access the Admin page are redirected to a login screen.
* Signed-in admins can update the market rate and manage customer requests.


---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

### 3. Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### 4. Deployment

Use Vercel or Netlify for deployment.

---

## Project Roadmap

The steps below outline the logical build sequence for Sparky’s Logistics site:

### 🔧 Phase 1: Core Infrastructure (Done / In Progress)

* [x] Set up project with React + Vite + TypeScript
* [x] Install Material UI (MUI) for consistent styling
* [x] Set up Firebase Hosting
* [x] Connect GitHub repo and enable CI/CD workflow
* [x] Enable Genkit for future AI tools (optional)
* [ ] Connect custom domain via Firebase Hosting

### 🧮 Phase 2: Core Features

* [ ] Build Google Maps-based quote calculator
* [x] Create environment config for API keys
* [ ] Add admin interface to manually update rate per mile
* [ ] Store leads/quotes in Firestore
* [ ] Add quote submission form with delivery notes and contact info

### 📄 Phase 3: Content & Pages

* [ ] Add About page (company history, values, service area)
* [ ] Add Contact page (email form, phone, optional live chat)
* [ ] Add footer navigation across all pages

### 🔐 Phase 4: Admin Panel

* [ ] Basic login or private access for Jeff
* [ ] Rate update panel
* [ ] Lead dashboard (view recent quote requests)

### 💪 Phase 5: Testing & Deployment

* [ ] Manual testing on desktop and mobile
* [ ] Setup analytics or conversion tracking (optional)
* [ ] Final deploy to production domain

---

## Edit This File

This file is a live working document. Update it as new needs or features are added. Let your developer (Clinton) know when you make changes so the build can be adjusted accordingly.

---

## Author

Built by Clinton Williams
