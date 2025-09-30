import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, Pressable, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CurrencyField from "@/components/inputs/CurrencyInput";
import ImageInput from '@/components/inputs/ImageInput';
import FormDatePicker from '@/components/inputs/FormDatePicker';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams } from "expo-router";

// Dropdown data
import * as dropdownData from "@/app/data";

// Image uploading
import FormTextInputBase from '@/components/forms/FormTextInputBase';
import FormModalComponent from '@/components/forms/FormModal';
import { supabase } from '@/lib/supabase';
import { BirdRepoProps, insertBird } from '@/lib/db/birdsRepo';
import { useAddBird } from '@/lib/hooks/useAddBirds';
import BirdForm from '@/components/forms/BirdForm';
import { Bird } from '@/types/bird';
import { useSelectedBird } from '@/stores/useSelectedBird';

// Validation rules
const validationSchema = yup.object({
    imageBase64: yup.string().nullable().notRequired(),
    commonName: yup.number().nullable().required("Common Name is required."),
    status: yup.number().nullable().required("Status is required."),
    sex: yup.number().nullable().required("Sex is required."),
    hatchDate: yup.number().nullable().required("Hatch Date is required."),
    taxonomicOrder: yup.number().nullable().required("Order is required."),
    id1: yup.string().nullable().required("Id is required."),
    id2: yup.string().nullable().notRequired(),
    id3: yup.string().nullable().notRequired(),
    name: yup.string().nullable().notRequired(),
    family: yup.number().nullable().required("Family is required."),
    genus: yup.number().nullable().required("Genus is required."),
    species: yup.number().nullable().required("Species is required."),
    subSpecies: yup.number().nullable().required("Subspecies is required."),
    bodyCondition: yup.number().nullable().required("Body Condition is required."),
    featherCondition: yup.number().nullable().required("Feather Condition is required."),
    breedingQuality: yup.number().nullable().required("Breeding Quality is required."),
    breederInfo: yup.string().nullable().notRequired(),
    mutations: yup.string().nullable().notRequired(),
    location: yup.string().nullable().required("Location is required."),
    cost: yup.number().moreThan(0, "Cost must be greater than 0.00").nullable().required("Costs must be greater than 0.00."),
    marketValue: yup.number().moreThan(0, "Market Value must be greater than 0.00").nullable().required("Market Value must be greater than 0.00."),
    listPrice: yup.number().moreThan(0, "List Price must be greater than 0.00").nullable().required("List Price must be greater than 0.00."),
    soldPrice: yup.number().moreThan(0, "Sold Price must be greater than 0.00").nullable().required("Sold Price must be greater than 0.00.")
})

//type FormData = yup.InferType<typeof validationSchema>;
export type BirdFormData = {
    imageBase64: string | null,
    commonName: number | null,
    status: number | null,
    sex: number | null,
    hatchDate: number,
    taxonomicOrder: number | null,
    id1: string | null,
    id2: string | null,
    id3: string | null,
    name: string | null,
    family: number | null,
    genus: number | null,
    species: number | null,
    subSpecies: number | null,
    bodyCondition: number | null,
    featherCondition: number | null,
    breedingQuality: number | null,
    breederInfo: string | null,
    mutations: string | null,
    location: string | null,
    cost: number | null,
    marketValue: number | null,
    listPrice: number | null,
    soldPrice: number | null,
}
const defaultFormData: BirdFormData = {
    imageBase64: null,
    commonName: null,
    status: null,
    sex: null,
    hatchDate: Date.now(),
    taxonomicOrder: null,
    id1: null,
    id2: null,
    id3: null,
    name: null,
    family: null,
    genus: null,
    species: null,
    subSpecies: null,
    bodyCondition: null,
    featherCondition: null,
    breedingQuality: null,
    breederInfo: null,
    mutations: null,
    location: null,
    cost: 0,
    marketValue: 0,
    listPrice: 0,
    soldPrice: 0,
}


