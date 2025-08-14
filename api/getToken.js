export default async function handler(req, res) {
  // 환경 변수 사용을 강력히 권장합니다.
  // 이 값들은 Vercel 프로젝트 설정에 환경 변수로 등록해야 합니다.
  // const TOKEN_URL = "https://test.salesforce.com/services/oauth2/token";
  // const CLIENT_ID = "3MVG91x_T0diigV8fsZu5XsZ6laUs2emfHf5SW7tJI46W7Tilwn84t2HRvQPuhXq_s9K.RNM3XQF1NLBFaDgN";
  // const CLIENT_SECRET = "89ACA29E4EC15EE072FDC94FE591C016DFCBE5267926543C2447F01988E6623C";
  // const USERNAME = "daeushi_poc@force.com.ps";
  // const PASSWORD = "demo123!!ffBbVzje2sYHRgK5V2rxQ4ed0"; // 중요: 비밀번호 + 보안토큰

  const TOKEN_URL = "https://test.salesforce.com/services/oauth2/token";
  const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
  const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
  const USERNAME = process.env.SALESFORCE_USERNAME;
  const PASSWORD = process.env.SALESFORCE_PASSWORD; // 중요: 비밀번호 + 보안토큰


  // const allowedOrigins = [
  //   'https://kevinbj0.github.io',
  //   'https://seungjun124.github.io', // 여기에 다른 github.io 주소를 추가하세요.
  //   'http://localhost:3000' // 로컬 개발 환경 테스트용
  // ];
  // const origin = req.headers.origin;

  // // 2. 요청의 origin이 허용된 목록에 있는지 확인합니다.
  // if (allowedOrigins.includes(origin)) {
  //   // 3. 만약 있다면, 해당 origin을 헤더에 설정합니다.
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // } else {
  //   // 허용되지 않은 origin의 요청은 여기서 처리하거나 무시할 수 있습니다.
  // }
  res.setHeader('Access-Control-Allow-Origin', 'https://kevinbj0.github.io');
  // CORS 헤더 설정 (모든 요청에 대해 먼저 설정)
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
        error_details: data,
        data: Object.fromEntries(params)
      });
    }
    
    // 성공 시, 토큰 데이터를 클라이언트에 전달
    res.status(200).json(data);

  } catch (error) {
    console.error("Internal Server Error:", error); // 내부 에러 로깅
    res.status(500).json({ error: "Internal Server Error" });
  }
}
