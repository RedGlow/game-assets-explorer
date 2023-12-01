import prisma from "./prisma";

export async function isAllowed(email: string) {
  // const u = await prisma.allowedUsers.findUnique({
  //   where: {
  //     email,
  //   },
  // });
  // return !!u;
  return email == "mattia.belletti@gmail.com";
}
