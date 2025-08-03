// utils/revoltValidator.js
const REVOLT_KEYWORDS = [
  "revolt",
  "rv",
  "electric",
  "bike",
  "motorcycle",
  "ev",
  "charging",
  "battery",
  "sustainability",
];

export function isRevoltRelated(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  return REVOLT_KEYWORDS.some(
    (keyword) =>
      lowerPrompt.includes(keyword) || lowerPrompt.includes(keyword + "s") // plural forms
  );
}
