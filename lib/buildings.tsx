import { call } from ".";
import { getClassroomsForBuilding } from "@ilefa/husky";

import {
   BuildingAddresses,
   BuildingCode,
   BuildingDescriptions,
   BuildingMaps,
   SiteOrUnknown,
   detectSiteFromBuilding,
} from "~/util";

export type Building = {
   name: string;
   code: string;
   campus: SiteOrUnknown;
   description: string;
   address: string;
   maps: string;
   statistics: {
      classrooms: number;
      events: number;
   };
};

type SignMeta = {
   name: string;
   slug: string;
   items: number;
};

type SignStatsResponse = {
   stats: SignMeta[];
};

export const getBuildings = async (
   withClassrooms = true,
): Promise<Building[]> => {
   let signs = await call<SignStatsResponse>("GET", "/sign/stats")
      .then((res) => res.stats)
      .catch(() => []);

   let grouped = signs.reduce(
      (acc, sign) => {
         let building = sign.name.split("_")[0];
         if (!acc[building]) acc[building] = 0;
         acc[building] += sign.items;
         return acc;
      },
      {} as Record<string, number>,
   );

   let buildings = Object.entries(BuildingCode).map(([code, name]) => {
      let buildingCode = code as keyof typeof BuildingCode;
      let classrooms = getClassroomsForBuilding("code", code).length;
      let events = classrooms > 0 ? grouped[code] || 0 : 0;

      return {
         name: name,
         code: code,
         campus: detectSiteFromBuilding(buildingCode),
         description: BuildingDescriptions[buildingCode],
         address: BuildingAddresses[buildingCode],
         maps: BuildingMaps[buildingCode],
         statistics: { classrooms, events },
      };
   });

   if (withClassrooms) buildings = buildings.filter(building => building.statistics.classrooms > 0);

   return buildings;
};
