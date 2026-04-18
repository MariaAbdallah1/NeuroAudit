import { OpenAI } from 'openai'
import { Buffer } from 'buffer'


const isPhpCode = (input) => {
    const phpTagRegex = /^<\?php[\s\S]*\?>$/;      
    const phpStartRegex = /^php[\s\S]*$/i;          

    return phpTagRegex.test(input) || phpStartRegex.test(input);
};

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI,
})
async function GptChat(prompt, userMessage) {
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: userMessage },
        ]
    });

    const reply = chatCompletion.choices[0].message.content;
    return reply
}

export const Bot = async (req, res) => {
    const userMessage = req.query.q;

    if (!userMessage) {
        return res.status(400).json({ error: 'Body parameter "q" is required.' });
    }

    try {
        const php=isPhpCode(userMessage)
        if (php==true) {
            const base64Message = Buffer.from(userMessage).toString('base64')
            const externalRes = await fetch('http://127.0.0.1:5000/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mysecretapikey'
                },
                body: JSON.stringify({ "b64sc": base64Message })
            });

            const externalData = await externalRes.json();
            const prompt = `You are a cybersecurity code reviewer.
            A vulnerability detection model has already made a prediction about the following code:
            Prediction: ${externalData.result}
            User Code: ${userMessage}
            ⚠️ DO NOT change or re-evaluate the model’s prediction.
            Your job is to:
            If the prediction says the code is vulnerable, explain the type of vulnerability the model gives you and give the user fixed code.
            If the prediction says the code Non-vulnerable, respond in a friendly, confident, and cool tone to reassure the user.
                `
            const prediction = await GptChat(prompt, userMessage)
            res.status(200).json({
            user: userMessage,
            bot: `
            ${externalData.result}
            ${prediction}
            `
        });
        } else {
            res.status(200).json({
            user: userMessage,
            bot: "Pls Enter valid php Code"
        });

        }
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};










