# GearUp - Training and Certification Platform

GearUp is a data-heavy web application for managing employee training, assessments, and certifications.

## Firebase Setup

This project uses Firebase Realtime Database for data storage. Follow these steps to set up Firebase:

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup steps

2. **Set up Realtime Database**:
   - In your Firebase project, go to "Realtime Database" in the left sidebar
   - Click "Create Database"
   - Start in test mode (you can adjust security rules later)

3. **Get Firebase Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" and select the web app (or create one)
   - Copy the Firebase configuration object

4. **Update Firebase Configuration**:
   - Open `src/config/firebase.js`
   - Replace the placeholder values in `firebaseConfig` with your actual Firebase configuration

5. **Initialize the Database**:
   - The application will automatically initialize the database with sample data on first run
   - You can modify the sample data in `src/utils/initializeDatabase.js`

## Database Structure

The database is organized into the following collections:

- **courses**: Training courses available to employees
- **assessments**: Tests to evaluate employee knowledge
- **employees**: Employee information and progress
- **certifications**: Certifications earned by employees
- **reports**: Generated reports on training progress

## Development

This project is built with React and Vite.

### Getting Started

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

### Building for Production

```bash
# Build the project
yarn build

# Preview the build
yarn preview
```

## Technologies Used

- React
- Firebase (Authentication and Realtime Database)
- React Router
- Vite
