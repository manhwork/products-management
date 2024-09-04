// Status fillter
const buttonStatus = document.querySelectorAll("button[button-status]");
const url = new URL(window.location.href);

if (buttonStatus.length > 0) {
  buttonStatus.forEach((item) => {
    item.addEventListener("click", () => {
      const status = item.getAttribute("button-status");

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

// Search
const formSearch = document.querySelector("#form-search");
const inputForm = formSearch.querySelector(`input[placeholder='Nhập từ khoá']`);
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // const url = new URL(window.location.href);

    if (inputForm.value) {
      url.searchParams.set("keyword", inputForm.value);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });

  inputForm.value = url.searchParams.get("keyword");
}

// End Search
