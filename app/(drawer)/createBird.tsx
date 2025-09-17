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

// Image uploading
import { uploadBirdImage } from '@/lib/utils/imageUtils';

// Validation rules
const validationSchema = yup.object({
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
})

type FormData = yup.InferType<typeof validationSchema>;

const defaultFormData = {
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
};

const statusData = [
    { value: 1, label: "Status 1"},
    { value: 2, label: "Status 2"},
    { value: 3, label: "Status 3"}
];
const commonData = [
    { value: 1, label: "Common 1"},
    { value: 2, label: "Common 2"},
    { value: 3, label: "Common 3"}
];
const orderData = [
    { value: 1, label: "Order 1"},
    { value: 2, label: "Order 2"},
    { value: 3, label: "Order 3"}
];
const familyData = [
    { value: 1, label: "Family 1"},
    { value: 2, label: "Family 2"},
    { value: 3, label: "Family 3"}
];
const genusData = [
    { value: 1, label: "Genus 1"},
    { value: 2, label: "Genus 2"},
    { value: 3, label: "Genus 3"}
];
const speciesData = [
    { value: 1, label: "Species 1"},
    { value: 2, label: "Species 2"},
    { value: 3, label: "Species 3"}
];
const subspeciesData = [
    { value: 1, label: "Subspecies 1"},
    { value: 2, label: "Subspecies 2"},
    { value: 3, label: "Subspecies 3"}
];
const bodyConditionData = [
    { value: 1, label: "Body Condition 1"},
    { value: 2, label: "Body Condition  2"},
    { value: 3, label: "Body Condition  3"}
];
const featherConditionData = [
    { value: 1, label: "Feather Condition 1"},
    { value: 2, label: "Feather Condition 2"},
    { value: 3, label: "Feather Condition 3"}
];
const breedingQualityData = [
    { value: 1, label: "Breeding Quality 1"},
    { value: 2, label: "Breeding Quality 2"},
    { value: 3, label: "Breeding Quality 3"}
];

const FormTextInput = React.memo(function FormTextInput({ label, value, onChangeText, placeholder }: {label: string, value: string, onChangeText: ()=>void, placeholder: string}) {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} />
    </View>
  );
});

