import { FormFieldError } from "@/errors/FormFieldError";
import { insertBird, getAllBirds, BirdRepoProps } from "../db/birdsRepo";

/**
 * Creates a bird for props. Differentiates errors in case repo mutation is unsuccessful.
 * 
 * @param birdProp data of the bird to create
 * @returns row id of the created bird
 */
export async function addBird(birdProp: BirdRepoProps): Promise<number>{
    try{
        return await insertBird(birdProp);
    } catch(error: any){
        // Differentiate between errors and update to user-readable error messages
        // UNIQUE constraint failed: birds.id1

        let field: string | undefined = undefined;

        if(error.message.includes("UNIQUE constraint")){
            if(error.message.includes("birds.id1")) field = "id1" ;
            if(error.message.includes("birds.name")) field = "id1";

            throw {
                name: "FormFieldError",
                message: error.message,
                field,
                code: "UNIQUE_CONSTRAINT"
            } as FormFieldError
        } else {
            throw new Error("Error creating the bird. Please forward this message to admin: ", error.message);
        }
    }
}

export async function fetchBirds(){
    return getAllBirds();
}