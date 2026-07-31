const questionInput = document.getElementById("question");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");

// Replace this with your Render backend URL
const API_URL = "https://YOUR-RENDER-URL.onrender.com/chat";


function addMessage(name, text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}-message`;

    message.innerHTML = `
        <div class="name">${name}</div>
        <div class="bubble">${text}</div>
    `;

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) {
        return;
    }

    addMessage("YOU", question, "user");

    questionInput.value = "";

    addMessage("JARVIS", "Processing...", "jarvis");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: question
            })

        });


        const data = await response.json();


        // Remove "Processing..."
        const messages = document.querySelectorAll(".jarvis-message");

        if (messages.length > 1) {
            messages[messages.length - 1].remove();
        }


        if (data.reply) {

            addMessage(
                "JARVIS",
                data.reply,
                "jarvis"
            );

        } else {

            addMessage(
                "JARVIS",
                "I couldn't process that request.",
                "jarvis"
            );

        }

    } catch (error) {

        console.error(error);

        const messages = document.querySelectorAll(".jarvis-message");

        if (messages.length > 1) {
            messages[messages.length - 1].remove();
        }

        addMessage(
            "JARVIS",
            "Connection error. Please check the JARVIS server.",
            "jarvis"
        );

    }

}


sendButton.addEventListener("click", sendMessage);


questionInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});
