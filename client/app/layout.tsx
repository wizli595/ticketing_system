import MainLayout from "@/layouts/Main-layout";
import "bootstrap/dist/css/bootstrap.min.css";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body>
        <MainLayout>
          {children}
        </MainLayout>
        </body>
    </html>
  )
}
