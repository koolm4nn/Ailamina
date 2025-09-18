import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Text, TextInput, Pressable, Alert, Image, Button, Platform, Dimensions, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
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
import { normalizeJsonData } from '@/lib/utils/jsonUtils';

// Dropdown data
import * as dropdownData from "@/app/data";

// Image uploading
import { uploadBirdImage } from '@/lib/utils/imageUtils';
import { useActionSheet } from '@expo/react-native-action-sheet';

// Validation rules
const validationSchema = yup.object({
    imageBase64: yup.string().nullable().notRequired(),
    hatchDate: yup.string().nullable().required("Hatch Date is required."),
    order: yup.number().nullable().required("Order is required."),
    id: yup.string().nullable().required("Id is required.")
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
    hatchDate: string | null,
    order: number | null,
    id: string | null
}
const defaultFormData: FormData = {
    imageBase64: null,
    hatchDate: null,
    order: null,
    id: null
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

interface FormModalProps {
    name: string,
    control: any,
    title: string,
    items: { label:string, value: any }[],
    showSearch?: boolean,
    placeholder?: string
}

function FormModalComponent({ name, control, title, items, showSearch = true, placeholder = "None selected"}: FormModalProps){
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <Controller 
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <>
                        <ModalComponent 
                            items={items} 
                            onChange={field.onChange} 
                            visible={modalVisible} 
                            onClose={() => { setModalVisible(false)}} 
                            showSearch={showSearch}
                            selectedValue={field.value} // Controlled from react-hook-form
                            title={title}
                            error={!!fieldState.error}
                        />
                        <View className='flex flex-row justify-between items-center bg-gray-200 px-5 py-2'>
                            <Text>{title}</Text>
                            <Pressable 
                                onPress={() => setModalVisible(true)}
                                className={`${!field.value? "bg-yellow-100" : "bg-green-100"} px-6 py-3 border w-2/4 items-center`}
                            >
                                <Text>{items.find((item) => item.value === field.value)?.label ?? "Select"}</Text>
                            </Pressable>
                        </View>
                        {fieldState.error && (
                            <Text className="text-red-500">{fieldState.error.message}</Text>
                        )}
                    </>
                )}
            />
    )
}


interface ModalProps {
    title: string
    items: {label: string; value: any}[],
    selectedValue?: any,
    onChange: (value: any) => void,
    onClose: () => void,
    visible: boolean,
    showSearch?: boolean,
    error?: boolean
}

