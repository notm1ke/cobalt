import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tryUnsafeResolve } from '~/lib/buildings';
import { InspectorBootstrap } from '~/components/buildings/InspectorBootstrap';

type InspectorPageParams = {
    params: { name: string }
};

export async function generateMetadata({ params: { name } }: { params: { name: string } }): Promise<Metadata> {
    const building = await tryUnsafeResolve(name);
    if (!building) return notFound();
    return { title: building.name, description: building.description };
}

const InspectorPageRoot = ({ params: { name } }: InspectorPageParams) => <InspectorBootstrap query={name} />;

export default InspectorPageRoot;