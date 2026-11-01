// src/app.jsx(React JSX)를 브라우저에서 바로 도는 index.html 한 파일로 만들어요.  사용: npm install && npm run build
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const Babel=require('@babel/standalone');
let src=fs.readFileSync(path.join(ROOT,'src/app.jsx'),'utf8');
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
<link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
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
console.log('built',fs.statSync(path.join(ROOT,'index.html')).size);
