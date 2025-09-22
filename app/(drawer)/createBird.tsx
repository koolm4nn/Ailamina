import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Image, Button, Platform, Dimensions, Modal, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // searchable dropdown
//import CurrencyInput from 'react-native-currency-input';
import CurrencyField from "@/components/inputs/CurrencyInput"
import AntDesign from '@expo/vector-icons/AntDesign';
import ImageInput from '@/components/inputs/ImageInput';
import FormRadioGroup from '@/components/inputs/FormRadioGroup';
import FormDatePicker from '@/components/inputs/FormDatePicker';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Dropdown data
import * as dropdownData from "@/app/data";

// Image uploading
import { uploadBirdImage } from '@/lib/utils/imageUtils';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FormTextInputBase from '@/components/forms/FormTextInputBase';
import FormModalComponent from '@/components/forms/FormModal';

// Validation rules
const validationSchema = yup.object({
    imageBase64: yup.string().nullable().notRequired(),
    commonName: yup.number().nullable().required("Common Name is required."),
    status: yup.number().nullable().required("Status is required."),
    sex: yup.number().nullable().required("Sex is required."),
    hatchDate: yup.number().nullable().required("Hatch Date is required."),
    order: yup.number().nullable().required("Order is required."),
    id: yup.string().nullable().required("Id is required."),
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

/*const validationSchema = yup.object({
    imageBase64: yup.string().nullable().notRequired(),
    commonName: yup.number().nullable().required("Common name is required."),
    status: yup.number().nullable().required("Status is required."),
    sex: yup.string().nullable().required("Sex is required"),
    hatchDate: yup.date().required("Hatch Date is required."),
    id: yup.string().required("ID is required."),
    id2: yup.string().notRequired(),
    id3: yup.string().notRequired(),
    name: yup.string().nullable().required("Name is required"),
    order: yup.number().nullable().required("Order is required"),
    family: yup.number().nullable().required("Family is required"),
    genus: yup.number().nullable().required("Genus is required"),
    species: yup.number().nullable().required("Species is required"),
    subspecies: yup.number().nullable().required("Subspecies is required"),
    breederInfo: yup.string().notRequired(),
    cageNumber: yup.string().notRequired(),
    weight: yup.string().nullable().required("Weight is required."),
    bodyCondition: yup.number().nullable().required("Body Condition is required."),
    featherCondition: yup.number().nullable().required("Feather Condition is required."),
    breedingQuality: yup.number().nullable().required("Breeding Quality is required."),
    cost: yup.number().nullable().required("Cost is required."),
    marketValue: yup.number().nullable().required("Market Value is required."),
    listPrice: yup.number().nullable().required("List Price is required."),
    soldPrice: yup.number().nullable().required("Sold Price is required."),
    mutations: yup.string().notRequired(),
})*/

//type FormData = yup.InferType<typeof validationSchema>;
type FormData = {
    imageBase64: string | null,
    commonName: number | null,
    status: number | null,
    sex: number | null,
    hatchDate: number,
    order: number | null,
    id: string | null,
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
const defaultFormData: FormData = {
    imageBase64: null,
    commonName: null,
    status: null,
    sex: null,
    hatchDate: Date.now(),
    order: null,
    id: null,
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

/*const defaultFormData = {
    imageBase64: null as string | null | undefined,
    commonName: null as number | null,
    status: null,
    sex: null,
    hatchDate: null,
    id: "",
    id2: "",
    id3: "",
    name: "",
    order: null,
    family: null,
    genus: null,
    species: null,
    subspecies: null,
    breederInfo: "",
    cageNumber: "",
    weight: "",
    bodyCondition: null,
    featherCondition: null,
    breedingQuality: null,
    cost: null as number | null,
    marketValue: null as number | null,
    listPrice: null as number | null,
    soldPrice: null as number | null,
    mutations: ""
};*/

// Memo-ize to prevent re-rendering of input siblings
const FormTextInputComponent = memo(FormTextInputBase);

export default function CreateBirdScreen(){

    // Modals data
    const orderData = dropdownData.ordersData;
    const statusData = dropdownData.statusData;
    const sexData = dropdownData.sexData;
    const commonNameData = dropdownData.commonNamesData;
    const familyData = dropdownData.familiesData;
    const genusData = dropdownData.genusData;
    const speciesData = dropdownData.speciesData;
    const subspeciesData = dropdownData.subspeciesData;
    const bodyConditionData = dropdownData.bodyConditionsData;
    const featherConditionData = dropdownData.featherConditionsData;
    const breedingQualityData = dropdownData.breedingQualitiesData;

    // Form handler and verification
    const { control, handleSubmit, setValue, getValues, watch, reset } = useForm<FormData>({
        defaultValues: defaultFormData,
        resolver: yupResolver(validationSchema) as any // Ugly but necessary?
    });

    // On Submitting Form
    async function submit(){
        console.log(getValues());
        // TODO: first create bird

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
                <>
                    <View className='flex flex-row justify-center mb-5'>
                        <Text className='font-bold'>Fields marked as </Text>
                        <Text className='font-bold text-red-600'>*</Text>
                        <Text className='font-bold'> are required.</Text>
                    </View>
                    {/* IMAGE */}
                    <Controller
                        control={control}
                        name='imageBase64'
                        render={ ({field, fieldState}) => (
                            <ImageInput uri={null} base64={field.value} onChangeImage={field.onChange} />
                        )}
                    />

                    {/* COMMON NAME */}
                    <FormModalComponent name='commonName' control={control} title='Common Name:' items={commonNameData} required={true}/>

                    {/* STATUS */}
                    <FormModalComponent name='status' control={control} title='Status:' items={statusData} required={true}/>

                    {/* SEX */}
                    <FormModalComponent name='sex' control={control} title='Sex:' items={sexData} required={true}/>
                    

                    {/* HATCH DATE */}
                    <Controller 
                        control={control}
                        name='hatchDate'
                        render={ ({ field, fieldState}) => (
                            <FormDatePicker 
                                value={new Date(field.value)}
                                onChange={(date: Date) => field.onChange(date.getTime())}/>
                        )}
                    />

                    {/* ID */}
                    <FormTextInputComponent name='id' control={control} title='Main Identifier (e.g. Band/Ring Number):' required={true}  />
                    {/* ID 2 */}
                    <FormTextInputComponent name='id2' control={control} title='Additional Idenfitier:'  />
                    {/* ID 3 */}
                    <FormTextInputComponent name='id3' control={control} title='Additional Identifier:'  />

                    {/* NAME */}
                    <FormTextInputComponent name='name' control={control} title='Name' required={true}/>
                    
                    {/* ORDER */}
                    <FormModalComponent name='order' control={control} title='Order:' items={orderData} required={true}/>
                    
                    {/* FAMILY */}
                    <FormModalComponent name='family' control={control} title='Family:' items={familyData} required={true}/>
                    
                    {/* GENUS */}
                    <FormModalComponent name='genus' control={control} title='Genus:' items={genusData} required={true}/>

                    {/* SPECIES */}
                    <FormModalComponent name='species' control={control} title='Species:' items={speciesData} required={true}/>
                    
                    {/* SUBSPECIES */}
                    <FormModalComponent name='subSpecies' control={control} title='Sub Species:' items={subspeciesData} required={true}/>

                    {/* BREEDER INFO */}
                    <FormTextInputComponent name='breederInfo' control={control} title='Breeder Info:' multiline={true} numberOfLines={4}/>

                    {/* LOCATION */}
                    <FormTextInputComponent name='location' control={control} title='Location (e.g. cage number):' required={true} />
                    
                    {/* BODY CONDITION */}
                    <FormModalComponent name='bodyCondition' control={control} title='Body Condition:' items={bodyConditionData} required={true}/>
                    
                    {/* FEATHER CONDITION */}
                    <FormModalComponent name='featherCondition' control={control} title='Feather Condition:' items={featherConditionData} required={true}/>
                    
                    {/* BREEDING QUALITY */}
                    <FormModalComponent name='breedingQuality' control={control} title='Breeding Quality:' items={breedingQualityData} required={true}/>

                    {/* MUTATIONS */}
                    <FormTextInputComponent name='mutations' control={control} title='Mutations:' multiline={true} numberOfLines={4}/>

                    {/* COST */}
                    <CurrencyField name='cost' control={control} title='Cost:'/>
                    {/* MARKET VALUE */}
                    <CurrencyField name='marketValue' control={control} title='Market Value:'/>
                    {/* LIST PRICE */}
                    <CurrencyField name='listPrice' control={control} title='List Price:'/>
                    {/* SOLD PRICE */}
                    <CurrencyField name='soldPrice' control={control} title='Sold Price:'/>

                    {/* BUTTONS */}
                    <View className='flex flex-row gap-20 justify-center px-15 items-center'>
                        <View className='items-center p-2'>
                            <Pressable
                                onPress={() => reset()}
                                className='px-7 py-3 rounded-lg bg-gray-400'
                            >
                                <Text className='text-xl text-gray-100 '>Reset</Text>
                            </Pressable>
                        </View>
                        <View className='items-center p-2'>
                            <Pressable
                                onPress={handleSubmit(submit)}
                                className='px-7 py-3 rounded-lg bg-sky-400'
                            >
                                <Text className='text-xl text-gray-100'>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                </>
            </ScrollView>
        </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
        
    )
}