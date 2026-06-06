import type { NextApiRequest, NextApiResponse } from 'next';

const CONTACT_EMAIL = 'myleslewisyoung@gmail.com';

function isFormSubmitSuccess(success: unknown) {
  return success === true || success === 'true';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:8887';
  const origin = `${protocol}://${host}`;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: `${origin}/`,
        Origin: origin,
      },
      body: JSON.stringify({
        name: fullName,
        email,
        subject,
        message,
        _replyto: email,
        _subject: `Wulfrun Contact: ${subject}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const raw = await response.text();
    let data: { success?: unknown; message?: string } = {};

    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({ message: 'Unexpected response from email service' });
    }

    if (!isFormSubmitSuccess(data.success)) {
      return res.status(400).json({
        message: data.message || 'Failed to send email',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form email failed:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
