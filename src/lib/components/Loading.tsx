import { AiOutlineLoading } from 'react-icons/ai';

export function Loading(
  iconProps: React.PropsWithChildren<typeof AiOutlineLoading>
) {
  return (
    <AiOutlineLoading
      {...iconProps}
      className={`animate-spin ${iconProps.className}`}
    />
  );
}
