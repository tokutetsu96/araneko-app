export function getRankColor(tier: string | undefined): string {
  if (!tier) return "bg-gray-500";

  const colors: { [key: string]: string } = {
    IRON: "bg-gradient-to-r from-gray-700 to-gray-500",
    BRONZE: "bg-gradient-to-r from-amber-800 to-amber-600",
    SILVER: "bg-gradient-to-r from-gray-500 to-gray-300",
    GOLD: "bg-gradient-to-r from-yellow-600 to-yellow-400",
    PLATINUM: "bg-gradient-to-r from-cyan-600 to-cyan-400",
    EMERALD: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    DIAMOND: "bg-gradient-to-r from-blue-600 to-blue-400",
    MASTER: "bg-gradient-to-r from-purple-700 to-purple-500",
    GRANDMASTER: "bg-gradient-to-r from-red-700 to-red-500",
    CHALLENGER: "bg-gradient-to-r from-yellow-400 via-teal-300 to-blue-400",
  };

  return colors[tier] || "bg-gray-500";
}
