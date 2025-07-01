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
