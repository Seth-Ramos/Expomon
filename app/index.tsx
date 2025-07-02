import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image as RNImage, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          PokemonGB: require("../assets/fonts/PokemonGB.ttf"), // Replace with your font file path
        });
        setFontsLoaded(true); // Update state when font is loaded
      } catch (error) {
        console.error("Error loading font:", error); // Log errors if font fails to load
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    // Render a fallback component while the font is loading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }


  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);
    setPokemon(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon not found');
      const data = await res.json();
      setPokemon(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
       <TextInput
          placeholder="Search Pokedex"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          autoCapitalize="none"
        />
        <Button title="Search" onPress={fetchPokemon}/>
        </View>
        {loading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
      {pokemon && (
        <View style={styles.resultContainer}>
          <Text style={styles.text}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
          <RNImage
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />
          <Text style={styles.text}>
            Type: {pokemon.types.map((t: any) => t.type.name).join(', ')}
          </Text>
        </View>


      )}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e83030",
  },
  search: {
    flex: 1,
    borderRadius: 5,
    width: '80%',
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#e83030',
  },
  pokemonImage: {
    borderWidth: 10,
    borderRadius: 10,
    width: 200,
    height: 200,
    marginVertical: 20,
    backgroundColor: 'white',
  },
  resultContainer: {
    borderWidth: 10,
    borderRadius: 10,
    marginHorizontal: 40,
    backgroundColor: "#fc9ca4",
    alignItems: "center",
    marginTop: 20,
  },
  text:{
    color: 'black',
    fontSize: 18,
    fontFamily: 'PokemonGB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
