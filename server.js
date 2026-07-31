
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;


// OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// Middleware
app.use(cors());

app.use(express.json());


// Home route
app.get("/", (req, res) => {

    res.send("JARVIS is online.");

});


// Chat route
app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;


        if (!message) {

            return res.status(400).json({
                error: "Message is required."
            });

        }


        const completion = await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [

                {
                    role: "system",

                    content:
                    "You are JARVIS, a highly intelligent, helpful and polite personal AI assistant. Speak clearly and naturally. Address the user as sir when appropriate."
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

        console.error("JARVIS ERROR:", error);

        res.status(500).json({

            error: "JARVIS encountered an error."

        });

    }

});


app.listen(PORT, () => {

    console.log(
        `JARVIS server running on port ${PORT}`
    );

});
