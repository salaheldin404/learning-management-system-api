
function forgotPasswordTemplate(
  username: string,
  resetUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              <!-- Header / Brand -->
              <tr>
                <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; font-family: system-ui, sans-serif;">LMS Portal</h1>
                  <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; font-family: system-ui, sans-serif;">Learning Management System</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; font-family: system-ui, sans-serif;">Hello ${username},</h2>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; font-family: system-ui, sans-serif;">
                    We received a request to reset your password for your LMS account. Don't worry, we've got you covered! Click the button below to choose a new password.
                  </p>
                  
                  <!-- Call to Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3); font-family: system-ui, sans-serif;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Security Information -->
                  <div style="background-color: #f1f5f9; border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                    <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.5; font-weight: 500; font-family: system-ui, sans-serif;">
                      <strong>Important Security Notice:</strong> This link will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
                    </p>
                  </div>

                  <!-- Fallback Link -->
                  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 0; font-family: system-ui, sans-serif;">
                    If the button above doesn't work, copy and paste this URL into your browser:
                    <br>
                    <a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline; word-break: break-all; font-family: system-ui, sans-serif;">${resetUrl}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 25px 40px 40px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0; font-family: system-ui, sans-serif;">
                    &copy; 2026 LMS Portal. All rights reserved.
                  </p>
                  <p style="color: #cbd5e1; font-size: 11px; margin: 0; font-family: system-ui, sans-serif;">
                    This is an automated security email. Please do not reply directly to this message.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export default forgotPasswordTemplate;