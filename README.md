# Roast My Squad

Rate My Squad is a React + TypeScript application that transforms eFootball squad screenshots into AI-powered roasts and shareable memes.

## Features

- Upload eFootball squad screenshots
- Extract text from screenshots using OCR (`tesseract.js`)
- Analyze squads with Google Gemini AI (`@google/genai`)
- 4 roast intensity levels: Smooth, Medium, Brutal, Toxic
- Display scores, netizen comments, tactical analysis, and roasted memes
- Download memes as PNG using DOM-to-image

## Usage

1. Start the development server:

```bash
npm install
npm run dev
```

2. Open your browser to the displayed address, usually `http://localhost:5173`

3. Select your desired roast intensity level
4. Upload an eFootball squad screenshot
5. Wait for AI analysis and view the roast results
6. Download the meme to share

## Environment Configuration

To enable Google Gemini API calls, add the following environment variable to your `.env` file:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

If you don't have an API key yet, obtain one from Google Generative AI and add it to your `.env` file.

## Tech Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS 4
- Google Generative AI (`@google/genai`)
- OCR: `tesseract.js`
- DOM-to-image: `html-to-image`
- Icons: `lucide-react`
- HTTP: `axios`

## Folder Structure

- `src/App.tsx` - application entry point and upload/result flow
- `src/components/uploadArea` - image upload component
- `src/components/RoastLevelSelector` - roast intensity selector
- `src/components/RoastResult` - roast result display
- `src/api/roast.ts` - prompt logic and AI API calls
- `src/utils/ocr.ts` - screenshot text extraction
- `src/utils/share.ts` - meme creation and download
- `src/types/roastResult.ts` - roast result type definitions
- `src/index.css` - global styles and fonts

## Scripts

- `npm run dev` - run development server
- `npm run build` - build application for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Notes

- Ensure your `.env` file contains `VITE_GEMINI_API_KEY` as the API key must be available in the browser.
- If meme downloads aren't working, verify that `html-to-image` successfully renders elements with styling.
- This application relies on screenshot analysis for best results; clear, un-blurred screenshots produce the best analysis.
