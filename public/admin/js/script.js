// button status

const buttonStatus = document.querySelectorAll('[button-status]');

if (buttonStatus.length > 0) {
    // console.log(url);

    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            const url = new URL(window.location.href);

            if (status) {
                url.searchParams.set('status', status);
            }
            else {
                url.searchParams.delete('status');
            }

            window.location.href = url.href;
        })
    })
}


// button status end


//form search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        // console.log(e);
        const searchInput = e.target.elements.keyword.value;
        // console.log(searchInput);
        const url = new URL(window.location.href);

        if (searchInput) {
            url.searchParams.set('keyword', searchInput);
        }
        else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    })
}


// End form search


// Pagination 

const buttonPagination = document.querySelectorAll('[pagination-index]');
// console.log(buttonPagination);

buttonPagination.forEach(button => {
    button.addEventListener('click', (e) => {
        const currentPage = button.getAttribute('pagination-index');
        console.log(currentPage);

        const url = new URL(window.location.href);

        if (currentPage) {
            url.searchParams.set('page', currentPage);
        }
        else {
            url.searchParams.delete('page');
        }

        window.location.href = url.href;
    })
})

// End Pagination


// Checkbox all 
const buttonCheckAll = document.querySelector("input[name='checkall']");
const buttonId = document.querySelectorAll("input[name='id']");



if (buttonCheckAll) {
    buttonCheckAll.addEventListener("click", () => {
        if (buttonCheckAll.checked) {
            buttonId.forEach(button => button.checked = true);
        }
        else {
            buttonId.forEach(button => button.checked = false);
        }
    })
}


if (buttonId.length > 0) {
    buttonId.forEach(button => {
        button.addEventListener("click", () => {
            const countButtonIdChecked = document.querySelectorAll("input[name='id']:checked").length;
            if (countButtonIdChecked === buttonId.length) {
                buttonCheckAll.checked = true;
            }
            else {
                buttonCheckAll.checked = false;
            }
        })
    })
}


// End Checkbox all 


// ChangeMulti 
const formChangeMulti = document.querySelector('form[form-change-multi]');

if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const buttonIdChecked = document.querySelectorAll("input[name='id']:checked");
        const typeChange = e.target.elements.type.value;

        if (typeChange) {
            const isConfirm = confirm("Bạn có chắc chắn với thay đổi này ?");
            if (!isConfirm) return;
        }

        if (buttonIdChecked.length > 0) {
            let ids = [];

            buttonIdChecked.forEach(button => {
                if (typeChange == "change-position") {
                    const position = button.closest("tr").querySelector('input[name="position"]').value;
                    ids.push(`${button.value}-${position}`);
                }
                else {
                    ids.push(button.value);
                }
            })

            const inputValues = document.querySelector("input[name='ids']");
            inputValues.value = ids.join(', ');
            formChangeMulti.submit();
        }
        else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm!")
        }
    })
}

// End ChangeMulti 


// Delete Item 
const buttonDelete = document.querySelectorAll("button[button-delete]");

if (buttonDelete.length > 0) {
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const deleteConfirm = confirm("Bạn có chắc muốn xoá sản phẩm này chứ ?");
            if (deleteConfirm) {
                const id = button.getAttribute('data-id');
                const formDeleteItem = document.querySelector('#form-delete-item');

                const path = formDeleteItem.getAttribute('data-path');
                const action = path + '/' + id + '?_method=DELETE';

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}
// End Delete Item 


// Show Alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {

    const closeNotifycation = showAlert.querySelector('[close-notifycation]');

    closeNotifycation.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    })


    const time = parseInt(showAlert.getAttribute('data-time'));
    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);
}
// End Show Alert


// Preview Image

const uploadInput = document.querySelector('[upload-input]');
const uploadInputImage = document.querySelector('[upload-input-image]');
const uploadInputPreview = document.querySelector('[upload-input-preview]');
const previewHidden = document.querySelector('[preview-hidden]');

if (uploadInput) {
    uploadInputImage.addEventListener('change', (e) => {
        // console.log(e.target);

        const [file] = uploadInputImage.files;

        // console.log(e.target.files);

        if (file) {
            uploadInputPreview.src = URL.createObjectURL(file);

            previewHidden.classList.add("active");

            if (previewHidden) {
                previewHidden.addEventListener("click", () => {
                    uploadInputPreview.src = "";
                    uploadInputImage.value = "";
                    previewHidden.classList.remove("active");
                })
            }

        }

    })
}

// End Preview Image

// Sort
const sort = document.querySelector('[sort]');
if (sort) {
    const url = new URL(window.location.href);
    const selectSort = document.querySelector(`[select-sort]`);
    const clearSort = document.querySelector(`[clear-sort]`);
    // Khi ô select thay đổi thì bắt sự kiện đẩy lên url
    selectSort.addEventListener("change", (e) => {
        let arrSort = e.target.value;
        arrSort = arrSort.split("-");
        const [key, value] = arrSort;
        // console.log(arrSort);
        url.searchParams.set(`sortKey`, key);
        url.searchParams.set(`sortValue`, value);
        window.location.href = url.href;
    })

    clearSort.addEventListener("click", (e) => {
        url.searchParams.delete(`sortKey`);
        url.searchParams.delete(`sortValue`);
        window.location.href = url.href;
    })

    console.log(url);
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');

    const strParams = sortKey + "-" + sortValue;
    const optionSelected = selectSort.querySelector(`option[value=${strParams}]`)
    // console.log(optionSelected);
    optionSelected.selected = true ;

}
// End Sort