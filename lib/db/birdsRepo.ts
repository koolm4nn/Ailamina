import { Bird } from "@/types/bird";
import { generateUUID } from "../utils/uuidUtils";
import { getDb } from "./index";

export interface BirdRepoProps {
    common_name: number,
    status: number,
    sex: number,
    hatch_date: number,
    taxonomic_order: number,
    id1: string,
    id2: string,
    id3: string,
    name: string,
    family: number,
    genus: number,
    species: number,
    sub_species: number,
    body_condition: number,
    feather_condition: number,
    breeding_quality: number,
    breeder_info: string,
    mutations: string,
    location: string,
    cost: number,
    market_value: number,
    list_price: number,
    sold_price: number
}


// CREATE
export async function insertBird(bird: BirdRepoProps){
    const db = await getDb();
    const stmt = await db.prepareAsync(
        `insert into birds (
            id, common_name, status, sex, hatch_date, taxonomic_order, 
            id1, id2, id3, name, family, genus, species, sub_species, body_condition,
            feather_condition, breeding_quality, breeder_info, mutations, location, 
            cost, market_value, list_price, sold_price)
            values (
                $id, $common_name, $status, $sex, $hatch_date, $taxonomic_order, 
                $id1, $id2, $id3, $name, $family, $genus, $species, $sub_species, $body_condition, 
                $feather_condition, $breeding_quality, $breeder_info, $mutations, $location, 
                $cost, $market_value, $list_price, $sold_price
            )`
    );

    try{
        const newBirdId = generateUUID();
        const result = await stmt.executeAsync({
            $id: newBirdId,
            $common_name: bird.common_name, 
            $status: bird.status, 
            $sex: bird.sex, 
            $hatch_date: bird.hatch_date, 
            $taxonomic_order: bird.taxonomic_order, 
            $id1: bird.id1, 
            $id2: bird.id2, 
            $id3: bird.id3, 
            $name: bird.name, 
            $family: bird.family, 
            $genus: bird.genus, 
            $species: bird.species, 
            $sub_species: bird.sub_species,
            $body_condition: bird.body_condition, 
            $feather_condition: bird.feather_condition, 
            $breeding_quality: bird.breeding_quality, 
            $breeder_info: bird.breeder_info, 
            $mutations: bird.mutations, 
            $location: bird.location, 
            $cost: bird.cost, 
            $market_value: bird.market_value, 
            $list_price: bird.list_price, 
            $sold_price: bird.sold_price
        });

        // TODO: on successful creation, set isSynched to false?
        return result.lastInsertRowId;
    } catch(error: unknown) {
        if(error instanceof Error){
            throw error; // propagate error
        } else {
            throw new Error (JSON.stringify(error)); // Wrap if SQLite returns something weird
        }
    }finally {
        await stmt.finalizeAsync();
    }
}

// DELETE
export async function deleteBird(id: number){
    //const db = await getDb();
    //await db.execAsync("delete from birds where id = ?", [id]);
}

// UPDATE
export async function updateBird(id: number, fields: Partial<BirdRepoProps>) {
  const db = await getDb();
  const keys = Object.keys(fields);
  const setClause = keys.map((k) => `${k} = $${k}`).join(", ");
  const stmt = await db.prepareAsync(`UPDATE birds SET ${setClause} WHERE id = $id`);
  try {
    await stmt.executeAsync({ ...fields, $id: id });
  } finally {
    await stmt.finalizeAsync();
  }
}

// READ
export async function getAllBirds(): Promise<Bird[]>{
    const db = await getDb();

    try{
        const result = db.getAllAsync<Bird>("select * from birds order by name desc");
        return result;
    } catch(error){
        console.log("Error occured fetching birds: " + error);
    }

    return [];
}