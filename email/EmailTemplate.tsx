export const Verification_Email_Template = ( code: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verification Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #FF9324;
        color: #fff;
        padding: 15px;
        font-size: 22px;
        font-weight: bold;
        border-radius: 6px;
      }
      .code {
        font-size: 28px;
        margin: 25px 0;
        background: #f0f0f0;
        padding: 12px 24px;
        display: inline-block;
        border-radius: 6px;
        letter-spacing: 4px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Verify Your Email</div>
      <p>Use the verification code below to activate your account:</p>
       <div class="code">${code}</div>
      <p>This code will expire in 1 hour.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Reels_Pro
      </div>
    </div>
  </body>
  </html>
`;




export const SEND_EMAIL_LINK = (link:string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333;
          }
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
          }
          .email-header {
              text-align: center;
              margin-bottom: 20px;
          }
          .email-header h2 {
              color: #4CAF50;
              margin-bottom: 10px;
          }
          .email-body p {
              color: #444;
          }
          .email-button {
              text-align: center;
              margin: 20px 0;
          }
          .email-button a {
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              color: #fff;
              background-color: #4CAF50;
              text-decoration: none;
              border-radius: 5px;
          }
          .email-footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
          }
          .email-footer a {
              color: #4CAF50;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <h2>Password Reset Request</h2>
              <p>We're here to help you reset your password securely.</p>
          </div>
          <div class="email-body">
              <p>Hello,</p>
              <p>
                  We received a request to reset your password. To proceed, please click the button below. This link will expire in <strong>30 minutes</strong>.
              </p>
          </div>
          <div class="email-button">
              <a href="${link}" target="_blank">
                  Reset Your Password
              </a>
          </div>
          <div class="email-body">
              <p>If you did not request this, you can safely ignore this email.</p>
              <p>Thank you,<br><strong>Reels_Pro</strong></p>
          </div>
          <hr>
          <div class="email-footer">
              <p>
                  If you are having trouble clicking the button, copy and paste the link below into your browser:<br>
                  <a href="${link}" target="_blank">${link}</a>
              </p>
          </div>
      </div>
  </body>
  </html>
`;
