
# VitaSense - Health Audio Analysis App

A full-featured health tracking application that allows users to upload audio files (breathing, cough, heartbeat recordings) and receive simulated AI-generated health predictions with a clean, professional health-tech design.

---

## 🎨 Design & Theme
- **Aesthetic**: Minimalist health-tech design with white and light blue tones
- **Dark Mode**: Toggle between light and dark themes
- **Typography**: Clean, readable fonts with medical-grade professionalism
- **Responsive**: Mobile-first design that works on all devices

---

## 📱 Pages & Navigation

### Navigation Bar
- Logo/Brand: "VitaSense"
- Links: Home | History | About
- Theme toggle (light/dark)
- User menu (profile, logout)

### 1. Landing/Home Page
- Hero section explaining the app
- Quick upload CTA for logged-in users
- "Get Started" button for new users

### 2. Upload & Analysis Page (Main Feature)
- **Audio Upload Section**
  - Drag-and-drop zone or file picker
  - Accepts .wav and .mp3 files
  - File validation and size limits
  - Upload progress indicator
  
- **Analysis Type Selector**
  - Respiratory (breathing sounds)
  - Cough Analysis
  - Heartbeat Recording
  
- **Prediction Results Card**
  - Analysis type icon
  - Prediction result (e.g., "Normal respiratory pattern detected")
  - Confidence score with visual meter
  - Timestamp
  - Save to history button

### 3. History Page
- Table/list of all past analyses
- Columns: Date, Audio Type, Filename, Prediction, Confidence
- Filtering by date range or analysis type
- View details or re-analyze options

### 4. About Page
- Explanation of how the app works
- Disclaimer about demo/simulation mode
- Information about health audio analysis technology
- Privacy and data handling info

### 5. Auth Pages
- Sign Up (email/password)
- Login
- Password reset functionality

---

## 🔧 Backend (Lovable Cloud)

### Database Tables
- **profiles**: user_id (linked to auth), created_at
- **analysis_history**: id, user_id, filename, audio_type, prediction, confidence, created_at

### Storage
- Audio file uploads stored in Supabase Storage bucket
- Organized by user ID

### Authentication
- Email/password signup and login via Supabase Auth
- Protected routes for upload, history, and analysis features

---

## 🤖 Mock AI Analysis (Demo Mode)

Since this is a demo, the app will simulate AI predictions with:
- Realistic prediction messages per audio type
- Random confidence scores (70-98%)
- Slight delay to simulate processing
- Clear indication that results are simulated

**Example predictions by type:**
- Respiratory: "Normal breathing pattern" / "Slight irregularity detected"
- Cough: "Dry cough pattern" / "Congested cough characteristics"
- Heartbeat: "Regular heart rhythm" / "Minor rhythm variation noted"

*Note: When you're ready to integrate a real ML model, this can be replaced with an external API call.*

---

## ✨ Additional Features
- Toast notifications for upload success/failure
- Loading spinners during analysis
- Empty states for new users
- Mobile-responsive design
- Smooth animations and transitions

---

## 🚀 Future Enhancements (Not in initial build)
- Integration with real ML APIs (Hugging Face, Replicate)
- Export analysis reports as PDF
- Comparison of results over time
- Sharing results with healthcare providers
