import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { View, Text, Pressable, Modal, TextInput, ScrollView } from "react-native";

export interface FormModalProps {
    name: string,
    control: any,
    title: string,
    items: { label:string, value: any }[],
    showSearch?: boolean,
    placeholder?: string,
    required?: boolean
}

export default function FormModalComponent({ name, control, title, items, showSearch = true, placeholder = "None selected", required = false}: FormModalProps){
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
                        <View className='flex flex-row justify-between items-center bg-gray-200 px-5 py-2 my-1'>
                            <View className="flex flex-row">
                                <Text>{title}</Text>{required && <Text className="font-bold text-red-600">*</Text>}
                            </View>
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
