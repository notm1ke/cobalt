import Link from 'next/link';

import { Button } from '../ui/button';
import { BuildingListing } from '~/lib/buildings';
import { Card, CardContent } from '../ui/card';
import { BuildingCode, MdiIcon, capitalizeFirst, getIconForBuilding } from '~/util';
import { mdiFlag, mdiHumanMaleBoard, mdiInformationBox, mdiMapMarker } from '@mdi/js';

export interface BuildingCardProps {
    building: BuildingListing;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden min-w-[425px] max-w-[425px]">
        <div className="bg-blue-400 p-6 flex items-center justify-center">
            {getIconForBuilding(building.code as keyof typeof BuildingCode, '', 28)}
        </div>
        <CardContent>
            <h3 className="text-lg font-mono font-bold tracking-tighter text-gray-700 mt-5">
                ({building.code}) {building.name}
            </h3>
            <p className="text-sm text-gray-600">{building.address}</p>

            <div className="flex space-x-2 mt-3">
                {
                    building.statistics.classrooms > 0 && (
                        <Button asChild className="text-[14px] font-mono text-white" variant="secondary">
                            <Link href={`/buildings/${building.code}`}>
                                <MdiIcon path={mdiHumanMaleBoard} size="18px" className="mr-2 align-text-top" />{" "}
                                Classrooms ({building.statistics.classrooms})
                            </Link>
                        </Button>
                    )
                }

                {
                    building.statistics.classrooms === 0 && (
                        <Button asChild className="text-[14px] font-mono text-white" variant="secondary">
                            <Link href={`/buildings/${building.code}`}>
                                <MdiIcon path={mdiInformationBox} size="18px" className="mr-2 align-text-top" />{" "}
                                Info
                            </Link>
                        </Button>
                    )
                }

                <Button asChild className="text-[14px] font-mono text-white" variant="secondary">
                    <a href={building.maps} target="_blank" rel="noopener noreferrer">
                        <MdiIcon path={mdiMapMarker} size="18px" className="mr-2 align-text-top" />{" "}
                        Maps
                    </a>
                </Button>
            </div>

            {
                building.campus !== 'storrs' && (
                    <div className="bg-yellow-100 border-l-4 border-r-4 border-yellow-500 p-3 mt-4 rounded-lg">
                        <p className="text-sm text-yellow-800 font-mono">
                            <MdiIcon path={mdiFlag} size="18px" className="inline mr-1 align-text-top" />{" "}
                            Located on the{" "}
                            <span className="font-medium">{capitalizeFirst(building.campus.replace('_', ' ').toLowerCase())}</span> campus
                        </p>
                    </div>
                )
            }

            <p className="text-sm text-gray-700 mt-4">
                {building.description}
            </p>
        </CardContent>
    </Card>
)