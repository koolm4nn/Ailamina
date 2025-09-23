import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBird } from "../services/birdService";
import { queryKeys } from "../queryKeys";

export function useAddBird(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addBird,
        onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.birds})
    })
}