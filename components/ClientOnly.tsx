import { useIsClient } from '@uidotdev/usehooks';

export const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const client = useIsClient();
    return client ? <>{children}</> : null;
}