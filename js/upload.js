const lectureCodeInput = document.getElementById("lecture-code");
const videoInput = document.getElementById("video");
const lectureNoteInput = document.getElementById("lecture-note");
const uploadBtn = document.getElementById("upload");

uploadBtn.addEventListener("click", () => {
  lectureCodeInput.value = null;
  videoInput.value = null;
  lectureNoteInput.value = null;
  window.alert(
    "Upload successful! Now you can go to Student view to check the video!"
  );
});
