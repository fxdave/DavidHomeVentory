import "dotenv/config";

export const CONFIG = {
  JWT_SECRET: getEnvOrDie("JWT_SECRET"),
};

function getEnvOrDie(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`The env variable '${key}' is required`);
  return value;
}
