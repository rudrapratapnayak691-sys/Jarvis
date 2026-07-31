const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.use(cors());

app.use(express.json());


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


        const completion =
            await client.chat.completions.create({

                model: "gpt-4.1-mini",

                messages: [

                    {
                        role: "system",

                        content:
                        "You are JARVIS, a highly intelligent, helpful and polite personal AI assistant. Speak naturally and clearly. Address the user as sir when appropriate. Keep answers useful and concise unless the user asks for detail."
                    },

                    {
                        role: "user",

                        content: message
                    }

                ]

            });


        const reply =
            completion.choices[0].message.content;


        res.json({
            reply: reply
        });


    } catch (error) {

        console.error(
            "JARVIS ERROR:",
            error
        );


        res.status(500).json({

            error:
            "JARVIS encountered an internal error."

        });

    }

});


app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `JARVIS is running on port ${PORT}`
    );

});
