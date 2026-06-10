import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

export default function App() {
  const attractions = [
    {
      id: 1,
      name: "Shpella e Gadimes",
      description: "Një nga atraksionet më të njohura turistike në Kosovë.",
      location: "Lipjan",
      rating: "⭐ 4.9",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    },
    {
      id: 2,
      name: "Qendra e Lipjanit",
      description: "Qendra kryesore e qytetit me kafene dhe restorante.",
      location: "Lipjan",
      rating: "⭐ 4.7",
      image:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1d?w=800",
    },
    {
      id: 3,
      name: "Parku i Qytetit",
      description: "Vend ideal për relaks dhe shëtitje.",
      location: "Lipjan",
      rating: "⭐ 4.8",
      image:
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800",
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Restaurant Lipjani",
      description: "Ushqime tradicionale shqiptare.",
      location: "Lipjan",
      rating: "⭐ 4.6",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    },
    {
      id: 2,
      name: "Pizzeria Verona",
      description: "Pizza dhe ushqime italiane.",
      location: "Lipjan",
      rating: "⭐ 4.5",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    },
  ];

  const hotels = [
    {
      id: 1,
      name: "Hotel Park",
      description: "Akomodim modern dhe komod.",
      location: "Lipjan",
      rating: "⭐ 4.7",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
      id: 2,
      name: "Hotel Center",
      description: "Hotel në zemër të qytetit.",
      location: "Lipjan",
      rating: "⭐ 4.6",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    },
  ];

  const [data, setData] = useState(attractions);
  const [title, setTitle] = useState("Atraksione");
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🏙 Lipjan City Guide</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text>Atraksione</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2</Text>
          <Text>Restorante</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2</Text>
          <Text>Hotele</Text>
        </View>
      </View>

      <TextInput
        placeholder="🔍 Kërko..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setData(attractions);
            setTitle("Atraksione");
          }}
        >
          <Text style={styles.buttonText}>📍 Turizëm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setData(restaurants);
            setTitle("Restorante");
          }}
        >
          <Text style={styles.buttonText}>🍔 Restorante</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setData(hotels);
            setTitle("Hotele");
          }}
        >
          <Text style={styles.buttonText}>🏨 Hotele</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <View style={styles.infoRow}>
                <Text>📍 {item.location}</Text>
                <Text>{item.rating}</Text>
              </View>
            </View>
          </View>
        )}
      />

      <Text style={styles.footer}>
        Developed with React Native & Flask
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 15,
  },

  logo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
    color: "#0f172a",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statBox: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },

  search: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },

  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e293b",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 170,
  },

  cardContent: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  description: {
    color: "#64748b",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footer: {
    textAlign: "center",
    color: "#64748b",
    marginVertical: 10,
  },
});