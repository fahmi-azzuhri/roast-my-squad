import { useState } from "react";
import UploadArea from "./components/uploadArea";
import RoastLevelSelector from "./components/RoastLevelSelector";
import RoastResult from "./components/RoastResult";
import { fileToBase64 } from "./utils/fileToBase64";
import { roastSquad } from "./api/roast";
import { extractTextFromImage } from "./utils/ocr";
import type { RoastResult as RoastResultType } from "./types/roastResult";
import type { RoastLevel } from "./components/RoastLevelSelector";
import { Flame } from "lucide-react";

function App() {
  const [result, setResult] = useState<RoastResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<RoastLevel>("medium");
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  const handleLevelSelect = (level: RoastLevel) => {
    setSelectedLevel(level);
    setShowLevelSelector(false);
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const base64 = await fileToBase64(file);

      const ocrResult = await extractTextFromImage(base64);
      const ocrText = ocrResult.summary || ocrResult.text || "";

      const data = await roastSquad(base64, selectedLevel, ocrText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze squad");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black">
      <h1 className="text-4xl font-black text-red-600 text-center pt-12">
        <Flame className="inline-block mr-2 animate-pulse" />
        eROAST - Rate My Squad currently maintained, come back later!"
      </h1>
    </div>
  );
}

export default App;
