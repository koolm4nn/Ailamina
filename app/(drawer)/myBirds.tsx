import { useBirds } from "@/lib/hooks/useBirds";
import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bird } from "@/types/bird";
import { router } from "expo-router";
import { useSelectedBird } from "@/stores/useSelectedBird";


// Details => Detail-Screen just as creation screen
// Filter: Modal, show active filters on screen
// Sort: Sort by only visible columns?
// Lazy Loading / Client Pagination
// Empty State
function MyBirdsScreen(){
    const {data, isLoading, error } = useBirds();

    const [filteredBirds, setFilteredBirds] = useState(data);
    const { selectedBird, setSelectedBird, clearSelectedBird } = useSelectedBird();

    if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading birds: {error.message}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ padding: 0 }}
        keyboardShouldPersistTaps="handled"
        className='bg-white'
      >
        <View className="static flex h-full">
          {data?.map(bird => (
            <SingleBirdRowEntry 
              bird={bird} 
              key={bird.id} 
              onSelect={() => {setSelectedBird(bird)}} 
              isSelected={selectedBird === bird}/>
          ))}
        </View>
        <View className="mb-20"></View>
        <View className="mb-20"></View>
        <View className="mb-20"></View>
      </ScrollView>
      <View
        className="absolute bottom-20 flex flex-row justify-between items-center w-full px-10"
      >
        <FilterModalButton />
        <AddBirdModalButton />
      </View>
    </>
  );
}

function AddBirdModalButton(){
    const { clearSelectedBird } = useSelectedBird();
  return (
    <View className="rounded-full items-center justify-center">
      <Pressable
        onPress={() => { 
          clearSelectedBird();
          router.push("/createBird"); 
        }}
      >
        {({ pressed }) => (
          <View className={`${pressed? "bg-success/80" : "bg-success"} p-5 rounded-full shadow`}>
            <MaterialCommunityIcons name="plus" size={45} color="#ffffffff" className=''/>
          </View>
        )}
      </Pressable>
    </View>
  )
}

function FilterModalButton(){
  return (
    <View className="items-center justify-center">
      <Pressable
        onPress={() => {}}
      >
        {({ pressed }) => (
          <View className={`${pressed? "bg-text/50" : "bg-text"} px-10 py-5 rounded-lg`}>
            <Text className="text-text-light">
              Filter
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  )
}

function SingleBirdRowEntry({ bird, onSelect, isSelected }: {bird: Bird, onSelect: (bird: Bird) => void, isSelected: boolean}){
    const { setSelectedBird } = useSelectedBird();
  return (
    <View>
      <Pressable
        onPress={() => {onSelect(bird)}}
      >
        <View 
          className={`flex flex-row justify-between items-center mb-1 py-5 pl-4 pr-2 ${isSelected? "bg-accent/50 border-b border-dashed border-gray-600" : " bg-gray-200"}`}
        >
          <Text className="text-2xl">{bird.name}</Text>
          <Pressable 
            className="justify-end bg-gray-700 rounded items-center justify-center p-2 mr-2 "
            onPress={() => {
              setSelectedBird(bird);
              router.push("/editBird") 
            }}  
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#ffffffff" className=''/>
          </Pressable>
        </View>
        {(isSelected && 
          <View className="px-5">
            <Text>{`Image`}</Text>
            <Text>{`Common Name: ${bird.common_name}`}</Text>
            <Text>{`Sex: ${bird.sex}`}</Text>
            <Text>{`Hatch Date: ${bird.hatch_date}`}</Text>
            <Text>{`Status: ${bird.status}`}</Text>
            <Text>{`Main identifier: ${bird.id1}`}</Text>
            {bird.id2 && <Text>{`Additional identifier: ${bird.id2}`}</Text>}
            {bird.id3 && <Text>{`Additional identifier: ${bird.id3}`}</Text>}
            <Text>{`Name: ${bird.name}`}</Text>
            <Text>{`Order: ${bird.taxonomic_order}`}</Text>
            <Text>{`Family: ${bird.family}`}</Text>
            <Text>{`Genus: ${bird.genus}`}</Text>
            <Text>{`Species: ${bird.species}`}</Text>
            <Text>{`Subspecies: ${bird.sub_species}`}</Text>
            <Text>{`Breeder Information: ${bird.breeder_info}`}</Text>
            <Text>{`Location: ${bird.location}`}</Text>
            <Text>{`Body Condition: ${bird.body_condition}`}</Text>
            <Text>{`Feather Condition: ${bird.feather_condition}`}</Text>
            <Text>{`Breeding Quality: ${bird.breeding_quality}`}</Text>
            <Text>{`Mutations: ${bird.mutations}`}</Text>
            <Text>{`Cost: ${bird.cost}`}</Text>
            <Text>{`Market Value: ${bird.market_value}`}</Text>
            <Text>{`List Price: ${bird.list_price}`}</Text>
            <Text>{`Sold Price: ${bird.sold_price}`}</Text>
            <Text>Parents</Text>
          </View>)}
      </Pressable>
    </View>

  )
}

export default MyBirdsScreen;