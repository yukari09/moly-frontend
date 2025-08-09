"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import debounce from "lodash.debounce";

// Debounced username check function
const checkUsernameAvailability = debounce(async (username, originalUsername, resolve) => {
  if (!username || username === originalUsername) return resolve(true);
  try {
    const res = await fetch('/api/user/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    resolve(!data.isNotAvailable);
  } catch (error) {
    logger.error("Username check failed:", error);
    resolve(false);
  }
}, 500);

const createProfileSchema = (originalUsername) => z.object({
  name: z.string().min(1, "Display name is required.").max(50, "Display name must be at most 50 characters."),
  username: z.string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(/^[a-z0-9_.]+$/, "Username can only contain lowercase letters, numbers, underscores, and dots.")
    .superRefine(async (username, ctx) => {
      const isAvailable = await new Promise((resolve) => {
        checkUsernameAvailability(username, originalUsername, resolve);
      });
      if (!isAvailable) {
        ctx.addIssue({
          code: "custom",
          message: "This username is already taken.",
          path: ["username"],
        });
      }
    }),
  bio: z.string().max(160, "Bio must be at most 160 characters.").optional(),
});

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hostname, setHostname] = useState("");
  const avatarFileRef = useRef(null);

  // @ts-ignore
  const userMeta = session?.user?.userMeta;
  const hasChangedUsername = getMetaValue(userMeta, "has_been_changed_username") === 'true';
  const originalUsername = getMetaValue(userMeta, "username") || "";

  const form = useForm({
    resolver: zodResolver(createProfileSchema(originalUsername)),
    defaultValues: {
      name: getMetaValue(userMeta, "name") || "",
      username: originalUsername,
      bio: getMetaValue(userMeta, "bio") || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values) => {
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

      const userMetaPayload = Object.entries(values).map(([key, value]) => ({ metaKey: key, metaValue: value }));
      if (finalAvatarUrl) {
        userMetaPayload.push({ metaKey: "avatar", metaValue: finalAvatarUrl });
      }
      if (!hasChangedUsername && values.username !== originalUsername) {
        userMetaPayload.push({ metaKey: "has_been_changed_username", metaValue: "true" });
      }

      logger.info("Submitting profile update:", userMetaPayload);

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMetaPayload),
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "An error occurred.");

      const updatedUserMeta = result.user.userMeta;
      await updateSession({ user: { userMeta: updatedUserMeta } });

      toast.success("Profile updated successfully!");
      setAvatarPreview(null);
      form.reset(values);

    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };
  
  const name = getMetaValue(userMeta, "name");
  const avatarUrl = getMetaValue(userMeta, "avatar");
  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || avatarUrl || ""} alt="User avatar" className="object-cover" />
                <AvatarFallback>{name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <input type="file" accept="image/jpeg,image/png,image/webp" ref={avatarFileRef} onChange={handleAvatarChange} className="hidden" />
              <Button type="button" variant="outline" onClick={() => avatarFileRef.current?.click()} disabled={isSubmitting}>Change Avatar</Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label>Username</Label>
                <FormControl>
                  <div className="flex rounded-md items-center gap-0.5">
                    <span className="opacity-60 text-sm">
                      https://{hostname}/u/
                    </span>
                    <Input
                      className="max-w-sm" 
                      placeholder="your-username" 
                      {...field} 
                      disabled={isSubmitting || hasChangedUsername} 
                    />
                  </div>
                </FormControl>
                {hasChangedUsername ? (
                  <p className="text-sm text-muted-foreground mt-2">Username can only be changed once.</p>
                ) : (
                  <FormMessage className="mt-2" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Display Name</Label>
                <FormControl><Input {...field} /></FormControl>
                <p className="text-sm text-muted-foreground">Please enter your full name, or a display name you are comfortable with.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <Label>Bio</Label>
                <FormControl><Textarea placeholder="I'm a developer who loves..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}