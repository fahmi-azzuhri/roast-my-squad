import { useState } from "react";
import UploadArea from "./components/uploadArea";
import RoastLevelSelector from "./components/RoastLevelSelector";
import RoastResult from "./components/RoastResult";
import { fileToBase64 } from "./utils/fileToBase64";
import { roastSquad } from "./api/roast";
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

      let ocrText = "";
      try {
        const { extractTextFromImage } = await import("./utils/ocr");
        const ocrResult = await extractTextFromImage(base64);
        ocrText = ocrResult.summary || ocrResult.text || "";
      } catch (ocrErr) {}

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
      <div className="max-w-6xl mx-auto p-4 sm:p-10">
        {!result && (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-4xl font-bold mb-2 finger-paint-regular text-red-500">
              Roast My Squad
            </h1>
            <div className="flex gap-2 flex-row justify-center mb-4">
              <Flame size={48} className=" text-red-500 mb-4 animate-pulse" />
              <Flame size={48} className=" text-red-500 mb-4 animate-pulse" />
              <Flame size={48} className=" text-red-500 mb-4 animate-pulse" />
            </div>
            <p className="text-gray-400 text-lg">
              Upload squad, siap dihina AI.
            </p>
          </div>
        )}
        {loading && (
          <div className="text-center mt-8">
            <p className="text-gray-400 animate-pulse">
              Analyzing your squad with {selectedLevel} level...
            </p>
          </div>
        )}

        {!result ? (
          <>
            {showLevelSelector ? (
              <RoastLevelSelector onSelect={handleLevelSelect} />
            ) : (
              <>
                <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Level:</p>
                    <p className="text-white font-bold capitalize">
                      {selectedLevel}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLevelSelector(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Change Level
                  </button>
                </div>

                <UploadArea onUpload={handleUpload} disabled={loading} />
              </>
            )}

            {error && (
              <div className="mt-8 p-4 bg-red-900 text-red-100 rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <RoastResult data={result} />
            <div className="text-center mt-8 flex gap-4 justify-center">
              <button
                onClick={() => setShowLevelSelector(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
              >
                Roast dengan Level Lain
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setShowLevelSelector(false);
                }}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition"
              >
                Roast Squad Lain
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
