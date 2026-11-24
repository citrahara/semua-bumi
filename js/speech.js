// Studio Mikrofon Lokal untuk Babak 4:
// - MediaRecorder untuk rekam suara lokal dan putar ulang di browser (privasi aman, tidak dikirim ke server)
// - Web Audio AnalyserNode untuk animasi gelombang suara langsung di kanvas
// - Web Speech API (id-ID) opsional untuk transkrip langsung dan deteksi kata sakti

export class MicStudio {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.audioUrl = null;
    this.audioCtx = null;
    this.analyser = null;
    this.rafId = null;
    this.recognition = null;
    this.transcript = '';
    this.interim = '';
    this.isRecording = false;
    this.speechSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async start({ canvas, onTranscript, onError }) {
    this.cleanupPlayback();
    this.transcript = '';
    this.interim = '';
    this.chunks = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (onError) onError('Browser ini belum mendukung akses mikrofon. Kamu tetap bisa pakai mode ketik kilat!');
      return false;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      if (onError) onError('Izin mikrofon ditolak atau perangkat tidak ditemukan. Tenang, lanjut pakai mode ketik kilat saja!');
      return false;
    }

    this.isRecording = true;

    // 1. Live waveform visualizer
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);
      if (canvas) this.drawWave(canvas);
    } catch {
      // Lanjut tanpa visualizer jika AudioContext dibatasi
    }

    // 2. Local audio recorder
    try {
      this.recorder = new MediaRecorder(this.stream);
      this.recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.chunks.push(e.data);
      };
      this.recorder.start();
    } catch {
      // Lanjut tanpa MediaRecorder
    }

    // 3. Optional Indonesian Web Speech API transcript
    if (this.speechSupported) {
      try {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRec();
        this.recognition.lang = 'id-ID';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.onresult = (event) => {
          let finalPart = '';
          let interimPart = '';
          for (let i = 0; i < event.results.length; i++) {
            const text = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalPart += `${text} `;
            else interimPart += text;
          }
          this.transcript = finalPart.trim();
          this.interim = interimPart.trim();
          if (onTranscript) onTranscript(`${this.transcript} ${this.interim}`.trim());
        };
        this.recognition.onerror = () => {
          // Pengenalan ucapan bisa gagal di sebagian browser; rekaman suara tetap jalan
        };
        this.recognition.start();
      } catch {
        // Abaikan jika browser menolak pengenalan suara
      }
    }

    return true;
  }

  drawWave(canvas) {
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!this.isRecording || !this.analyser) return;
      this.rafId = requestAnimationFrame(render);
      this.analyser.getByteFrequencyData(dataArray);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barCount = 24;
      const gap = 4;
      const barWidth = (w - gap * (barCount - 1)) / barCount;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] || 0;
        const barH = Math.max(6, (value / 255) * (h - 10));
        const x = i * (barWidth + gap);
        const y = (h - barH) / 2;
        ctx.fillStyle = value > 130 ? '#E64A19' : '#F5C451';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 4);
        ctx.fill();
      }
    };
    render();
  }

  async stop() {
    this.isRecording = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    const audioUrl = await new Promise((resolve) => {
      if (this.recorder && this.recorder.state !== 'inactive') {
        this.recorder.onstop = () => {
          if (this.chunks.length > 0) {
            const blob = new Blob(this.chunks, { type: this.recorder.mimeType || 'audio/webm' });
            this.audioUrl = URL.createObjectURL(blob);
            resolve(this.audioUrl);
          } else {
            resolve(null);
          }
        };
        try {
          this.recorder.stop();
        } catch {
          resolve(null);
        }
      } else {
        resolve(this.audioUrl);
      }
    });

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
      this.analyser = null;
    }

    return {
      audioUrl,
      transcript: `${this.transcript} ${this.interim}`.trim()
    };
  }

  cleanupPlayback() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }
}

export function detectKeywords(text, keywords) {
  const normalized = (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return keywords.map((kw) => {
    const target = kw.word.toLowerCase();
    // Cocokkan kata utuh atau berimbuhan sederhana (misal "ironis", "pragmatisme")
    const stem = target.length > 5 ? target.slice(0, target.length - 1) : target;
    return {
      ...kw,
      matched: normalized.includes(target) || (stem.length >= 5 && normalized.includes(stem))
    };
  });
}
