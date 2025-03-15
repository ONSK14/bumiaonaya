import { createClient } from '@supabase/supabase-js';

// 连接 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // 验证用户名和密码
    const { data, error } = await supabase
      .from('users')
      .select('username, password, quota')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 额度 -1
    const newQuota = data.quota - 1;
    await supabase
      .from('users')
      .update({ quota: newQuota })
      .eq('username', username);

    return res.status(200).json({ message: '登录成功', username, quota: newQuota });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
