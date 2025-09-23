import { insertBird, getAllBirds, BirdRepoProps } from "../db/birdsRepo";

export async function addBird(bird: BirdRepoProps){
    return await insertBird(bird);
}

export async function fetchBirds(){
    return getAllBirds();
}