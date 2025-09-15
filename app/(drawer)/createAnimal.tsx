import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Image, Button, Platform, Dimensions } from 'react-native';
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

// Load Dropdown data
import * as families from "@/app/data/families.json";

const formKey = {
    IMAGE_URI: "imageUri",
    SEX: "sex",
    HATCH_DATE: "hatchDate",
    ID: "id",
    ORDER: "order",
    CAGE_NUMBER: "cageNumber",
    COST: "cost"
}

// Validation rules for every form element
const validationSchema = yup.object({
    imageUri: yup
        .string()
        .nullable()
        .notRequired()
        .default(null),
    sex: yup.string().required(formKey.SEX),
    hatchDate: yup
        .date()
        .typeError("No valid date")
        .required(formKey.HATCH_DATE),
    id: yup.string().required(formKey.ID),
    order: yup
        .number()
        .typeError("Order required")
        .required(formKey.ORDER),
    cageNumber: yup.string().nullable().required(),
    cost: yup.number().required(formKey.COST)
})

type FormData = yup.InferType<typeof validationSchema>;

// Default values for form
const defaultFormData: Partial<FormData> = {
    imageUri: null,
    sex: undefined,
    hatchDate: new Date(),
    id: "",
    order: undefined,
    cageNumber: "",
    cost: undefined
}


// Available options for dropdowns
const orderData = [
    { value: 1, label: "Order 1"},
    { value: 2, label: "Order 2"},
    { value: 3, label: "Order 3"}
];

// Memorize text input to prevent re-rendering
const FormTextInput = React.memo(function FormTextInput(
    { value, onChangeText, placeholder, placeholderTextColor, className, error}: 
    { value: string, onChangeText: ()=>void, placeholder: string, placeholderTextColor: string, className: string, error: boolean}) {
    return (
    <View>
      <TextInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor={placeholderTextColor} 
        className={className + (error? " bg-red-200" : "")}/>
    </View>
  );
});

const FormNumberInput = React.memo(function FormTextInput({ label, value, onChangeText, placeholder }: {label: string, value: string, onChangeText: ()=>void, placeholder: string}) {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        keyboardType='numeric'/>
    </View>
  );
});

