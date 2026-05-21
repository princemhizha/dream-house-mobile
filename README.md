# Dream House Mobile 🏠✨

Welcome to the frontend repository for **Dream House**, a modern property listing platform designed to connect renters and landlords with ease.

Built with cutting-edge mobile technologies, this application delivers a beautiful, high-performance, and fully responsive user experience across Web, iOS, and Android.

## Tech Stack 🛠️

- **Framework**: React Native with [Expo](https://expo.dev/)
- **Routing**: Expo Router (File-based routing)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: React Native StyleSheet with custom theme tokens & responsive design
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons (Ionicons)
- **Data Fetching**: Axios-like custom API client connected to a Django REST Backend

## Key Features 🚀

- **Cross-Platform**: Run seamlessly on Web, iOS, and Android from a single codebase.
- **JWT Authentication**: Secure login, registration, and automatic token-refresh flows.
- **Dynamic Routing**: Deep-linking enabled routing utilizing Expo Router.
- **Landlord & Renter Modes**: Distinct UI experiences based on user roles, including a full Landlord Dashboard and listing creation flow with image uploads.
- **Saved Properties**: Offline-first capability and syncing for saved property listings.
- **Micro-Animations**: Smooth UI transitions powered by Reanimated and Spring Physics.

## Getting Started 🏁

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone this repository (if you haven't already).
2. Open a terminal and navigate to the root directory of this project (`dream-house-mobile`).
3. Install all the necessary dependencies by running:

```bash
npm install
```

### Running the App Locally

Once all dependencies are installed, you can start the Expo development server:

```bash
npx expo start
```

This command will start the Metro Bundler. From the terminal, you can:
- Press `w` to open the app in a **Web Browser** (usually `http://localhost:8081`).
- Press `a` to open the app on a connected **Android Emulator** or physical device via USB.
- Press `i` to open the app on an **iOS Simulator** (Mac only).
- Scan the **QR Code** displayed in the terminal using the Expo Go app on your physical mobile device.

### Connecting to the Backend
By default, the application connects to a local instance of the Dream House Django Backend. 
- Ensure your backend server is running locally on port `8000` (`python manage.py runserver`).
- The API client is pre-configured to reach `http://localhost:8000` (for Web/iOS) and `http://10.0.2.2:8000` (for Android emulators).

---

Developed by George_The Innovator.
