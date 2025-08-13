export default async function handler(req, res) {
  // 실제 키는 Vercel/Netlify의 안전한 환경 변수 저장소에서 불러옵니다.
  const TOKEN_URL =
    "https://connect-flow-8014--ps.sandbox.my.salesforce.com/services/oauth2/token";
  const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
  const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  try {
    const apiResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!apiResponse.ok) {
      // Salesforce로부터 받은 에러를 그대로 전달
      const errorData = await apiResponse.json();
      return res.status(apiResponse.status).json(errorData);
    }

    const data = await apiResponse.json();

    // 성공 시 프론트엔드로 토큰 정보를 전달
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