// Maps form inputs to prop for database queries
function mapFormToDb(data: BirdFormData): BirdRepoProps {
  return {
    // id is created during insertion query
    common_name: data.commonName!,
    status: data.status!,
    sex: data.sex!,
    hatch_date: data.hatchDate,
    taxonomic_order: data.taxonomicOrder!,
    id1: data.id1!,
    id2: data.id2 ?? "",
    id3: data.id3 ?? "",
    name: data.name ?? "",
    family: data.family!,
    genus: data.genus!,
    species: data.species!,
    sub_species: data.subSpecies!,
    body_condition: data.bodyCondition!,
    feather_condition: data.featherCondition!,
    breeding_quality: data.breedingQuality!,
    breeder_info: data.breederInfo ?? "",
    mutations: data.mutations ?? "",
    location: data.location!,
    cost: data.cost ?? 0.0,
    market_value: data.marketValue ?? 0.0,
    list_price: data.listPrice ?? 0.0,
    sold_price: data.soldPrice ?? 0.0,
  };
}

function mapBirdToFormData(bird: Bird) : BirdFormData{
    return {
        imageBase64: null,
        commonName: bird.common_name ?? defaultFormData.commonName,
        status: bird.status ?? defaultFormData.status,
        sex: bird.sex ?? defaultFormData.sex,
        hatchDate: bird.hatch_date ?? defaultFormData.hatchDate,
        taxonomicOrder: bird.taxonomic_order ?? defaultFormData.taxonomicOrder,
        id1: bird.id1 ?? defaultFormData.id1,
        id2: bird.id2 ?? defaultFormData.id2,
        id3: bird.id3 ?? defaultFormData.id3,
        name: bird.name ?? defaultFormData.name,
        family: bird.family ?? defaultFormData.family,
        genus: bird.genus ?? defaultFormData.genus,
        species: bird.species ?? defaultFormData.species,
        subSpecies: bird.sub_species ?? defaultFormData.subSpecies,
        bodyCondition: bird.body_condition ?? defaultFormData.bodyCondition,
        featherCondition: bird.feather_condition ?? defaultFormData.featherCondition,
        breedingQuality: bird.breeding_quality ?? defaultFormData.breedingQuality,
        breederInfo: bird.breeder_info ?? defaultFormData.breederInfo,
        mutations: bird.mutations ?? defaultFormData.mutations,
        location: bird.location ?? defaultFormData.location,
        cost: bird.cost ?? defaultFormData.cost,
        marketValue: bird.market_value ?? defaultFormData.marketValue,
        listPrice: bird.list_price ?? defaultFormData.listPrice,
        soldPrice: bird.sold_price ?? defaultFormData.soldPrice
    } as BirdFormData;
}

// Memo-ize to prevent re-rendering of input siblings
const FormTextInputComponent = memo(FormTextInputBase);

export default function CreateBirdScreen(){
    const { mutate, isPending, isError, isSuccess } = useAddBird();

    const { selectedBird } = useSelectedBird();

    const isEdit = !!selectedBird;

    // Memoize form data
    const formData = useMemo(() => {
        if(isEdit && selectedBird){
            return mapBirdToFormData(selectedBird)
        }
        return defaultFormData;
    }, [isEdit, selectedBird]);

    // On Submitting Form
    async function handleFormSubmit(formData: BirdFormData){
        const { data: { user } } = await supabase.auth.getUser();

        if(!user?.id){
            // TODO: Throw error
            return;
        }

        // 1) Create Bird in DB
        const dbProps = mapFormToDb(formData);

        try{
            mutate(dbProps);
            // 2) Create user-to-bird relation
            // 3) Upload image
            // 4) Create bird-to-image relation
            // Wrap all in one transaction with rollback on error
        } catch(error){
            console.log(error);
        }
        
        // TODO: upload image
        // TODO: store entry in database refering user with uploaded image
        //await uploadBirdImage(formData.imageBase64, "0", "1")
    }

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <KeyboardAvoidingView
            style={{ flex: 1}}  
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
                className='bg-white'
            >
                {isEdit? (
                    <BirdForm 
                        mode="edit"
                        formData={formData}
                        onSubmit={() => {console.log("Pressed Finish editing.")}}
                        loading={false}
                        error={false}
                        success={false}
                    
                    />
                ):(
                    <BirdForm 
                        mode="create"
                        formData={formData}
                        onSubmit={handleFormSubmit}
                        loading={isPending}
                        error={isError}
                        success={isSuccess}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
        
    )
}