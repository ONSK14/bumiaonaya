const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // 适用于本地测试

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: "缺少必要参数 username 或 message" });
    }

    try {
        const { data, error } = await supabase
            .from("messages")
            .insert([{ username, message }]);

        if (error) {
            throw error;
        }

        return res.status(200).json({ success: true, reply: `收到消息：${message}`, data });
    } catch (error) {
        console.error("API 服务器错误:", error);
        return res.status(500).json({ error: error.message });
    }
};
