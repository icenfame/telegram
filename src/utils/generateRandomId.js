export function generateRandomId() {
  return (
    Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff)
  );
}
