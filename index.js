const express = require('express');
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Thiếu nội dung tin nhắn!" });
        }

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ reply: "Lỗi: Chưa cấu hình GEMINI_API_KEY!" });
        }

        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await apiResponse.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else {
            res.json({ reply: "Phản hồi từ Google: " + (data.error ? data.error.message : "Lỗi dữ liệu trống.") });
        }

    } catch (error) {
        res.json({ reply: "Lỗi Server: " + error.message });
    }
});

module.exports = app;
