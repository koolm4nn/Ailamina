import { supabase } from "../supabase";
import { decode } from 'base64-arraybuffer'

// Bucket name for bird images
const supabaseBirdImagesBucket = process.env.EXPO_PUBLIC_SUPABASE_BIRD_IMAGES_BUCKET!

function validateImage(base64: string, maxSizeMB = 5): { isValid: boolean, error: string}{

    // TODO: check for valid base 64

    return {
        isValid: true,
        error: ""
    }
}

export async function uploadBirdImage(base64: string | null | undefined, userId: string, birdId: string){
    if(!base64) return;

    const { isValid, error: validationError } = validateImage(base64);

    // Throw error on image invalid
    if(!isValid){
        throw new Error(validationError);
    }

    // Get type from bytes
    const type = detectImageType(base64);

    // Invalid image type
    if(!type) {
        throw new Error("Image type could not be determined.");
    }


    // File-Path: <user-id> / <bird-id> / <unix-timestmpz>-<bird-id>.<image-type>
    const filePath = `${userId}/${birdId}/${Date.now()}-${birdId}.${type}`;
    
    // Get signed upload url for one-time upload (valid 2 hrs?)
    const {data: signedUploadData, error: signedUploadError} = await supabase.storage
        .from(supabaseBirdImagesBucket)
        .createSignedUploadUrl(filePath)

    if(signedUploadError) throw signedUploadError;

    // Upload image using one-time url
    const { error: uploadError } = await supabase
        .storage
        .from(supabaseBirdImagesBucket)
        .uploadToSignedUrl(signedUploadData.path, signedUploadData.token, decode(base64), { contentType: `image/${type}` })


    if(uploadError) throw uploadError;

    return filePath;
}

// Return image type, determined by leading bytes
function detectImageType(base64: string): string | null {
  const bytes = new Uint8Array(decode(base64));

  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "png";

  // JPEG
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return "jpg";

  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "gif";

  // BMP
  if (bytes[0] === 0x42 && bytes[1] === 0x4D) return "bmp";

  // TIFF
  if ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00) ||
      (bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A)) return "tiff";

  // WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "webp";

  return null;
}

export function fetchImage(){

}