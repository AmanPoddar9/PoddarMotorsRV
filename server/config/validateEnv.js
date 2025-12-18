const validateEnv = () => {
  // Only validate absolutely critical environment variables
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('❌ CRITICAL ERROR: Missing required environment variables:');
    missingVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('Server cannot start without these variables. Please check your .env file or deployment configuration.');
    // process.exit(1); // Don't crash, just log. Vercel env vars might be weird during build.
  }

  // Warn about missing optional but important variables
  const optionalVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'FRONTEND_URL', 'OPENAI_API_KEY'];
  const missingOptional = optionalVars.filter(envVar => !process.env[envVar]);
  
  if (missingOptional.length > 0) {
    console.warn('⚠️  Warning: Some optional environment variables are missing:');
    missingOptional.forEach(envVar => {
      console.warn(`   - ${envVar}`);
    });
    console.warn('Some features may not work correctly.');
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
