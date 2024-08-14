import http from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename과 __dirname을 ES 모듈에서 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 8000; // 인스턴스 생성 시 설정한 포트번호 기입

app.get("/ping", (req, res) => {
  res.send("pong");
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Date: Date.now()
  });
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.createServer(app).listen(port, () => {
  console.log(`app listening at ${port}`);
});

