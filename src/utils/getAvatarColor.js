export function getAvatarColor(peerId) {
  const colors = [
    "#ff516a", // red
    "#54cb68", // green
    "#2a9ef1", // blue
    "#665fff", // violet
    "#d669ed", // pink
    "#28c9b7", // cyan
    "#ffa85c", // orange
  ];
  const colorsMap = [0, 6, 3, 1, 5, 2, 4];

  return colors[colorsMap[Math.abs(peerId) % 7]];
}
