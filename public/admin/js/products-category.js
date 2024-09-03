// Status fillter
const buttonStatus = document.querySelectorAll("button[button-status]");

if (buttonStatus.length > 0) {
  buttonStatus.forEach((item) => {
    item.addEventListener("click", () => {
      const status = item.getAttribute("button-status");
      const url = new URL(window.location.href);

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
// End Status fillter
