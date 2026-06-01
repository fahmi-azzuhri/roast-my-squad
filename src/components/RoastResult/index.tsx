import { Download, Share2 } from "lucide-react";
import type { RoastResult } from "../../types/roastResult";
import { downloadMeme, shareToTiktok } from "../../utils/share";
import { useNavigate } from "react-router-dom";
import "./result.css";

interface RoastResultProps {
  data: RoastResult;
}

const ProgressBar = ({ value, max = 10 }: { value: number; max?: number }) => {
  const percentage = (value / max) * 100;
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return (
    <div className="flex gap-0.5">
      {Array(filled).fill("█").join("")}
      {Array(empty).fill("░").join("")}
    </div>
  );
};

export default function RoastResult({ data }: RoastResultProps) {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const handleDownload = async () => {
    try {
      await downloadMeme(data);
      alert("Meme downloaded!");
    } catch (error) {
      alert("Failed to download meme");
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await shareToTiktok(data);
    } catch (error) {
      alert("Failed to share");
      console.error(error);
    }
  };

  return (
    <div className="roast-container max-w-2xl mx-auto">
      {/* Header */}
      <div className="roast-header text-center mb-8">
        <button onClick={goHome}>
          <h1 className="text-4xl font-black text-red-600">Roast My Squad</h1>
        </button>
        <p className="text-gray-600 text-sm mt-1">
          {data.squadType} Squad Detected
        </p>
      </div>

      {/* Main Scores Card */}
      <div className="roast-card bg-linear-to-br from-red-900 to-black text-white p-8 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-5xl font-black">
              {data.roastScore.toFixed(1)}
            </div>
            <p className="text-red-300">ROAST SCORE</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-2">Squad Value</p>
            <p className="text-lg font-bold">{data.squadValue}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Spam Through</p>
            <ProgressBar value={data.spamThroughPass} max={100} />
            <p className="text-xs text-red-300 mt-1">{data.spamThroughPass}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Dompet Score</p>
            <ProgressBar value={data.walletScore} />
            <p className="text-xs text-red-300 mt-1">
              {data.walletScore.toFixed(1)}/10
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Meta Abuse</p>
            <ProgressBar value={data.metaAbuse} />
            <p className="text-xs text-red-300 mt-1">
              {data.metaAbuse.toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>

      {/* All Scores Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <ScoreBox label="Flex Score" value={data.flexScore} />
        <ScoreBox label="Tactical IQ" value={data.tacticalIQ} />
        <ScoreBox label="Meta Abuse" value={data.metaAbuse} />
      </div>

      {/* Detective Section */}
      <div className="roast-card bg-blue-50 border-2 border-blue-200 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-black text-blue-900 mb-3">
          🕵️ HASIL INVESTIGASI AI
        </h2>
        <div className="space-y-2">
          {data.detective.indications.map((indication, i) => (
            <p key={i} className="text-sm text-blue-800 flex items-start gap-2">
              <span className="text-blue-500 font-bold">▸</span>
              {indication}
            </p>
          ))}
          <p className="text-sm font-bold text-red-600 mt-3 p-3 bg-red-100 rounded">
            Status: {data.detective.conclusion}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="roast-card bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <h3 className="font-bold text-green-900 mb-2">✔ Strengths</h3>
          <ul className="space-y-1">
            {data.strengths.map((s, i) => (
              <li key={i} className="text-xs text-green-800">
                • {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="roast-card bg-red-50 border-2 border-red-200 p-4 rounded-lg">
          <h3 className="font-bold text-red-900 mb-2">✗ Weaknesses</h3>
          <ul className="space-y-1">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-red-800">
                • {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toxic Roast */}
      <div className="roast-card bg-gray-900 text-white p-6 rounded-lg mb-6 border-l-4 border-red-600">
        <h3 className="text-lg font-black mb-3">☠️ TOXIC RANKED</h3>
        <p className="text-sm leading-relaxed italic">{data.toxicRoast}</p>
      </div>

      {/* Netizen Comments */}
      <div className="roast-card bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-black text-gray-900 mb-3">
          💬 Komentar Netizen
        </h3>
        <div className="space-y-2">
          {data.netizanComments.map((comment, i) => (
            <p
              key={i}
              className="text-sm text-gray-700 p-2 bg-white rounded border-l-4 border-yellow-400"
            >
              "{comment}"
            </p>
          ))}
        </div>
      </div>

      {/* TikTok Mode */}
      <div className="roast-card bg-linear-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h3 className="text-lg font-black mb-3">🎬 TIKTOK MODE</h3>
        <p className="text-sm leading-relaxed font-bold whitespace-pre-wrap">
          {data.tiktokMode}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mb-8">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          <Download size={20} />
          Download Meme
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition"
        >
          <Share2 size={20} />
          Share ke TikTok
        </button>
      </div>
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-linear-to-br from-orange-400 to-red-500 text-white p-4 rounded-lg text-center">
      <p className="text-2xl font-black">{value.toFixed(1)}</p>
      <p className="text-xs font-bold mt-1">{label}</p>
    </div>
  );
}
