export default async function handler(req, res) {
  // 환경 변수 사용을 강력히 권장합니다.
  // 이 값들은 Vercel 프로젝트 설정에 환경 변수로 등록해야 합니다.
  // const TOKEN_URL = "https://test.salesforce.com/services/oauth2/token";
  // const CLIENT_ID = "3MVG91x_T0diigV8fsZu5XsZ6laUs2emfHf5SW7tJI46W7Tilwn84t2HRvQPuhXq_s9K.RNM3XQF1NLBFaDgN";
  // const CLIENT_SECRET = "89ACA29E4EC15EE072FDC94FE591C016DFCBE5267926543C2447F01988E6623C";
  // const USERNAME = "daeushi_poc@force.com.ps";
  // const PASSWORD = "demo123!!ffBbVzje2sYHRgK5V2rxQ4ed0"; // 중요: 비밀번호 + 보안토큰

  const TOKEN_URL = "https://test.salesforce.com/services/oauth2/token";
  const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || "3MVG91x_T0diigV8fsZu5XsZ6laUs2emfHf5SW7tJI46W7Tilwn84t2HRvQPuhXq_s9K.RNM3XQF1NLBFaDgN";
  const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || "89ACA29E4EC15EE072FDC94FE591C016DFCBE5267926543C2447F01988E6623C";
  const USERNAME = process.env.SALESFORCE_USERNAME || "daeushi_poc@force.com.ps";
  const PASSWORD = process.env.SALESFORCE_PASSWORD || "demo123!!ffBbVzje2sYHRgK5V2rxQ4ed0"; // 중요: 비밀번호 + 보안토큰

  // CORS 헤더 설정 (모든 요청에 대해 먼저 설정)
  // 허용할 특정 오리진을 명시하는 것이 보안에 좋습니다.
  res.setHeader('Access-Control-Allow-Origin', 'https://kevinbj0.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Pre-flight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("username", USERNAME);
  params.append("password", PASSWORD);

  try {
    const apiResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await apiResponse.json();

    // Salesforce로부터 받은 응답이 성공적이지 않다면,
    // Vercel 서버 로그에 에러를 기록하고 클라이언트에게도 에러 내용을 전달합니다.
    if (!apiResponse.ok) {
      console.error("Salesforce API Error:", data); // 서버 로그에 상세 에러 기록
      return res.status(apiResponse.status).json({
        error: "Salesforce authentication failed",
        error_details: data
      });
    }
    
    // 성공 시, 토큰 데이터를 클라이언트에 전달
    res.status(200).json(data);

  } catch (error) {
    console.error("Internal Server Error:", error); // 내부 에러 로깅
    res.status(500).json({ error: "Internal Server Error" });
  }
}
