const pastelColors = [
  "#F0F9FF",
  "#F5F3FF",
  "#FFF1F2",
  "#FFFBEB",
  "#F3FDF2",
  "#F9FAFB",
];

export function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pastelColors.length;
  return pastelColors[index];
}
