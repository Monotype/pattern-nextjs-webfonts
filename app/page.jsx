import localFont from "next/font/local";
const myFont=localFont({src:"../public/fonts/MyFont.woff2"});
export default function Page(){return <h1 className={myFont.className}>Next.js Webfonts Pattern</h1>}