export default function CreateBirdScreen(){
    const [loading, setLoading] = useState(false);

    async function createBird(){
        // TODO: first create bird

        // TODO: upload image
        // TODO: store entry in database refering user with uploaded image
        await uploadBirdImage(formData.imageBase64, "0", "1")
    }

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


    const Separator = () => <View className="h-[1px] bg-gray-300 my-2 w-[90%]" />

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    // create handlers for each dropdown id
    const setStatusOpen = makeSetActiveDropdown("status");
    const setCommonOpen = makeSetActiveDropdown("common");
    const setOrderOpen = makeSetActiveDropdown("order");
    const setFamilyOpen = makeSetActiveDropdown("family");
    const setGenusOpen = makeSetActiveDropdown("genus");
    const setSpeciesOpen = makeSetActiveDropdown("species");
    const setSubspeciesOpen = makeSetActiveDropdown("subspecies");
    const setBodyConditionOpen = makeSetActiveDropdown("bodyCondition");
    const setFeatherConditionOpen = makeSetActiveDropdown("featherCondition");
    const setBreedingQualityOpen = makeSetActiveDropdown("breedingQuality");
    const closeOpenDropdowns = () => setActiveDropdown(null);

    // Form data
    const [formData, setFormData] = useState({...defaultFormData});

    // Inputs
    const [statusItems, setStatusItems] = useState([
        { value: 1, label: "Status 1"},
        { value: 2, label: "Status 2"},
        { value: 3, label: "Status 3"}
    ]);

    // Common
    const [commonItems, setCommonItems] = useState([
        { value: 1, label: "Common 1"},
        { value: 2, label: "Common 2"},
        { value: 3, label: "Common 3"}
    ]);


    return (
        <ScrollView 
            className='flex-1 bg-green-50 py-5'
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
                {/* Image Input */}
                <ImageInput 
                    uri={undefined}
                    base64={formData.imageBase64} 
                    onChangeImage={(base64) => 
                        setFormData((prev) => ({
                            ...prev, 
                            imageBase64: base64
                        }))
                    } 
                />

                {/* Status */}
                <DropDownPicker
                    open={activeDropdown === "status"}
                    value={formData.status}
                    items={statusData}
                    setOpen={setStatusOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, status: callback(prev.status)}))
                    }}
                    setItems={setStatusItems}
                    searchable={true}
                    placeholder="Select the Status"
                    containerStyle={{ marginBottom: 16 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 12000 }}       // for iOS
                    dropDownContainerStyle={{ zIndex: 12000, elevation: 12000 }} // Android
                />
                {/* Common */}
                <DropDownPicker
                    open={activeDropdown === "common"}
                    value={formData.commonName}
                    items={commonData}
                    setOpen={setCommonOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, commonName: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Common"
                    containerStyle={{ marginBottom: 16 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 11000 }}       // for iOS
                    dropDownContainerStyle={{ zIndex: 11000, elevation: 11000 }} // Android
                />

                {/* Sex */}
                <FormRadioGroup
                    value={formData.sex ?? "male"}
                    onChange={(val) => setFormData(prev => ({ ...prev, sex: val }))}
                    options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" }
                    ]}
                    error={false}
                />

                {/* Hatch Date */}
                <FormDatePicker 
                    value={new Date()} 
                    onChange={() => {}}    
                />

                {/* ID */}
                <TextInput
                    value={formData.id}
                    onChangeText={(text) => setFormData({
                        ...formData,
                        id: text
                    })}
                    placeholder="ID"
                    placeholderTextColor="gray"
                    numberOfLines={1}
                    className="border border-gray-300 rounded p-2 mb-1 text-neutral-700"
                />

                {/* ID2 */}
                <TextInput
                    value={formData.id2}
                    onChangeText={(text) => setFormData({
                        ...formData,
                        id2: text
                    })}
                    placeholder="ID2 (optional)"
                    placeholderTextColor="gray"
                    numberOfLines={1}
                    className="border border-gray-300 rounded p-2 mb-1 text-neutral-700"
                />

                {/* ID3 */}
                <TextInput
                    value={formData.id3}
                    onChangeText={(text) => setFormData({
                        ...formData,
                        id3: text
                    })}
                    placeholder="ID3 (optional)"
                    placeholderTextColor="gray"
                    numberOfLines={1}
                    className="border border-gray-300 rounded p-2 mb-4 text-neutral-700"
                />

                {/* Name */}
                <TextInput
                    value={formData.name}
                    onChangeText={(text) => setFormData({
                        ...formData,
                        name: text
                    })}
                    placeholder="Name"
                    placeholderTextColor="gray"
                    numberOfLines={1}
                    className="border border-gray-300 rounded p-2 mb-4 text-neutral-700"
                />
                
                {/* Order */}
                <DropDownPicker
                    open={activeDropdown === "order"}
                    value={formData.order}
                    items={orderData}
                    setOpen={setOrderOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, order: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Order"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 10000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 10000, elevation: 10000 }} // Android
                />
                
                {/* Family */}
                <DropDownPicker
                    open={activeDropdown === "family"}
                    value={formData.family}
                    items={familyData}
                    setOpen={setFamilyOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, family: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Family"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 9000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 9000, elevation: 9000 }} // Android
                />
                
                {/* Genus */}
                <DropDownPicker
                    open={activeDropdown === "genus"}
                    value={formData.genus}
                    items={genusData}
                    setOpen={setGenusOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, genus: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Genus"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 8000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 8000, elevation: 8000 }} // Android
                />
                
                {/* Species */}
                <DropDownPicker
                    open={activeDropdown === "species"}
                    value={formData.species}
                    items={speciesData}
                    setOpen={setSpeciesOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, species: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Species"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 7000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 7000, elevation: 7000 }} // Android
                />
                
                {/* Subspecies */}
                <DropDownPicker
                    open={activeDropdown === "subspecies"}
                    value={formData.subspecies}
                    items={subspeciesData}
                    setOpen={setSubspeciesOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, subspecies: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Subspecies"
                    containerStyle={{ marginBottom: 16 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 6000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 6000, elevation: 6000 }} // Android
                />

                {/* Breeder Comment */}
                <TextInput
                    value={formData.breederInfo}
                    onChangeText={(text) => setFormData({
                        ...formData,
                        breederInfo: text
                    })}
                    placeholder="Breeder Info (optional)"
                    placeholderTextColor="gray"
                    multiline
                    numberOfLines={4}
                    
                    className="border border-gray-300 rounded p-2 mb-4 text-neutral-700"
                />

                {/* Cage Number */}
                <TextInput
                    value={formData.cageNumber}
                    onChangeText={value => setFormData(prev => ({...prev, cageNumber: value}))}
                    placeholder="Cage Number"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded p-2 mb-4"
                />

                {/* Weight */}
                <TextInput
                    value={formData.weight}
                    onChangeText={value => setFormData(prev => ({...prev, weight: value}))}
                    placeholder="Weight (in grams)"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded p-2 mb-4"
                />
                <Text className='mb-2'>
                    Quality
                </Text>
                {/* Body Condition */}
                <DropDownPicker
                    open={activeDropdown === "bodyCondition"}
                    value={formData.bodyCondition}
                    items={bodyConditionData}
                    setOpen={setBodyConditionOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, bodyCondition: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Body Condition"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 5000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 5000, elevation: 5000 }} // Android
                />
                {/* Feather Condition */}
                <DropDownPicker
                    open={activeDropdown === "featherCondition"}
                    value={formData.featherCondition}
                    items={featherConditionData}
                    setOpen={setFeatherConditionOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, featherCondition: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Feather Condition"
                    containerStyle={{ marginBottom: 5 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 4000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 4000, elevation: 4000 }} // Android
                />
                {/* Breeding Quality */}
                <DropDownPicker
                    open={activeDropdown === "breedingQuality"}
                    value={formData.breedingQuality}
                    items={breedingQualityData}
                    setOpen={setBreedingQualityOpen}
                    setValue={(callback) => {
                        setFormData((prev) => ({ ...prev, breedingQuality: callback(prev.status)}))
                    }}
                    setItems={setCommonItems}
                    searchable={true}
                    placeholder="Select the Breeding Quality"
                    containerStyle={{ marginBottom: 16 }}
                    listMode='SCROLLVIEW'
                    style={{ zIndex: 3000 }} // for iOS
                    dropDownContainerStyle={{ zIndex: 3000, elevation: 3000 }} // Android
                />
                
                {/* Cost */}
                <CurrencyField label="Cost" value={formData.cost} onChangeValue={value => setFormData(p => ({...p, cost: value }))} />
                {/* Market Value */}
                <CurrencyField label="Market Value" value={formData.marketValue} onChangeValue={value => setFormData(p => ({...p, marketValue: value }))} />
                {/* List Value */}
                <CurrencyField label="List Value" value={formData.listPrice} onChangeValue={value => setFormData(p => ({...p, listPrice: value }))} />
                {/* Sold Prive */}
                <CurrencyField label="Sold Price" value={formData.soldPrice} onChangeValue={value => setFormData(p => ({...p, soldPrice: value }))} />

            </View>
            <View className='w-full items-center'>
                <Pressable className='bg-emerald-600 w-[80%] rounded-2xl'
                    onPress={createBird}
                >
                    <View className='flex flex-row justify-center items-center'>
                        <AntDesign name="plus-circle" size={24} color="white" />
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