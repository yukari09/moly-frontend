import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
  }

  const changePasswordMutation = {
    query: `
      mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(input: $input) {
          success
          errors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        currentPassword: currentPassword,
        password: newPassword,
        passwordConfirmation: confirmPassword,
      },
    },
  };

  try {
    const res = await fetch(process.env.GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(changePasswordMutation),
    });

    const data = await res.json();

    if (!res.ok || data.errors || data.data?.changePassword?.errors) {
        const apiErrors = data.data?.changePassword?.errors || data.errors;
        const errorMessage = apiErrors?.[0]?.message || "Failed to change password.";
        return NextResponse.json({ error: errorMessage }, { status: res.status === 200 ? 400 : res.status });
    }

    return NextResponse.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error("Error in /api/user/change-password:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
