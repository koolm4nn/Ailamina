import statusJson from "@/app/data/status.json";
import bodyConditionsJson from "@/app/data/bodyConditions.json";
import breedingQualitiesJson from "@/app/data/breedingQualities.json";
import commonNamesJson from "@/app/data/commonNames.json";
import familiesJson from "@/app/data/families.json";
import featherConditionsJson from "@/app/data/featherConditions.json";
import genusJson from "@/app/data/genus.json";
import ordersJson from "@/app/data/orders.json";
import sexJson from "@/app/data/sex.json";
import speciesJson from "@/app/data/species.json";
import subspeciesJson from "@/app/data/subspecies.json";

import { normalizeJsonData } from "@/lib/utils/jsonUtils";

// Normalize jsons
export const statusData = normalizeJsonData(statusJson);
export const bodyConditionsData = normalizeJsonData(bodyConditionsJson);
export const breedingQualitiesData = normalizeJsonData(breedingQualitiesJson);
export const commonNamesData = normalizeJsonData(commonNamesJson);
export const familiesData = normalizeJsonData(familiesJson);
export const featherConditionsData = normalizeJsonData(featherConditionsJson);
export const genusData = normalizeJsonData(genusJson);
export const ordersData = normalizeJsonData(ordersJson);
export const sexData = normalizeJsonData(sexJson);
export const speciesData = normalizeJsonData(speciesJson);
export const subspeciesData = normalizeJsonData(subspeciesJson);
