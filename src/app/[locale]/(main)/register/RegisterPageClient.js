// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { signIn, useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { Turnstile } from "@marsidev/react-turnstile";
// import { useTranslations } from "next-intl";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [turnstileToken, setTurnstileToken] = useState("");
//   const t = useTranslations('RegisterPage');
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/";  

//   const formSchema = z
//     .object({
//       email: z.string().email({ message: t("emailValidation") }),
//       password: z.string()
//         .min(8, { message: t("passwordMinLength") })
//         .regex(/[a-z]/, { message: t("passwordLowercase") })
//         .regex(/[A-Z]/, { message: t("passwordUppercase") })
//         .regex(/[0-9]/, { message: t("passwordNumber") })
//         .regex(/[^a-zA-Z0-9]/, { message: t("passwordSpecialChar") }),
//       passwordConfirmation: z.string(),
//       agreement: z.boolean().refine((val) => val === true, {
//         message: t("agreementRequired"),
//       }),
//     })
//     .refine((data) => data.password === data.passwordConfirmation, {
//       message: t("passwordMismatch"),
//       path: ["passwordConfirmation"],
//     });

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       passwordConfirmation: "",
//       agreement: false,
//     },
//   });

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.push(callbackUrl);
//     }
//   }, [status, router, callbackUrl]);

//   const onSubmit = async (values) => {
//     setIsLoading(true);
//     try {
//       const result = await signIn("register", {
//         redirect: false,
//         email: values.email,
//         password: values.password,
//         passwordConfirmation: values.passwordConfirmation,
//         agreement: String(values.agreement),
//         turnstileToken: turnstileToken,
//       });

//       if (result.error) {
//         throw new Error(result.error);
//       }
      
//       toast.success(t("registrationSuccess"));
//       router.push("/");

//     } catch (error) {
//       toast.error(error.message || t("unexpectedError"));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center py-24 bg-white">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl">{t("title")}</CardTitle>
//           <CardDescription>
//             {t("description")}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("emailLabel")}</FormLabel>
//                     <FormControl>
//                       <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("passwordLabel")}</FormLabel>
//                     <FormControl>
//                       <Input type="password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="passwordConfirmation"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
//                     <FormControl>
//                       <Input type="password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="agreement"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center space-x-2">
//                      <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                       {t("agreementLabel")}
//                     </FormLabel>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Turnstile
//                 siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
//                 onSuccess={setTurnstileToken}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading || !turnstileToken}>
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {t("createAccountButton")}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter>
//            <div className="text-center text-sm w-full">
//             {t("alreadyHaveAccountPrompt")}{" "}
//             <Link href="/login" className="underline">
//               {t("loginLink")}
//             </Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
