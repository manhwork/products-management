// Change Status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]')

if (buttonChangeStatus.length > 1) {
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');


            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            const formChangeStatus = document.querySelector('#form-change-status')
            const path = formChangeStatus.getAttribute('data-path') + `${newStatus}/${id}` + '?_method=PATCH';
            formChangeStatus.action = path;
            console.log(path);

            // Dùng form.submit() thì có thể thay đổi phương thức get hay post được 
            // còn window.location.href chỉ có thể là phương thức get mà thôi
            formChangeStatus.submit();
        })
    })
}
// End Change Status





