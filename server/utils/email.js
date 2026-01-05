const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use host/port for other providers
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 2) Define the email options
    const mailOptions = {
      from: `Poddar Motors <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${options.email}`);
  } catch (err) {
    console.error('Email send error:', err);
    // We do NOT throw error here to avoid breaking the main flow if email fails
  }
};

module.exports = sendEmail;

// Keep the old mock function if needed, or replace usages
exports.sendRequirementMatchEmail = async (to, customerName, listing) => {
  const subject = `Good News ${customerName}! We found a car for you!`;
  const message = `
    Hi ${customerName},

    A new car matching your requirements has just been listed:
    🚗 ${listing.brand} ${listing.model} ${listing.variant} (${listing.year})
    💰 Price: ₹${listing.price.toLocaleString('en-IN')}

    Check it out here: https://www.poddarmotors.com/buy/${listing.slug}

    Best regards,
    Poddar Motors Team
  `;
  
  await sendEmail({
    email: to,
    subject: subject,
    message: message
  });
};
