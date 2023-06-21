// pop up voor inklokken
document.getElementById("clockinButton").addEventListener("click", function () {
  var popup = document.getElementById("clockinPopup");
  popup.style.display = "flex";
});

document.addEventListener("click", function (event) {
  var popup = document.getElementById("clockinPopup");
  if (event.target == popup) {
    popup.style.display = "none";
  }
});

// pop up voor uitklokken
document
  .getElementById("clockoutButton")
  .addEventListener("click", function () {
    var popup = document.getElementById("clockoutPopup");
    popup.style.display = "flex";
  });

document.addEventListener("click", function (event) {
  var popup = document.getElementById("clockoutPopup");
  if (event.target == popup) {
    popup.style.display = "none";
  }
});
