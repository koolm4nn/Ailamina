import { Bird } from "@/types/bird";
import { queryKeys } from "../queryKeys";
import { fetchBirds } from "../services/birdService";
import { useQuery } from "@tanstack/react-query"

export function useBirds(){
    return useQuery<Bird[]>({
        queryKey: queryKeys.birds,
        queryFn: fetchBirds,
        // Can have big stale time, as data should mostly be updated locally through query that invalidates cache
        staleTime: 1000 * 60 * 15,
    })
}