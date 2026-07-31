const questionInput = document.getElementById("question");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");

const API_URL = "https://jarvis-h70w.onrender.com/chat";


function addMessage(name, text, type) {

    const message = document.createElement("div");
    message.className = "message " + type + "-message";

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = name;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    message.appendChild(nameDiv);
    message.appendChild(bubble);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


async function sendMessage() {

    const question = questionInput.value.trim();

    if (question === "") {
        return;
    }

    addMessage("YOU", question, "user");

    questionInput.value = "";

    sendButton.disabled = true;
    sendButton.textContent = "THINKING...";

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


        // Remove Processing message
        const jarvisMessages =
            document.querySelectorAll(".jarvis-message");

        if (jarvisMessages.length > 1) {
            jarvisMessages[
                jarvisMessages.length - 1
            ].remove();
        }


        if (!response.ok) {

            throw new Error(
                data.error || "Server error"
            );

        }


        addMessage(
            "JARVIS",
            data.reply,
            "jarvis"
        );


    } catch (error) {

        console.error(
            "JARVIS ERROR:",
            error
        );


        addMessage(
            "JARVIS",
            "⚠️ " + error.message,
            "jarvis"
        );

    }


    sendButton.disabled = false;
    sendButton.textContent = "SEND";

}


sendButton.addEventListener(
    "click",
    sendMessage
);


questionInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);
