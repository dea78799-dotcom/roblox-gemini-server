const express = require('express');
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Vui lòng nhập nội dung!" });
        }

        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await apiResponse.json();
        
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else {
            res.json({ reply: "Server đã nhận nhưng Gemini chưa phản hồi dữ liệu hợp lệ." });
        }

    } catch (error) {
        res.json({ reply: "Lỗi kết nối API Gemini!" });
    }
});

module.exports = app;
