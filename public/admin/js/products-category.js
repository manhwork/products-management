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

// Checkk All
const checkAll = document.querySelector(`input[name='checkall']`);
const checkBox = document.querySelectorAll(`input[name="id"]`);
if (checkAll) {
    checkAll.addEventListener("click", (e) => {
        if (checkAll.checked) {
            checkBox.forEach((item) => {
                item.checked = true;
            });
        } else {
            checkBox.forEach((item) => {
                item.checked = false;
            });
        }
    });
}

if (checkBox.length > 0) {
    checkBox.forEach((item) => {
        item.addEventListener("click", (e) => {
            const checkedBox = document.querySelectorAll(
                `input[name="id"]:checked`
            ).length;

            if (checkedBox === checkBox.length) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        });
    });
}
// End Checkk All

// Change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkedBox = document.querySelectorAll(
            `input[name="id"]:checked`
        );
        const typeChange = e.target.type.value;
        console.log(typeChange);
        if (typeChange) {
            const isConfirm = confirm("Bạn có chắc chắn với thay đổi này ?");
            if (!isConfirm) return;
        }

        if (checkedBox.length > 0) {
            let ids = [];

            checkedBox.forEach((button) => {
                if (typeChange == "change-position") {
                    const position = button
                        .closest("tr")
                        .querySelector('input[name="position"]').value;
                    ids.push(`${button.value}-${position}`);
                } else {
                    ids.push(button.value);
                }
            });

            const inputValues = document.querySelector("input[name='ids']");
            inputValues.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm!");
        }
    });
}
// End Change multi

// Delete Item
const buttonDelete = document.querySelectorAll("button[button-delete]");

if (buttonDelete.length > 0) {
    buttonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const deleteConfirm = confirm(
                "Bạn có chắc muốn danh mục này chứ ?"
            );
            if (deleteConfirm) {
                const id = button.getAttribute("data-id");
                const formDeleteItem =
                    document.querySelector("#form-delete-item");

                const path = formDeleteItem.getAttribute("data-path");
                const action = path + "/" + id + "?_method=DELETE";

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// End Delete Item
