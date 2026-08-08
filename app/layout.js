import "./style.css";

export const metadata = {
  title: "wly0829.cn — Public workbench",
  description: "A quiet public frame for experiments, notes and small tools.",
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
    <html lang="en">
      <body>
        {children}
        <noscript>
          <p className="noscript">The frame works without scripts; only the signal field stays still.</p>
        </noscript>
      </body>
    </html>
  );
}
