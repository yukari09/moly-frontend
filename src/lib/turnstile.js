export async function verifyTurnstileToken(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY is not set in environment variables.");
    return false;
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  try {
    const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(verificationUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}
