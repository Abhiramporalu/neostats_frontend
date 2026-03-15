import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

      <nav style={{
  background: "#2563eb",
  color: "white",
  padding: "10px 20px",
  display: "flex",
  gap: "20px",
  fontWeight: "bold"
}}>
  <a href="/" style={{color:"white", textDecoration:"none"}}>Home</a>
  <a href="/submit" style={{color:"white", textDecoration:"none"}}>Submit</a>
  <a href="/cases" style={{color:"white", textDecoration:"none"}}>Cases</a>
  <a href="/polls" style={{color:"white", textDecoration:"none"}}>Polls</a>
  <a href="/analytics" style={{color:"white", textDecoration:"none"}}>Analytics</a>
</nav>
        <div style={{padding:"20px"}}>
          {children}
        </div>

      </body>
    </html>
  )
}