// Mock email service for now
// In production, replace with Nodemailer or SendGrid

exports.sendRequirementMatchEmail = async (to, customerName, listing) => {
  console.log('---------------------------------------------------');
  console.log(`📧 [MOCK EMAIL] To: ${to}`);
  console.log(`Subject: Good News ${customerName}! We found a car for you!`);
  console.log('---------------------------------------------------');
  console.log(`Hi ${customerName},`);
  console.log('');
  console.log(`A new car matching your requirements has just been listed:`);
  console.log(`🚗 ${listing.brand} ${listing.model} ${listing.variant} (${listing.year})`);
  console.log(`💰 Price: ₹${listing.price.toLocaleString('en-IN')}`);
  console.log(`Check it out here: https://www.poddarmotors.com/buy/${listing.slug}`);
  console.log('');
  console.log('Best regards,');
  console.log('Poddar Motors Team');
  console.log('---------------------------------------------------');
  
  return true;
};
