import { auth } from '@/auth';

export default async function NotAllowed() {
  const session = await auth();
  return <p>
    User with mail {session?.user?.email} is not allowed to access this service.
  </p>;
}
