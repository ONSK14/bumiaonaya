import { createClient } from '@supabase/supabase-js';

// 读取 Vercel 环境变量
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ error: "缺少必要参数 username 或 message" });
    }

    try {
        // 存入 Supabase 数据库
        const { data, error } = await supabase
            .from("messages")
            .insert([{ username, message }]);

        if (error) {
            throw error;
        }

        res.status(200).json({ success: true, reply: `收到消息：${message}`, data });
    } catch (error) {
        console.error("Supabase 错误:", error);
        res.status(500).json({ error: error.message });
    }
}
