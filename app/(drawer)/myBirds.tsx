import { useBirds } from "@/lib/hooks/useBirds";
import { useState } from "react";
import { View, Text } from "react-native";


// Details => Detail-Screen just as creation screen
// Filter: Modal, show active filters on screen
// Sort: Sort by only visible columns?
// Lazy Loading / Client Pagination
// Empty State
function MyBirdsScreen(){
    const {data, isLoading, error } = useBirds();

    const [filteredBirds, setFilteredBirds] = useState(data);

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
    <View>
      {data?.map(bird => (
  <Text key={bird.id}>{bird.name}</Text>
))}
    </View>
  );
}

export default MyBirdsScreen;