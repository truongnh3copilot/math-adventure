function getVietnameseVoice() {
  return window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('vi'));
}

function speakWithVoice(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  const viVoice = getVietnameseVoice();
  if (viVoice) utterance.voice = viVoice;
  window.speechSynthesis.speak(utterance);
}

export function speak(text) {
  if (!('speechSynthesis' in window)) return;

  // getVoices() is empty on first call — voices load asynchronously
  if (getVietnameseVoice()) {
    speakWithVoice(text);
  } else {
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speakWithVoice(text);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Fallback if voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speakWithVoice(text);
    }, 250);
  }
}
