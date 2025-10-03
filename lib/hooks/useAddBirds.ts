import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBird } from "../services/birdService";
import { queryKeys } from "../queryKeys";
import { FormFieldError } from "@/errors/FormFieldError";
import { BirdRepoProps } from "../db/birdsRepo";

// Hook for adding bird
export function useAddBird(){
    const queryClient = useQueryClient();

    return useMutation<number, FormFieldError, BirdRepoProps>({
        mutationFn: addBird,
        onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.birds})
        // No onError, propagate it
    });
}