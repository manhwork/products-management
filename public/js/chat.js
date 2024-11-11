import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

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
    const userIdElement = document.querySelector("[user-id]");
    const userId = userIdElement.getAttribute("user-id");
    const chatMessages = document.querySelector(".messages");
    const li = document.createElement("li");
    if (userId == data.userId) {
        li.classList.add("message", "right", "appeared");
        data.fullName = "You";
    } else {
        li.classList.add("message", "left", "appeared");
    }
    li.innerHTML = `
            <div class="avatar" bis_skin_checked="1">${data.fullName}</div>
            <div class="text_wrapper" bis_skin_checked="1">
                <div class="text" bis_skin_checked="1">${data.content}</div>
            </div>     
    `;
    chatMessages.appendChild(li);
    const scrollHeight = messages.scrollHeight;
    messages.scrollTop = scrollHeight;
});
// End SERVER_SEND_MESSAGE

// Event emoji click
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (e) => {
        const emoji = e.detail.unicode;
        inputMessage.value += emoji;
    });
    const buttonEmoji = document.querySelector(".btn-emoji");
    const tooltip = document.querySelector(".tooltip");
    if (buttonEmoji) {
        Popper.createPopper(buttonEmoji, tooltip);
        buttonEmoji.addEventListener("click", () => {
            tooltip.classList.toggle("shown");
        });
    }
}

//End Event emoji click

// Typing
const listTyping = document.querySelector(".list-inner-typing");
if (listTyping) {
    inputMessage.addEventListener("keyup", (e) => {
        socket.emit("CLIENT_TYPING", "show");
    });

    socket.on("SERVER_TYPING", (data) => {
        const existTyping = listTyping.querySelector(
            `[user-id="${data.userId}"]`
        );
        if (data.type === "show" && !existTyping) {
            const div = document.createElement("div");
            div.classList.add("inner-typing");
            div.setAttribute("user-id", data.userId);

            div.innerHTML = `
                <div class="sender">
                    ${data.fullName}
                </div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            listTyping.appendChild(div);
        }
    });
}

// End Typing