export default function CreateBirdScreen(){
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultFormData,
    });

    // State if form was submitted at least once. Used do display green/red background color at inputs depending on if validation was successful
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    /**
     * Logic for opening/closing the active/other dropdowns
     * 
     * @param id 
     * @returns 
     */
    const makeSetActiveDropdown = (id: string) => (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === "function") {
            // DropDownPicker passed an updater: we need to apply it to the previous open-state
            setActiveDropdown((prevId) => {
            const prevOpen = prevId === id;
            const nextOpen = value(prevOpen); // call updater with prev boolean
            return nextOpen ? id : null;
            });
        } else {
            // DropDownPicker passed a boolean directly
            setActiveDropdown(value ? id : null);
        }
    };

    /**
     * Logic for scrolling element into view if in lower/upper
     * 
     */
    const scrollRef = useRef<ScrollView>(null);
    const screenHeight = Dimensions.get("window").height;
    const scrollIntoView = (ref: any) => {
        ref.current?.measureLayout(
            scrollRef.current!.getInnerViewNode(),
            (x: number, y: number) => {
                // Check where input is on screen
                if (y < screenHeight * 0.25 || y > screenHeight * 0.75) {
                scrollRef.current?.scrollTo({
                    y: y - screenHeight / 2,
                    animated: true,
                });
                }
            },
            () => {}
        );
    };


    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    // create handlers for each dropdown id
    const setOrderOpen = makeSetActiveDropdown("order");
    const closeOpenDropdowns = () => setActiveDropdown(null);

    // Common
    const [commonItems, setCommonItems] = useState([
        { value: 1, label: "Common 1"},
        { value: 2, label: "Common 2"},
        { value: 3, label: "Common 3"}
    ])

    return (
        <ScrollView 
            className='flex-1 bg-[#FFFFFE] py-5'
            contentContainerStyle={{
                alignItems: 'center'
            }}
            ref={scrollRef}
        >
            {/* Screen overlay to close dropdown */}
            {activeDropdown && (
                <Pressable
                    className='bg-black/20'
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1, // make sure it’s above content but below dropdown
                    }}
                    onPress={closeOpenDropdowns}
                />
            )}

            <View className='w-[90%]'>
                <Controller
                    control={control}
                    name="imageUri"
                    render={({ field: { value, onChange }, fieldState: {error} }) => (
                        <>
                            {/* Image Input */}
                            <ImageInput 
                                uri={value}
                                onChangeImage={onChange}
                            />
                        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                />

                {/* Sex */}
                <Controller 
                    control={control}
                    name="sex"
                    render={({ field: {value, onChange }, fieldState: {error} }) => (
                        <>
                            <FormRadioGroup
                                value={value}
                                onChange={onChange}
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" }
                                ]}
                                error={error !== undefined}
                            />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                />

                {/* Hatch Date */}
                <Controller
                    control={control}
                    name="hatchDate"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <>
                            <FormDatePicker
                                value={value ?? new Date()}
                                onChange={onChange}
                            />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                />

                {/* ID */}
                <Controller 
                    control={control}
                    name="id"
                    render={({ field: {value, onChange }, fieldState: {error} }) => (
                        <>
                            <FormTextInput 
                                value={value}
                                onChangeText={onChange}
                                placeholder="ID"
                                placeholderTextColor="gray"
                                className="border border-gray-300 rounded p-2 mb-1 text-neutral-700"
                                error={error !== undefined}
                            />

                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                placeholder="ID"
                                placeholderTextColor="gray"
                                numberOfLines={1}
                                className="border border-gray-300 rounded p-2 mb-1 text-neutral-700"
                            />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                />
                
                {/* Order */}
                <Controller 
                    control={control}
                    name="order"
                    render={({ field: {value, onChange }, fieldState: { error } }) => (
                        <>
                            <DropDownPicker
                                open={activeDropdown === "order"}
                                value={value}
                                items={orderData}
                                setOpen={setOrderOpen}
                                onChangeValue={onChange}
                                setValue={onChange}
                                setItems={setCommonItems}
                                searchable={true}
                                placeholder="Select the Order"
                                containerStyle={{ marginBottom: 5 }}      
                                style={[
                                    { zIndex: 10000 }, // for ios base style
                                    error ? { backgroundColor: "#fecaca" } : null, // Tailwind bg-red-200
                                ]}
                                listMode='SCROLLVIEW'
                                dropDownContainerStyle={{ zIndex: 10000, elevation: 10000 }} // Android
                            />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                
                />

                <Controller 
                    control={control}
                    name="cageNumber"
                    render={({ field: { value, onChange}, fieldState: { error } }) => (
                        <>
                            {/* Cage Number */}
                            <TextInput
                                value={value ?? undefined}
                                onChangeText={onChange}
                                placeholder="Cage Number"
                                keyboardType="numeric"
                                className="border border-gray-300 rounded p-2 mb-4"
                            />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                
                />
                <Controller 
                    control={control}
                    name="cost"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <>
                            {/* Cost */}
                            <CurrencyField 
                                label="Cost" 
                                value={value ?? undefined} 
                                onChangeValue={onChange} />
                            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                        </>
                    )}
                />
            </View>
            <View className='w-full items-center'>
                <Pressable 
                    className='bg-emerald-600 w-[80%] rounded-2xl'  
                    onPress={handleSubmit((data) => {
                        setFormSubmitted(true);
                        alert("Form is valid!");
                        console.log("Form is valid!", data);
                    }, (errors) => {
                        setFormSubmitted(true);
                        console.log("Form has errors!", errors);
                    })}
                    >
                    <View className='flex flex-row justify-center items-center'>
                        <AntDesign name="pluscircle" size={24} color="white" />
                        <Text className='text-white p-4 text-center text-xl font-bold'>
                            Create Bird
                        </Text>
                    </View>
                </Pressable>
            </View>
            <View className='mt-20 mb-20'/>
            <View className='mt-20 mb-20'/>
        </ScrollView>
    )
}