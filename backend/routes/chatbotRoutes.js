import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  console.log("🟢 Received message from frontend:", message);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a course website. Only answer questions about courses, pricing, or support.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🟡 GPT API raw response:", data);

    if (data.error) {
      console.error("🔴 OpenAI API Error:", data.error);
      return res.status(500).json({ reply: 'OpenAI error: ' + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      console.warn("⚠️ GPT response missing content.");
      return res.status(500).json({ reply: 'GPT did not return a valid response.' });
    }

    res.json({ reply });

  } catch (error) {
    console.error("❌ Chatbot route failure:", error);
    res.status(500).json({ reply: 'Server error: could not connect to GPT.' });
  }
});

export default router;
