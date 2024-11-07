const messages = document.querySelector(".messages");
const scrollHeight = messages.scrollHeight;
messages.scrollTop = scrollHeight;
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

// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
    console.log(data);
    const userIdElement = document.querySelector("[user-id]");
    const userId = userIdElement.getAttribute("user-id");
    console.log(userId);
    console.log(data.user.id);
    const chatMessages = document.querySelector(".messages");
    const li = document.createElement("li");
    if (userId == data.user._id) {
        li.classList.add("message", "right", "appeared");
        data.user.fullName = "You";
    } else {
        li.classList.add("message", "left", "appeared");
    }
    li.innerHTML = `
            <div class="avatar" bis_skin_checked="1">${data.user.fullName}</div>
            <div class="text_wrapper" bis_skin_checked="1">
                <div class="text" bis_skin_checked="1">${data.content}</div>
            </div>     
    `;
    chatMessages.appendChild(li);
    const scrollHeight = messages.scrollHeight;
    messages.scrollTop = scrollHeight;
});
// End SERVER_SEND_MESSAGE
