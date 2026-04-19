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

// Shared state so only one listener is ever registered
let _voicesLoaded = false;
let _pendingCallbacks = [];
let _fallbackTimer = null;

function onVoicesReady(cb) {
  // Only skip the wait if a Vietnamese voice is already present
  if (_voicesLoaded) {
    cb();
    return;
  }
  if (window.speechSynthesis.getVoices().some((v) => v.lang.startsWith('vi'))) {
    _voicesLoaded = true;
    cb();
    return;
  }

  _pendingCallbacks.push(cb);

  // Listener already registered by an earlier call — just queue the callback
  if (_pendingCallbacks.length > 1) return;

  const flush = () => {
    _voicesLoaded = true;
    clearTimeout(_fallbackTimer);
    window.speechSynthesis.removeEventListener('voiceschanged', flush);
    const cbs = _pendingCallbacks.splice(0);
    cbs.forEach((fn) => fn());
  };

  window.speechSynthesis.addEventListener('voiceschanged', flush);

  // Fallback: give browser up to 1 s to load voices before speaking anyway
  _fallbackTimer = setTimeout(flush, 1000);
}

export function speak(text) {
  if (!('speechSynthesis' in window)) return;
  onVoicesReady(() => speakWithVoice(text));
}
