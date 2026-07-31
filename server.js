const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.get("/", (req, res) => {
    res.send("JARVIS is online.");
});


app.get("/health", (req, res) => {
    res.json({
        status: "online",
        assistant: "JARVIS"
    });
});


app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        console.log("User message:", message);

        const completion = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content:
                    "You are JARVIS, a helpful personal AI assistant. Speak naturally and clearly. Address the user as sir when appropriate."
                },
                {
                    role: "user",
                    content: message
                }
            ]

        });

        const reply =
            completion.choices[0].message.content;

        console.log("JARVIS reply:", reply);

        res.json({
            reply: reply
        });

    } catch (error) {

        console.error("========== JARVIS ERROR ==========");
        console.error(error);
        console.error("==================================");

        res.status(500).json({
            error: error.message || "JARVIS encountered an internal error."
        });

    }

});


app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `JARVIS server running on port ${PORT}`
    );

});