function ModalComponent(props: ModalProps){
    const [searchString, setSearchString] = useState("");

    // Filter items whenever search changes
    const filteredItems = useMemo(() => {
        if (!searchString.trim()) return props.items;
        return props.items.filter((item) =>
            typeof(item.label) === "string" && item.label.toLowerCase().includes(searchString.toLowerCase())
        );
    }, [searchString, props.items]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={props.onClose}
        >
            <Pressable 
                className='h-full w-full items-center justify-center bg-gray-800/80'  
                onPress={props.onClose}  
            >
                <Pressable 
                    className={`bg-white w-11/12 h-3/4 rounded-lg p-4`}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className=''> {props.title} </Text>

                    {/* Currently Selected */}
                    {props.selectedValue && (<Text className='mb-5 italic'>Currently selected: {props.items.find((item) => item.value === props.selectedValue)?.label}</Text>)}
                    
                    {/* Search Bar */}
                    <TextInput
                        value={searchString}
                        onChangeText={setSearchString}
                        placeholder="Search..."
                        className="border border-gray-400 rounded px-3 py-2 mb-3"
                    />


                    <ScrollView
                        className='max-h-3/4'
                    >
                        {filteredItems.length === 0 && <View><Text>No entry found.</Text></View>}
                        {filteredItems.map((item) => (
                            <View 
                                key={item.value}
                            >
                                <Pressable
                                    onPress={() => {
                                        props.onChange(item.value);
                                        setTimeout(() => {
                                            props.onClose();
                                        }, 5);
                                    }}
                                >
                                    {({ pressed }) => (
                                        <Text
                                            className={`mb-0.5 px-5 py-5 rounded-sm ${props.selectedValue === item.value? 
                                            "bg-yellow-200" : pressed? 
                                            "bg-blue-200" :
                                            "bg-gray-200"}`}    
                                        >
                                            {`${item.label} (${item.value})`}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>

                        ))}
                    </ScrollView>
                    <Pressable
                        onPress={props.onClose}
                        className="mt-4 p-3 bg-gray-300 rounded"
                    >
                        <Text className="text-center">Cancel</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}


interface FormTextProps {
    name: string,
    control: any,
    title: string,
    placeholder?: string
}

function FormTextInputBase({ name, control, title, placeholder="Type here.."}: FormTextProps){
    return (
        <Controller 
            control={control}
            name={name}
            render={({field: { value, onChange, onBlur }, fieldState}) => (
                <View className='bg-gray-200 px-5 py-2 mb-5'>
                    <Text>{title}</Text>
                    <TextInput 
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        placeholderTextColor='gray'
                        numberOfLines={1}
                        className='border rounded'
                    />
                    {fieldState.error && (<Text className='text-red-600'>{fieldState.error.message}</Text>)}
                </View>
            )}
        />
    )
}

// Memo-ize to prevent re-rendering of input siblings
const FormTextInputComponent = memo(FormTextInputBase);

export default function CreateBirdScreen(){
    // Use Actionsheets
    const { showActionSheetWithOptions } = useActionSheet();

    // Modals visibility
    const orderData = dropdownData.ordersData;
    const [orderModalVisible, setOrderModalVisible] = useState(false);

    const { control, handleSubmit, setValue, getValues, watch, reset } = useForm<FormData>({
        defaultValues: defaultFormData,
        resolver: yupResolver(validationSchema) as any // Ugly but necessary?
    });

    async function submit(){
        console.log(getValues());
        // TODO: first create bird

        // TODO: upload image
        // TODO: store entry in database refering user with uploaded image
        //await uploadBirdImage(formData.imageBase64, "0", "1")
    }

    // Common Name Action Sheet
    const onPressCommonName = () => {
        const options = ['Delete', 'Save', 'Cancel'];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 2;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            destructiveButtonIndex
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case 1:
                console.log("Save");
                // Save
                break;

                case destructiveButtonIndex:
                console.log("Delete");
                // Delete
                break;

                case cancelButtonIndex:
                console.log("Cancel");
                // Canceled
        }});
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1}}  
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
            >
                <>
                    <View>
                        <Pressable onPress={onPressCommonName}>
                            <Text>Show Common Names</Text>
                        </Pressable>
                    </View>

                    {/* IMAGE */}
                    <Controller
                        control={control}
                        name='imageBase64'
                        render={ ({field, fieldState}) => (
                            <ImageInput uri={null} base64={null} onChangeImage={field.onChange} />
                        )}
                    />

                    {/* HATCH DATE */}
                    <Controller 
                        control={control}
                        name='hatchDate'
                        render={ ({ field, fieldState}) => (
                            <FormDatePicker value={new Date()} onChange={field.onChange}/>
                        )}
                    />

                    {/* ID */}
                    <FormTextInputComponent 
                    name='id' control={control} title='ID'  />
                    

                    
                    
                    {/* ORDER */}
                    <FormModalComponent name='order' control={control} title='Select Order' items={orderData} />

                    {/* Submit */}
                    <View className='items-center p-2'>
                        <Pressable
                            onPress={handleSubmit(submit)}
                            className='px-7 py-3 rounded-lg bg-sky-400'
                        >
                            <Text className='text-xl text-gray-100'>Submit</Text>
                        </Pressable>
                    </View>
                    <View className='items-center p-2'>
                        <Pressable
                            onPress={() => reset()}
                            className='px-7 py-3 rounded-lg bg-sky-400'
                        >
                            <Text className='text-xl text-gray-100 '>Reset</Text>
                        </Pressable>
                    </View>
                    <View className='mb-20'></View>
                    <View className='mb-20'></View>
                </>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}