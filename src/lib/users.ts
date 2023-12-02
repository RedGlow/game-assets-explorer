export async function isAllowed(email: string) {
  const allowedEmails = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .filter((x) => x);
  return allowedEmails.indexOf(email) >= 0;
}
