const popup = document.getElementById("popup");
const closeIcon = document.getElementById("close");
const toggleCamera = document.getElementById("toggle-camera");
const startRecordingBtn = document.getElementById("startRecordingBtn");
const pauseRecordingBtn = document.getElementById("pauseRecordingBtn");
const stopRecordingBtn = document.getElementById("stopRecordingBtn");
const deleteRecordingBtn = document.getElementById("deleteRecordingBtn");
const timerDisplay = document.getElementById("timerDisplay");
const recordingContainer = document.getElementById("recordingContainer");
const pause = document.getElementById("pause");
const loading = document.getElementById("loading");

const closeModal = function () {
  document.body.style.display = "none";
};

closeIcon.addEventListener("click", closeModal);

let mediaStream;
let mediaRecorder;
const recordedChunks = [];

let isRecording = false;
let recordingInterval;
let startTime;

startRecordingBtn.addEventListener("click", async () => {
  document.body.style.width = "900px";
  document.body.style.height = "800px";
  try {
    if (!isRecording) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      popup.style.display = "none";
      mediaRecorder = new MediaRecorder(mediaStream);
      isRecording = true;
      startTime = Date.now();
      recordingInterval = setInterval(updateTimer, 1000);
      timerDisplay.textContent = "00:00:00";
      mediaRecorder.start();

      recordingContainer.style.display = "flex";
      document.body.style.width = "552px";
      document.body.style.height = "90px";
      document.body.style.backgroundColor = "transparent";

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      startRecordingBtn.disabled = true;
      pauseRecordingBtn.disabled = false;
      stopRecordingBtn.disabled = false;
      deleteRecordingBtn.disabled = false;

      console.log("Screen recording started");
    }
  } catch (error) {
    console.error("Error starting screen recording:", error);
  }
});

pauseRecordingBtn.addEventListener("click", () => {
  if (isRecording) {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      clearInterval(recordingInterval);
      pause.textContent = "Resume";
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      recordingInterval = setInterval(updateTimer, 1000);
      pause.textContent = "Pause";
    }
  }
});

stopRecordingBtn.addEventListener("click", () => {
  if (isRecording) {
    mediaRecorder.stop();
    clearInterval(recordingInterval);
    isRecording = false;

    startRecordingBtn.disabled = false;
    pauseRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = true;
    deleteRecordingBtn.disabled = false;

    recordingContainer.style.display = "none";
    popup.style.display = "none";
    setTimeout(() => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });

      const formData = new FormData();
      formData.append("video", blob, "screen-recording.webm");

      postData(formData);
    }, 5000);
    document.body.style.width = "150px";
    document.body.style.height = "150px";
    loading.style.display = "block";

    console.log("Screen recording stopped");
  }
});

const postData = async (formData) => {
  try {
    const res = await fetch(
      "https://druth-video-api.onrender.com/upload_video",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.ok) {
      let { link } = await res.json();
      link = link.split("/");
      link = link[link.length - 1];
      link = link.split(".");
      link = link[0];

      window.open(`https://stage-5-theta.vercel.app/`);

      console.log("Video uploaded successfully", link);

      popup.style.display = "flex";
      loading.style.display = "none";
    } else {
      console.error("Error uploading video:", res);
    }
  } catch (error) {
    console.error("Error uploading video:", error.message);
  }
};

deleteRecordingBtn.addEventListener("click", () => {});

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const formattedTime = formatTime(elapsedTime);
  timerDisplay.textContent = formattedTime;
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
