const requiredEnvVars = ["PORT", "MONGO_URI", "CLIENT_URL", "JWT_SECRET", "AI_SERVICE_URL"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

export default validateEnv;