// src/app.jsx(React JSX)를 브라우저에서 바로 도는 index.html 한 파일로 만들어요.  사용: npm install && npm run build
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const Babel=require('@babel/standalone');
let src=fs.readFileSync(path.join(ROOT,'src/app.jsx'),'utf8');
// 버전 표시: 소스·스타일·아이콘 내용으로 만든 짧은 해시. version.json에도 같이 써서, 열려 있는 앱이 새 버전을 알아채요.
const crypto=require('crypto');
const BUILD_ID=(()=>{ const h=crypto.createHash('sha1'); h.update(src); h.update(fs.readFileSync(path.join(ROOT,'src/splash.css')));
  fs.readdirSync(path.join(ROOT,'icons')).sort().forEach(f=>h.update(fs.readFileSync(path.join(ROOT,'icons',f))));
  return h.digest('hex').slice(0,10); })();
src=src.replace('const BUILD_ID="dev";','const BUILD_ID='+JSON.stringify(BUILD_ID)+';');
src=src.replace('import { useState, useRef, useEffect } from "react";','const { useState, useRef, useEffect } = React;')
       .replace('export default function App()','function App()');
src+='\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));\n';
const splashCss=fs.readFileSync(path.join(ROOT,'src/splash.css'),'utf8');
const out=Babel.transform(src,{presets:[['react',{runtime:'classic'}]]}).code;
const page=(scripts)=>`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2152E6">
<!-- 폰 브라우저의 "강제 다크 모드"가 색을 멋대로 뒤집지 않게 (앱이 직접 정한 색만 써요) -->
<meta name="color-scheme" content="only light">
<link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png?v=${BUILD_ID}">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png?v=${BUILD_ID}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preload" href="fonts/Fredoka.ttf" as="font" type="font/ttf" crossorigin>
<meta name="apple-mobile-web-app-title" content="SSTC">
<title>SSTC · Serve &amp; Smash Tennis Club</title>
<style>body{margin:0;background:#E9EDFA;color:#1B2559}
${splashCss}</style>
</head>
<body>
<div id="root"></div>
${scripts}
<script>
${out}
</script>
</body>
</html>
`;
const cdn=p=>`<script src="https://cdnjs.cloudflare.com/ajax/libs/${p}"></script>`;
fs.writeFileSync(path.join(ROOT,'index.html'),page([
  '<!-- 공유 저장: 파이어베이스 Realtime Database (club/ 경로) -->',
  cdn('firebase/10.12.2/firebase-app-compat.min.js'),
  cdn('firebase/10.12.2/firebase-database-compat.min.js'),
  cdn('firebase/10.12.2/firebase-auth-compat.min.js'),
  '<script src="firebase-config.js"></script>',
  cdn('react/18.3.1/umd/react.production.min.js'),
  cdn('react-dom/18.3.1/umd/react-dom.production.min.js')].join('\n')));
fs.writeFileSync(path.join(ROOT,'version.json'),JSON.stringify({build:BUILD_ID})+'\n');
console.log('built',fs.statSync(path.join(ROOT,'index.html')).size);
