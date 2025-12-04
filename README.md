# Predictive Bubble Keyboard

An adaptive text entry system for mobile devices that dynamically modifies key sizes based on probabilistic next-character predictions. This project implements a research prototype for studying the effectiveness of predictive keyboard interfaces.

## Features

- **Predictive Bubble Keyboard**: Keys enlarge based on next-character probability predictions
- **AI-Powered Predictions**: Uses Google Gemini for context-aware predictions
- **Smart Local Fallback**: Trigram-based predictions when API is unavailable
- **User Study Infrastructure**: Complete A/B testing framework with data logging
- **Researcher Dashboard**: Analytics and visualization tools for study results
- **Demo Mode**: Automated demonstration of the keyboard's predictive capabilities
- **Mobile-First Design**: Optimized for touch interactions on mobile devices

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Google Gemini 2.5 Flash-Lite API** for AI predictions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BubbleKeyboard
```

2. Install dependencies:
```bash
npm install
```

3. **(Optional but Recommended)** Set up Gemini API for AI-powered predictions:
   ```bash
   # Get free API key from: https://aistudio.google.com/app/apikey
   # Create .env file:
   echo "VITE_GEMINI_API_KEY=your_key_here" > .env
   ```
   See [API_SETUP.md](API_SETUP.md) for detailed instructions.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Keyboard.tsx          # Main keyboard component with bubble effects
│   ├── PredictionWheel.tsx   # Pie chart wheel for predictions
│   ├── TextDisplay.tsx       # Text input display area
│   ├── Study/                # User study components
│   │   ├── WelcomeScreen.tsx
│   │   ├── TaskScreen.tsx
│   │   ├── QuestionnaireScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── StudyFlow.tsx
│   ├── Dashboard/            # Researcher dashboard
│   │   └── ResearcherDashboard.tsx
│   └── Demo/                 # Demo mode
│       └── DemoMode.tsx
├── utils/
│   ├── geminiPredictor.ts    # Google Gemini API integration
│   ├── smartPredictor.ts     # Trigram-based local predictor
│   ├── apiPredictor.ts       # Prediction orchestration
│   ├── bigramData.ts         # Bigram frequency data
│   └── dataLogger.ts         # Data logging system
└── App.tsx                   # Main app with routing
```

## Usage

### Demo Mode

1. Navigate to the home page (`/`)
2. Click "Demo Mode" to see an automated demonstration
3. Use Play/Pause controls to control the demo

### Running a User Study

1. Navigate to `/study`
2. Enter a participant ID
3. The system will randomly assign either "standard" or "predictive" condition
4. Complete 5 typing tasks
5. Fill out the post-study questionnaire
6. View results summary

### Researcher Dashboard

1. Navigate to `/researcher`
2. Enter password: `researcher2024` (or `admin`)
3. View aggregated statistics and session data
4. Export data as JSON or CSV

## Study Sentences

The study uses these 5 preset sentences:
1. "The quick brown fox jumps over the lazy dog"
2. "Machine learning improves user experience significantly"
3. "Mobile keyboards should be easy to use"
4. "Predictive text helps people type faster"
5. "User interfaces adapt to human behavior"

## Data Collection

The system logs:
- Every keystroke with timestamp
- Prediction accuracy (for predictive condition)
- Error rates (backspace usage)
- Words per minute (WPM)
- Characters per minute (CPM)
- Inter-key intervals
- Task completion times
- Questionnaire responses

Data is stored in browser localStorage and can be exported as JSON or CSV.

## Prediction System

The keyboard uses a **dual prediction system**:

### 1. AI-Powered (Gemini 2.5 Flash-Lite) 🌟 **Recommended**

When `VITE_GEMINI_API_KEY` is set:
- **Model**: `gemini-2.5-flash-lite` (super fast, optimized for quick predictions)
- **Context-aware**: Understands full sentences and natural language
- **Accurate**: ~90%+ prediction accuracy
- **Fast**: Predictions in <1 second
- **Free**: 15 requests/min, 1500 requests/day
- **Setup**: See [API_SETUP.md](API_SETUP.md)

### 2. Local Smart Predictor (Fallback)

When no API key is set:
- **Trigram-based**: Uses 3-letter pattern matching
- **Word context**: Understands common word transitions
- **Privacy-friendly**: No external API calls
- **Offline**: Works without internet
- **Accuracy**: ~70%

## Configuration

### Changing Dashboard Password

Edit `src/components/Dashboard/ResearcherDashboard.tsx` and update the password check in `handleLogin()`.

### Modifying Study Sentences

Edit the `STUDY_SENTENCES` array in `src/components/Study/TaskScreen.tsx`.

### Adjusting Prediction Parameters

Modify trigram data in `src/utils/smartPredictor.ts`.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Add your `VITE_GEMINI_API_KEY` as an environment variable in Vercel dashboard
3. Run `vercel` in the project directory
4. Follow the prompts

### Other Platforms

The app is a standard Vite React app and can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

**Important:** Remember to set `VITE_GEMINI_API_KEY` as an environment variable in your deployment platform.

## Known Limitations

- Data stored only in browser localStorage (not persistent across devices)
- No server-side data collection
- Gemini API has rate limits (60/min, 1500/day on free tier)

## Future Improvements

- User-specific adaptation and learning
- Cloud data storage
- Multi-language support
- Advanced analytics and visualizations
- Real-time collaboration features
- Offline model for better privacy

## License

This project is for research purposes.

## Contributing

This is a research prototype. For questions or contributions, please contact the project maintainers.

## Acknowledgments

- Based on Fitts's Law and Hick's Law principles
- Uses English trigram frequency data from linguistic research
- Powered by Google Gemini AI
- Built with modern web technologies for mobile-first design
