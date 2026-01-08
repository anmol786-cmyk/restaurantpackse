'use client';

import { ContactForm, ContactFormData } from './contact-form';

interface ContactFormWrapperProps {
  className?: string;
}

export function ContactFormWrapper({ className }: ContactFormWrapperProps) {
  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Failed to send contact form:', result);
        throw new Error(result.error || 'Failed to send message');
      }

      console.log('✅ Contact form sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  };

  return <ContactForm onSubmit={handleFormSubmit} className={className} />;
}
