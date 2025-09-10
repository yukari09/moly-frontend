import { Geist } from "next/font/google";
import "./../admin.css"; // Use the existing globals.css
import AuthProvider from "@/components/auth-provider";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Middleware now handles unauthenticated access, so the session is guaranteed to exist here.
  const currentUser = {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image,
    username: session.user.username, // Now available
    roles: session.user.roles,       // Now available
  };

  return (
    <html lang="en" className={geist.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}