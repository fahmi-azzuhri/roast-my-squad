interface RoastLevelSelectorProps {
  onSelect: (level: RoastLevel) => void;
}

export type RoastLevel = "smooth" | "medium" | "brutal" | "toxic";

interface LevelConfig {
  id: RoastLevel;
  label: string;
  emoji: string;
  description: string;
  intensity: number;
}

const levels: LevelConfig[] = [
  {
    id: "smooth",
    label: "Smooth",
    emoji: "😏",
    description: "Gentle roast, masih sopan",
    intensity: 3,
  },
  {
    id: "medium",
    label: "Medium",
    emoji: "☠️",
    description: "Balanced roast, pedas sedang",
    intensity: 6,
  },
  {
    id: "brutal",
    label: "Brutal",
    emoji: "🔥",
    description: "Extreme roast, no mercy",
    intensity: 8,
  },
  {
    id: "toxic",
    label: "TOXIC",
    emoji: "💀",
    description: "Maximum chaos, pure destruction",
    intensity: 10,
  },
];

export default function RoastLevelSelector({
  onSelect,
}: RoastLevelSelectorProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Pilih Level Roast
        </h2>
        <p className="text-gray-400 text-sm">
          Seberapa brutal AI ngeroast squad lu?
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`p-6 rounded-xl transition-all transform hover:scale-105
              border-2 cursor-pointer
              ${
                false
                  ? "border-red-500 bg-red-900 bg-opacity-20"
                  : "border-gray-600 bg-gray-800 hover:border-red-500"
              }
            `}
          >
            <div className="text-4xl mb-2">{level.emoji}</div>
            <h3 className="font-bold text-white text-sm mb-1">{level.label}</h3>
            <p className="text-xs text-gray-400">{level.description}</p>
            <div className="mt-3 flex gap-0.5 justify-center">
              {Array.from({ length: Math.round(level.intensity / 2) }).map(
                (_, i) => (
                  <span key={i} className="text-red-500 text-sm">
                    █
                  </span>
                ),
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { levels };
