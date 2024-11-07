// CLIENT_SEND_MESSAGE
const formSendMessage = document.querySelector(`[form-send-message]`);
const inputMessage = document.querySelector("[input-message]");
if (formSendMessage) {
    formSendMessage.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = inputMessage.value;
        if (message) {
            socket.emit("CLIENT_SEND_MESSAGE", message);
        }
        inputMessage.value = "";
    });
}
// End CLIENT_SEND_MESSAGE
