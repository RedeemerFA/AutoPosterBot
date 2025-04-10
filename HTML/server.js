// important imports
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setting up the directory name and file name for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Loading environment variables from .env file for security reasons
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initializing express app and middleware
const app = express();
app.use(express.json());

// Serving up the static files from the current directory, yum
app.use(express.static(__dirname));

// Getting API key from .env for security reasons
const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    }
);

// Simulate fetching a prompt from WhatsApp since I still didn't get permission to use the API from the university admins
async function getPromptFromWhatsApp() {
    return "Hey it's Yuma, I wanted to give you the following info for the Al Ain Hackathon event. It's happening on May 10th, 2025, from 5 PM to 10 PM at the ADU Al Ain Campus. It's an open event where all students can join to better their skills, take part in challenges, listen to guest speakers, and meet as well as learn from industry experts.";
}

// Endpoint to generate poster info from the whatsapp message
app.post('/generate-poster', async (req, res) => {
    try {
        const whatsappMessage =  await getPromptFromWhatsApp();

        const prompt = `Extract the following information from the message about the event: title, description, bullet point 1, bullet point 2, bullet point 3, date, time, and location in this order. Separate them all with --. Message: ${whatsappMessage}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            store: true,
            messages: [{ "role": 'user', "content": prompt },],
        });

        const response = completion.data.choices[0].message.content;
        const [title, description, bullet1, bullet2, bullet3, date, time, location] = response.split('--').map(item => item.trim());

        res.json({ title, description, bullet1, bullet2, bullet3, date, time, location });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate poster info' });
    }
});

// Start the server and watch the magic happen
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

