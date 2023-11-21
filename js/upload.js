const lectureCodeInput = document.getElementById("lecture-code");
const videoInput = document.getElementById("video");
const lectureNoteInput = document.getElementById("lecture-note");
const uploadBtn = document.getElementById("upload");
const successMsg = document.getElementById("success");

uploadBtn.addEventListener("click", () => {
  lectureCodeInput.value = null;
  videoInput.value = null;
  lectureNoteInput.value = null;
  successMsg.classList.add("show");
});
