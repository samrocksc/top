import "dotenv/config";

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Not found");
console.log(
  "All env vars:",
  Object.keys(process.env).filter((key) => key.includes("DATABASE")),
);
