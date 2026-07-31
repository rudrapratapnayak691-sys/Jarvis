const questionInput = document.getElementById("question");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");

const API_URL = "https://jarvis-h70w.onrender.com/chat";


function addMessage(name, text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}-message`;

    const nameElement = document.createElement("div");
    nameElement.className = "name";
    nameElement.textContent = name;

    const bubbleElement = document.createElement("div");
    bubbleElement.className = "bubble";
    bubbleElement.textContent = text;

    message.appendChild(nameElement);
    message.appendChild(bubbleElement);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


function removeProcessingMessage() {

    const messages = document.querySelectorAll(".jarvis-message");

    for (let i = messages.length - 1; i >= 0; i--) {

        const bubble = messages[i].querySelector(".bubble");

        if (bubble && bubble.textContent === "Processing...") {
            messages[i].remove();
            break;
        }
    }
}


async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) {
        return;
    }

    addMessage("YOU", question, "user");

    questionInput.value = "";

    sendButton.disabled = true;

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


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();

        removeProcessingMessage();


        if (data.reply) {

            addMessage(
                "JARVIS",
                data.reply,
                "jarvis"
            );

        } else {

            addMessage(
                "JARVIS",
                "I received an empty response from the server.",
                "jarvis"
            );

        }


    } catch (error) {

        console.error("JARVIS CONNECTION ERROR:", error);

        removeProcessingMessage();

        addMessage(
            "JARVIS",
            "Connection error. Please check the JARVIS server.",
            "jarvis"
        );

    }


    sendButton.disabled = false;

    questionInput.focus();

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
