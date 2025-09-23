import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Bird } from "@/types/bird";
import FormTextInputBase from "./FormTextInputBase";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

// Dropdown data
import * as dropdownData from "@/app/data";
import FormModalComponent from "./FormModal";
import ImageInput from "../inputs/ImageInput";
import FormDatePicker from "../inputs/FormDatePicker";
import CurrencyField from "../inputs/CurrencyInput";


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

type Mode = "create" | "edit" | "view";
interface BirdFormProps{
    mode: Mode, 
    defaultValues?: Partial<Bird>, 
    onSubmit: (data: BirdFormData) => void,
    loading?: boolean,
    error?: boolean,
    success?: boolean
}

function BirdForm({mode, defaultValues, onSubmit, loading=false, error=false, success=false}: BirdFormProps){

    
    // Memo-ize to prevent re-rendering of input siblings
    const FormTextInputComponent = memo(FormTextInputBase);

    // Form handler and verification
    const { control, handleSubmit, getValues, reset } = useForm<BirdFormData>({
        defaultValues,
        resolver: yupResolver(validationSchema) as any // Ugly but necessary?
    });
    
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

    const readOnly = mode === "view";

    return (
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

                    {/* ID 1 */}
                    <FormTextInputComponent name='id1' control={control} title='Main Identifier (e.g. Band/Ring Number):' required={true}  />
                    {/* ID 2 */}
                    <FormTextInputComponent name='id2' control={control} title='Additional Idenfitier:'  />
                    {/* ID 3 */}
                    <FormTextInputComponent name='id3' control={control} title='Additional Identifier:'  />

                    {/* NAME */}
                    <FormTextInputComponent name='name' control={control} title='Name' required={true}/>
                    
                    {/* ORDER */}
                    <FormModalComponent name='taxonomicOrder' control={control} title='Order:' items={orderData} required={true}/>
                    
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
                        { mode === "create" && <View className='items-center p-2'>
                            <Pressable
                                onPress={() => reset()}
                                disabled={loading}
                                className='px-7 py-3 rounded-lg bg-gray-400'
                            >
                                <Text className='text-xl text-gray-100 '>Reset</Text>
                            </Pressable>
                        </View>}
                        <View className='items-center p-2'>
                            <Pressable
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                                className='px-7 py-3 rounded-lg bg-sky-400'
                            >
                                <Text className='text-xl text-gray-100'>{mode === "create"? "Submit" : mode === "edit"? "Save Changes" : "Back to list"}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View>
                        <Text>
                            {loading && <Text>Pending</Text>}
                            {error && <Text>Error</Text>}
                            {success && <Text>Success</Text>}
                        </Text>
                    </View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                </>
    )
}