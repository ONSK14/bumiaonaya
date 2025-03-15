export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, password } = req.body;
    console.log("收到的请求数据:", username, password);  // 记录前端传来的数据

    const { data, error } = await supabase
        .from("public.users")
        .select("*")
        .eq("username", username)
        .eq("password", password)  // 直接比较明文密码
        .single();

    console.log("Supabase 查询结果:", data, error);  // 记录查询结果

    if (error || !data) {
        return res.status(401).json({ error: "用户名或密码错误" });
    }

    return res.status(200).json({ success: true, message: "登录成功", user: data });
}
