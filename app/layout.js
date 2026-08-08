import "./style.css";

export const metadata = {
  title: "个人实验场 / 00",
  description: "一块可以慢慢生长的个人实验场。",
  icons: {
    icon: "/favicon.svg"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <noscript>
          <p className="noscript">请启用脚本以显示页面并使用信号场互动。</p>
        </noscript>
      </body>
    </html>
  );
}
