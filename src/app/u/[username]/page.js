import { getUserByUsername } from "@/lib/graphql";
import { getMetaValue } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Github, Twitter, Facebook, Linkedin } from "lucide-react";

// This function generates dynamic metadata for the page
export async function generateMetadata({ params }) {
  const { username } = params;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return {
        title: "User Not Found",
        description: "The user you are looking for does not exist.",
      };
    }

    const name = getMetaValue(user.userMeta, "name") || username;
    const bio = getMetaValue(user.userMeta, "bio");

    return {
      title: `${name} (@${username}) | ${process.env.APP_NAME || 'Moly'}`,
      description: bio || `Check out the profile and submissions of ${name} on ${process.env.APP_NAME || 'Moly'}.`,
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Failed to load user profile.",
    };
  }
}

function SocialLink({ icon, href }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
      {icon}
    </a>
  );
}

export default async function UserProfilePage({ params }) {
  const { username } = params;
  let user;

  try {
    user = await getUserByUsername(username);
  } catch (error) {
    // Next.js automatically deduplicates fetch requests, so this won't be a second call.
    console.error("Failed to fetch user profile:", error);
  }

  if (!user) {
    notFound();
  }

  const name = getMetaValue(user.userMeta, "name");
  const avatarUrl = getMetaValue(user.userMeta, "avatar");
  const bio = getMetaValue(user.userMeta, "bio");
  const website = getMetaValue(user.userMeta, "website");
  const x = getMetaValue(user.userMeta, "x");
  const github = getMetaValue(user.userMeta, "github");
  const linkedin = getMetaValue(user.userMeta, "linkedin");
  const facebook = getMetaValue(user.userMeta, "facebook");

  return (
    <main className="max-w-screen-md mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-32 w-32 mb-6">
          <AvatarImage src={avatarUrl || ""} alt={`${name}'s avatar`} className="object-cover" />
          <AvatarFallback className="text-5xl">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="text-lg text-muted-foreground mt-1">@{username}</p>
        
        {bio && (
          <p className="mt-4 max-w-prose">{bio}</p>
        )}

        <div className="flex items-center space-x-4 mt-6">
          <SocialLink href={website} icon={<Globe className="h-5 w-5" />} />
          <SocialLink href={x} icon={<Twitter className="h-5 w-5" />} />
          <SocialLink href={github} icon={<Github className="h-5 w-5" />} />
          <SocialLink href={linkedin} icon={<Linkedin className="h-5 w-5" />} />
          <SocialLink href={facebook} icon={<Facebook className="h-5 w-5" />} />
        </div>
      </div>

      {/* TODO: Add a section to display the websites submitted by this user */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Submitted Websites</h2>
        <div className="text-center text-muted-foreground">
          <p>(Coming Soon)</p>
        </div>
      </div>
    </main>
  );
}