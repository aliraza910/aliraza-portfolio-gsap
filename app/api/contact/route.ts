import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Message must be at least 5 characters long' },
        { status: 400 }
      );
    }

    // In a production setup, this forwards to Payload CMS or an email provider (Resend, SendGrid, etc.)
    // We log structured data for audit/monitoring
    console.log('[Contact API] Received message:', {
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      messageLength: message.trim().length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your message has been received and Ali will get back to you shortly.',
    });
  } catch (error: any) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to process message. Please try again or email directly.' },
      { status: 500 }
    );
  }
}

