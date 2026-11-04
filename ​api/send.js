export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        let bodyData = req.body;
        if (typeof bodyData === 'string') {
            try { bodyData = JSON.parse(bodyData); } catch (e) { bodyData = {}; }
        }

        const text = bodyData && bodyData.text;
        const BOT_TOKEN = process.env.BOT_TOKEN; 
        const CHANNEL_ID = "-1002560851677";

        if (!BOT_TOKEN) {
            return res.status(500).json({ success: false, error: 'BOT_TOKEN is missing' });
        }

        if (!text) {
            return res.status(400).json({ success: false, error: 'Text message is missing' });
        }

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true, message_id: data.result.message_id });
        } else {
            return res.status(400).json({ success: false, error: data.description });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
