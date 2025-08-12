import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        console.log('Attempting to send email to:', sendTo);
        console.log('Email subject:', subject);
        
        const { data, error } = await resend.emails.send({
            from: 'Binkeet <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(`Email sending failed: ${error.message}`);
        }

        console.log('Email sent successfully:', data);
        return data
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

export default sendEmail

