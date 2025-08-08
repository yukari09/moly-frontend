"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
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

        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex items-center justify-center py-24 bg-white">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === 'verifying' && <Loader2 className="h-12 w-12 animate-spin text-gray-500" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            <p className="text-lg">{message}</p>
            {status !== 'verifying' && (
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