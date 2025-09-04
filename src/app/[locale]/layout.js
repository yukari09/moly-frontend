// This is the new root layout.
// It applies to all routes and just sets up the html and body tags.
// The actual layout for different sections is handled by layouts in route groups.

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}
