"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hostname, setHostname] = useState("");
  const avatarFileRef = useRef(null);

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const profileData = Object.fromEntries(formData.entries());
    const avatarFile = avatarFileRef.current?.files?.[0];

    try {
      let finalAvatarUrl = null;

      if (avatarFile) {
        const signedUrlRes = await fetch('/api/user/avatar/request-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: avatarFile.type }),
        });
        if (!signedUrlRes.ok) throw new Error("Failed to get upload URL.");
        const resData = await signedUrlRes.json();
        finalAvatarUrl = resData.finalAvatarUrl;

        const uploadRes = await fetch(resData.signedUrl, {
          method: 'PUT',
          body: avatarFile,
          headers: { 'Content-Type': avatarFile.type },
        });
        if (!uploadRes.ok) throw new Error("Failed to upload avatar.");
      }

      const userMetaPayload = [];
      for (const key in profileData) {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          userMetaPayload.push({ metaKey: key, metaValue: profileData[key] });
        }
      }
      if (finalAvatarUrl) {
        userMetaPayload.push({ metaKey: "avatar", metaValue: finalAvatarUrl });
      }
      
      if (userMetaPayload.length === 0 && !finalAvatarUrl) {
        toast.info("No changes to save.");
        setIsSubmitting(false);
        return;
      }

      logger.info("Submitting profile update to /api/user/update:", userMetaPayload);

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMetaPayload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "An error occurred.");
      }

      const updatedUserMeta = result.user.userMeta;
      await updateSession({ user: { userMeta: updatedUserMeta } });

      toast.success("Profile updated successfully!");
      setAvatarPreview(null);

    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // @ts-ignore
  const userMeta = session?.user?.userMeta;
  const name = getMetaValue(userMeta, "name");
  const username = getMetaValue(userMeta, "username");
  const avatarUrl = getMetaValue(userMeta, "avatar"); // Directly use the full URL from session
  const bio = getMetaValue(userMeta, "bio");
  const website = getMetaValue(userMeta, "website");
  const twitter = getMetaValue(userMeta, "twitter");
  const github = getMetaValue(userMeta, "github");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-3 gap-4 items-center">
          <Label className="col-span-1 text-right">Avatar</Label>
          <div className="col-span-2 flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview || avatarUrl || ""} alt="User avatar" className="object-cover" />
              <AvatarFallback>
                {name ? name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              ref={avatarFileRef} 
              onChange={handleAvatarChange}
              className="hidden" 
            />
            <Button type="button" variant="outline" onClick={() => avatarFileRef.current?.click()} disabled={isSubmitting}>
              Change Avatar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="username" className="col-span-1 text-right mt-2">Username</Label>
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                {hostname}/u/
              </span>
              <Input
                id="username"
                name="username"
                className="pl-24"
                defaultValue={username || ""}
                placeholder="your-username"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="name" className="col-span-1 text-right mt-2">Display Name</Label>
          <div className="col-span-2">
            <Input
              id="name"
              name="name"
              defaultValue={name || ""}
              required
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Please enter your full name, or a display name you are comfortable with.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Label htmlFor="bio" className="col-span-1 text-right mt-2">Bio</Label>
          <div className="col-span-2">
            <Textarea
              id="bio"
              name="bio"
              defaultValue={bio || ""}
              placeholder="I'm a developer who loves..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Label className="col-span-1 text-right mt-2">Social Links</Label>
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="website" className="text-sm font-normal">Website</Label>
              <Input
                id="website"
                name="website"
                defaultValue={website || ""}
                placeholder="https://your-website.com"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="text-sm font-normal">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                defaultValue={twitter || ""}
                placeholder="https://twitter.com/username"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="github" className="text-sm font-normal">GitHub</Label>
              <Input
                id="github"
                name="github"
                defaultValue={github || ""}
                placeholder="https://github.com/username"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}