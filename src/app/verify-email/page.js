"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { data: session, update: updateSession } = useSession();
  
  // State for the verification process itself
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  // Effect 1: Perform the API call for verification.
  // This runs only when the 'token' from the URL changes.
  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Verification token is missing. Please check the link in your email.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed.');
        }
        
        setVerificationStatus('success');
        setMessage('Your email has been successfully verified! You can now use all features.');
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.message);
      }
    };

    verifyToken();
  }, [token]);

  // Effect 2: Update the user's session after successful verification.
  // This runs when verificationStatus or the session itself changes.
  useEffect(() => {
    // If verification was successful AND the user is logged in AND their status isn't already active
    if (verificationStatus === 'success' && session && session.user?.status !== 'active') {
      // We only need to update the status field
      updateSession({ user: { status: 'active' } });
    }
  }, [verificationStatus, session, updateSession]);

  return (
    <div className="flex items-center justify-center py-24 bg-white">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            {verificationStatus === 'verifying' && <Loader2 className="h-12 w-12 animate-spin text-gray-500" />}
            {verificationStatus === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
            {verificationStatus === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            <p className="text-lg">{message}</p>
            {verificationStatus === 'success' && (
               <Link href="/submit" className="text-blue-500 underline">
                Go to Submit Page
              </Link>
            )}
            {verificationStatus === 'error' && (
              <Link href="/login" className="text-blue-500 underline">
                Go to Login
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}