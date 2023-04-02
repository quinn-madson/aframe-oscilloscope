let audioContext;
let analyser;
let source;
let stream;
let audio;

const startPlaybackButton = document.getElementById("start-playback");
const startMicButton = document.getElementById("start-mic");
const stopButton = document.getElementById("stop-btn");

createOscilloscopeComponent();

function createOscilloscopeComponent() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createBufferSource();
    const width = 1024;
    const height = 512;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    document
      .querySelector("#oscilloscope")
      .setAttribute("oscilloscope", { canvas, ctx, analyser });
  }
}

startPlaybackButton.addEventListener("click", () => {
    if (!audio) {
      fetch("https://cdn.glitch.global/ce014346-361f-4580-b8ba-5d381014a7a4/268047__sceza__bass-sine-sweep-400-10hz.wav?v=1680470958564")
        .then((response) => response.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data))
        .then((buffer) => {
          audio = buffer;
          source.buffer = buffer;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          source.start(0);
        })
        .catch((err) => console.error("Error: ", err));
    } else {
      source = audioContext.createBufferSource();
      source.buffer = audio;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start(0);
    }
  });

startMicButton.addEventListener("click", function () {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((micStream) => {
      stream = micStream;
      source = audioContext.createMediaStreamSource(micStream);
      source.connect(analyser);
      createOscilloscopeComponent();
    })
    .catch((err) => console.error("Error: ", err));
});

stopButton.addEventListener("click", function () {
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  console.log(">>> source: ", source);
  if (source.stop) {
    source.stop();
  }
});
