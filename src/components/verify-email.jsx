"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';


export function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const callbackUrl = searchParams.get('callbackUrl');
  const { data: session, update: updateSession } = useSession();
  const t = useTranslations('VerifyEmailPage');
  
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState(t('verifyingMessage'));

  // Effect 1: Perform the API call for verification.
  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage(t('tokenMissingError'));
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || t('verificationFailed'));
        }
        
        setVerificationStatus('success');
        setMessage(t('verificationSuccess'));
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.message);
      }
    };

    verifyToken();
  }, [token, t]);

  // Effect 2: Update the user's session after successful verification.
  useEffect(() => {
    if (verificationStatus === 'success' && session && session.user?.status !== 'active' && !sessionUpdated) {
      updateSession({ user: { status: 'active' } });
      setSessionUpdated(true);
    }
  }, [verificationStatus, session, updateSession, sessionUpdated]);

  return (
    <div className="flex items-center justify-center py-24">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            {verificationStatus === 'verifying' && <Loader2 className="h-12 w-12 animate-spin text-gray-500" />}
            {verificationStatus === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
            {verificationStatus === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            <p className="text-lg">{message}</p>
            {verificationStatus === 'success' && (
               <Link href={callbackUrl || '/login'} className="text-blue-500 underline">
                {callbackUrl ? t('continueButton') : t('goToLoginButton')}
              </Link>
            )}
            {verificationStatus === 'error' && (
              <Link href="/login" className="text-blue-500 underline">
                {t('goToLoginButton')}
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}