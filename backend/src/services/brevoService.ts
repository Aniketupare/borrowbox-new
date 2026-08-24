export const sendPasswordResetEmail = async (toEmail: string, resetUrl: string) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM || 'borrowboxhub@gmail.com';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured in environment variables');
  }

  const payload = {
    sender: {
      name: 'BorrowBox',
      email: senderEmail
    },
    to: [
      {
        email: toEmail
      }
    ],
    subject: 'Reset your BorrowBox password',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">BorrowBox Password Reset</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
          You requested a password reset for your BorrowBox account. Click the button below to reset your password:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
          If you did not request this password reset, please ignore this email. This link is valid for 1 hour.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; paddingTop: 12px;">
          &copy; ${new Date().getFullYear()} BorrowBox. All rights reserved.
        </p>
      </div>
    `
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Brevo API error:', errText);
    throw new Error('Failed to send reset email');
  }

  return await response.json();
};
