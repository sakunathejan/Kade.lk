import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const passwordResetTemplateId = process.env.REACT_APP_EMAILJS_PASSWORD_RESET_TEMPLATE_ID || templateId; // Fallback to main template

console.log('🔧 EmailJS Configuration:', {
  publicKey: publicKey ? '✅ Set' : '❌ Missing',
  serviceId: serviceId ? '✅ Set' : '❌ Missing',
  templateId: templateId ? '✅ Set' : '❌ Missing',
  passwordResetTemplateId: passwordResetTemplateId ? '✅ Set' : '❌ Missing'
});

emailjs.init(publicKey);

interface EmailData {
  to_email: string;
  to_name: string;
  user_id: string;
  temp_password: string;
  role: string;
}

// Test email function to debug delivery issues
export const sendTestEmail = async (toEmail: string) => {
  try {
    console.log('🧪 Sending test email to:', toEmail);
    
    const templateParams = {
      to_email: toEmail,                   // Add this - the recipient's email
      user_name: 'Test User',
      user_id: 'TEST123',
      temp_password: 'testpass123',
      login_url: `${window.location.origin}/login`,
      support_email: 'support@taprobuy.com'
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    console.log('✅ Test email sent successfully:', response);
    return { success: true, message: 'Test email sent successfully' };
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return { success: false, message: `Failed to send test email: ${error}` };
  }
};

export const sendWelcomeEmail = async (emailData: EmailData) => {
  try {
    console.log('📧 Attempting to send welcome email...');
    console.log('📧 Email data:', emailData);
    console.log('📧 Recipient email:', emailData.to_email);
    
    if (!publicKey || !serviceId || !templateId) {
      console.error('❌ EmailJS configuration missing:', { publicKey, serviceId, templateId });
      return { 
        success: false, 
        message: 'EmailJS not configured. Please check your environment variables.' 
      };
    }

    const templateParams = {
      to_email: emailData.to_email,        // Add this - the recipient's email
      user_name: emailData.to_name,        // Changed from to_name to user_name
      user_id: emailData.user_id,
      temp_password: emailData.temp_password,
      login_url: `${window.location.origin}/login`,
      support_email: 'support@taprobuy.com'  // Added missing support_email
    };

    console.log('📧 Template params:', templateParams);
    console.log('📧 EmailJS Config:', { serviceId, templateId, publicKey: publicKey ? 'Set' : 'Missing' });

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    console.log('✅ EmailJS Response Status:', response.status);
    console.log('✅ EmailJS Response Text:', response.text);
    
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, message: `Failed to send welcome email: ${error}` };
  }
};

export const sendPasswordResetEmail = async (emailData: EmailData) => {
  try {
    console.log('🔑 Attempting to send password reset email...');
    console.log('🔑 Email data:', emailData);
    
    if (!publicKey || !serviceId || !passwordResetTemplateId) {
      console.error('❌ EmailJS configuration missing:', { publicKey, serviceId, passwordResetTemplateId });
      return { 
        success: false, 
        message: 'EmailJS not configured. Please check your environment variables.' 
      };
    }

    const templateParams = {
      to_email: emailData.to_email,
      user_name: emailData.to_name,
      user_id: emailData.user_id,
      new_password: emailData.temp_password,  // Changed to match template
      login_url: `${window.location.origin}/login`,
      support_email: 'support@taprobuy.com'
    };

    console.log('🔑 Template params:', templateParams);

    const response = await emailjs.send(
      serviceId,
      passwordResetTemplateId,
      templateParams
    );

    console.log('✅ Password reset email sent successfully:', response);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, message: `Failed to send password reset email: ${error}` };
  }
};
