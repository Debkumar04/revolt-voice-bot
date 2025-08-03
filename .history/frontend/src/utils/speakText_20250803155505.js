export const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.name.includes("Google") || v.default);
  window.speechSynthesis.speak(utterance);
};
