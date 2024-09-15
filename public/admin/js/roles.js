// Permissions
const tablePermissions = document.querySelector(`[table-permissions]`);
if (tablePermissions) {
    const buttonSubmit = document.querySelector(`[button-submit]`);

    buttonSubmit.addEventListener(`click`, (e) => {
        let permissions = [];
        const rows = document.querySelectorAll(`[data-name]`);

        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name === "id") {
                inputs.forEach((input) => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: [],
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        // console.log(permissions);

        if (permissions.length > 0) {
            const formChangePermission = document.querySelector(
                `#form-change-permission`
            );
            const input = formChangePermission.querySelector(
                `input[name="permissions"]`
            );
            input.value = JSON.stringify(permissions);
            formChangePermission.submit();
        }
    });

    const dataRecords = document.querySelector(`[data-records]`);

    const records = JSON.parse(dataRecords.getAttribute(`data-records`));

    records.forEach((item, index) => {
        const permissions = item.permissions;
        permissions.forEach((permission) => {
            const row = document.querySelector(`[data-name=${permission}]`);
            const inputs = row.querySelectorAll("input");
            inputs[index].checked = true;
        });
    });
}
// End Permissions
