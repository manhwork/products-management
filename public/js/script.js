// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const closeNotifycation = showAlert.querySelector("[close-notifycation]");

    closeNotifycation.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });

    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
}
// End Show Alert

// Change quantity
const quantityInput = document.querySelectorAll(`input[name="quantity"]`);
if (quantityInput.length > 0) {
    quantityInput.forEach((item) => {
        item.addEventListener(`change`, (e) => {
            const productId = item.getAttribute("product-id");
            const quantity = item.value;
            const maxQuantity = parseInt(item.max);
            if (quantity >= 1 && quantity <= maxQuantity) {
                window.location.href = `/cart/update/${productId}/${quantity}`;
            } else if (quantity < 1) {
                alert("Vui lòng nhập ít nhất 1 sản phẩm");
            } else if (quantity > maxQuantity) {
                alert(`Kho hàng chỉ còn ${maxQuantity} sản phẩm`);
            }
        });
    });
}
// Change quantity
