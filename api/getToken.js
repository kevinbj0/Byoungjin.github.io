export default async function handler(req, res) {
  // Vercel에 설정된 환경 변수를 안전하게 불러옵니다.
  const TOKEN_URL = "https://test.salesforce.com/services/oauth2/token";
  const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
  const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
  const USERNAME = process.env.SALESFORCE_USERNAME;
  const PASSWORD = process.env.SALESFORCE_PASSWORD; // 비밀번호 + 보안토큰

  const params = new URLSearchParams();
  params.append("grant_type", "password"); // ✅ grant_type 변경
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("username", USERNAME);       // ✅ username 추가
  params.append("password", PASSWORD);       // ✅ password 추가
  
  try {
    const apiResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await apiResponse.json();

    // CORS 설정을 여기에 추가할 수 있습니다 (필요한 경우).
    // 예: res.setHeader('Access-Control-Allow-Origin', 'https://kevinbj0.github.io');
    
    res.status(apiResponse.status).json(data);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
