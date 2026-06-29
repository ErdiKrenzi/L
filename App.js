import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Image, FlatList, TextInput, Alert, ActivityIndicator, Dimensions, Modal, Platform
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

// react-native-maps nuk mbështetet në web — importohet dinamikisht vetëm në mobile
const isWeb = Platform.OS === 'web';
let MapView = null;
let Marker = null;
if (!isWeb) {
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
}

const API_URL = "http://localhost:5000";
const { width } = Dimensions.get("window");
// --- 🔐 AUTHENTICATION STATE PUBLISHER (Zero-dependency Global State) ---
export const AuthState = {
  user: null, // { token, username, role }
  listeners: [],
  setUser(userData) {
    this.user = userData;
    this.listeners.forEach(l => l(userData));
  },
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

// --- UTILS & HELPERS ---
function getGreeting() {
  const hrs = new Date().getHours();
  if (hrs >= 5 && hrs < 12) {
    return { text: "Mirëmëngjes", icon: "☀️", subtext: "Niseni mbarë ditën në Lipjan!" };
  } else if (hrs >= 12 && hrs < 18) {
    return { text: "Mirëdita", icon: "🌤️", subtext: "Zbuloni qytetin tuaj sot" };
  } else {
    return { text: "Mirëmbrëma", icon: "🌙", subtext: "Kalofshi një mbrëmje të qetë" };
  }
}

// --- 1. BALLINA (HomeScreen) ---
function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(AuthState.user);

  // States for Editing News
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImg, setEditImg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const greeting = getGreeting();

  const fetchNews = () => {
    setLoading(true);
    fetch(`${API_URL}/news`)
      .then((res) => {
        if (!res.ok) throw new Error("Gabim nga serveri");
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // FALLBACK DATA: Nëse serveri dështon, aplikacioni shfaq këto dhe nuk bllokohet!
        setNews([
          {
            id: 1,
            title: "Mirësevini në Aplikacion!",
            description: "Njoftimet do të ngarkohen sapo serveri të jetë plotësisht aktiv.",
            image: "https://via.placeholder.com/150"
          },
          {
            id: 2,
            title: "Linjat e Autobusëve",
            description: "Orari i ri i autobusëve urbanë është përditësuar në profilin e transportit.",
            image: "https://via.placeholder.com/150"
          }
        ]);
        setLoading(false); // E NDALON RROTULLËN ME DETYRIM!
      });
  };
  useEffect(() => {
    fetchNews();
    return AuthState.subscribe((u) => setUser(u));
  }, []);

  const handleDeleteNews = (id) => {
    Alert.alert(
      "Konfirmim",
      "A jeni të sigurt që dëshironi të fshini këtë njoftim?",
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Fshi",
          style: "destructive",
          onPress: () => {
            fetch(`${API_URL}/api/news/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${user.token}` }
            })
              .then(res => {
                if (res.ok) {
                  Alert.alert("Sukses", "Njoftimi u fshi me sukses!");
                  fetchNews();
                } else {
                  Alert.alert("Gabim", "Dështoi fshirja e njoftimit.");
                }
              })
              .catch(() => Alert.alert("Gabim", "Serveri nuk përgjigjet!"));
          }
        }
      ]
    );
  };

  const handleOpenEdit = (item) => {
    setSelectedNews(item);
    setEditTitle(item.title || item[1]);
    setEditDesc(item.description || item[2]);
    setEditImg(item.image || item[3] || "");
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle || !editDesc) {
      Alert.alert("Gabim", "Plotësoni titullin dhe përshkrimin!");
      return;
    }
    setActionLoading(true);
    fetch(`${API_URL}/api/news/${selectedNews.id || selectedNews[0]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ title: editTitle, description: editDesc, image: editImg })
    })
      .then(res => {
        setActionLoading(false);
        if (res.ok) {
          Alert.alert("Sukses", "Njoftimi u ndryshua me sukses!");
          setEditModalVisible(false);
          fetchNews();
        } else {
          Alert.alert("Gabim", "Dështoi ndryshimi i njoftimit.");
        }
      })
      .catch(() => { setActionLoading(false); Alert.alert("Gabim", "Serveri nuk përgjigjet!"); });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e3a8a", "#0284c7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.topHeaderTitle}>myLipjan</Text>
          <View style={styles.headerWeatherBadge}>
            <Text style={styles.headerWeatherText}>☀️ 20°C</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.miniAdminBtn} onPress={() => {
          if (user && user.role === "admin") {
            navigation.navigate("AdminPanel");
          } else {
            navigation.navigate("Login");
          }
        }}>
          <View style={styles.adminIconBox}>
            <Text style={{ fontSize: 13 }}>{user ? "👤" : "🔑"}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* KARTA E MADHE E BALLINËS */}
        <View style={styles.cardContainer}>
          <LinearGradient colors={["#ffffff", "#f1f5f9"]} style={styles.mainGreetingCard}>
            <View style={styles.greetingRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.moonIconContainer}>
                  <Text style={{ fontSize: 22 }}>{greeting.icon}</Text>
                </LinearGradient>
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.greetingTitle}>{greeting.text}</Text>
                  <Text style={styles.greetingSubText}>{greeting.subtext}</Text>
                </View>
              </View>
            </View>

            {/* 4 Butonat e Shpejtë Grid */}
            <View style={styles.quickButtonsGrid}>
              <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Menuja", { screen: "SubSherbimi", params: { kategori: "Turizmi", endpoint: "attractions" } })}>
                <LinearGradient colors={["#eff6ff", "#dbeafe"]} style={styles.qIconCircle}>
                  <Text style={{ fontSize: 22 }}>🏞️</Text>
                </LinearGradient>
                <Text style={styles.qBtnLabel}>Turizëm</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Bizneset")}>
                <LinearGradient colors={["#fef2f2", "#fee2e2"]} style={styles.qIconCircle}>
                  <Text style={{ fontSize: 22 }}>🏪</Text>
                </LinearGradient>
                <Text style={styles.qBtnLabel}>Bizneset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Transporti")}>
                <LinearGradient colors={["#f0fdf4", "#dcfce7"]} style={styles.qIconCircle}>
                  <Text style={{ fontSize: 22 }}>🚌</Text>
                </LinearGradient>
                <Text style={styles.qBtnLabel}>Transport</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Menuja", { screen: "SubSherbimi", params: { kategori: "Farmacitë", endpoint: "pharmacies" } })}>
                <LinearGradient colors={["#fdf2f8", "#fce7f3"]} style={styles.qIconCircle}>
                  <Text style={{ fontSize: 22 }}>💊</Text>
                </LinearGradient>
                <Text style={styles.qBtnLabel}>Farmaci</Text>
              </TouchableOpacity>
            </View>

            {/* Shiriti i Raportimit */}
            <TouchableOpacity style={styles.innerReportBar} onPress={() => navigation.navigate("Menuja", { screen: "RaportoAnkese" })}>
              <View style={styles.innerReportLeft}>
                <LinearGradient colors={["#ef4444", "#dc2626"]} style={styles.alertIconBg}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>!</Text>
                </LinearGradient>
                <Text style={styles.innerReportText}>Raporto një Problem në Komunë</Text>
              </View>
              <Text style={{ color: "#3b82f6", fontSize: 16, fontWeight: "bold" }}>➔</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* FARMACIA KUJDESTARE SOT */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>💼</Text>
              <Text style={styles.sectionMainTitle}>Farmacia Kujdestare Sot</Text>
            </View>
          </View>
          <View style={styles.pharmacyKujdestareCard}>
            <LinearGradient colors={["#ecfdf5", "#a7f3d0"]} style={styles.pharmacyIconBox}>
              <Text style={{ fontSize: 22 }}>🏥</Text>
            </LinearGradient>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.pharmacyName}>Mentha Pharmacy</Text>
              <Text style={styles.pharmacyAddress}>📍 Rr. Lidhja e Prizrenit, Lipjan</Text>
              <View style={styles.kujdestareTag}>
                <Text style={styles.kujdestareTagText}>Hapur 24/7</Text>
              </View>
            </View>
          </View>
        </View>

        {/* NJOFTIMET HORIZONTALE */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>📢</Text>
              <Text style={styles.sectionMainTitle}>Njoftimet e Fundit</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#1e3a8a" style={{ marginTop: 15 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
              {Array.isArray(news) && news.map((item) => (
                <View key={item.id || item[0]} style={styles.horizontalNewsCard}>
                  <Image source={{ uri: item.image || item[3] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500" }} style={styles.horizImg} />
                  <View style={{ padding: 14 }}>
                    <Text numberOfLines={1} style={styles.horizNewsTitle}>{item.title || item[1]}</Text>
                    <Text numberOfLines={2} style={styles.horizNewsDesc}>{item.description || item[2]}</Text>

                    <View style={styles.newsFooterFlex}>
                      <Text style={styles.newsDateText}>📅 Lajm i Ri</Text>
                      {user && user.role === "admin" && (
                        <View style={styles.adminActionRowInline}>
                          <TouchableOpacity style={styles.editIconBadge} onPress={() => handleOpenEdit(item)}>
                            <Text style={{ fontSize: 12 }}>✏️</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteIconBadge} onPress={() => handleDeleteNews(item.id || item[0])}>
                            <Text style={{ fontSize: 12 }}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>

      {/* EDIT MODAL PËR LAJME */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeaderTitle}>Ndrysho Lajmin 📢</Text>

            <Text style={styles.formLabel}>Titulli</Text>
            <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} />

            <Text style={styles.formLabel}>Përshkrimi</Text>
            <TextInput style={[styles.input, { height: 100, textAlignVertical: "top" }]} multiline value={editDesc} onChangeText={setEditDesc} />

            <Text style={styles.formLabel}>URL e Fotos</Text>
            <TextInput style={styles.input} value={editImg} onChangeText={setEditImg} />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancelBtn]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: "#475569", fontWeight: "bold" }}>Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalSaveBtn]} onPress={handleSaveEdit} disabled={actionLoading}>
                {actionLoading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold" }}>Ruaj</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- 2. BIZNESET SCREEN (RESTORANTET) ---
function BiznesetScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(AuthState.user);

  // Edit business States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editRating, setEditRating] = useState("⭐ 5.0");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    fetch(`${API_URL}/restaurants`)
      .then((res) => {
        if (!res.ok) throw new Error("Gabim nga serveri");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        // FALLBACK DATA: Shtojmë të dhëna testuese nëse dështon fetch
        setItems([
          {
            id: 1,
            name: "Restorant Lipjani (Mock)",
            description: "Shijoni ushqimet më të mira tradicionale dhe moderne në qytet.",
            location: "Rr. Lidhja e Prizrenit, Lipjan",
            rating: "⭐ 4.8",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500"
          },
          {
            id: 2,
            name: "Pizzeria Roma (Mock)",
            description: "Pica në furrë druri dhe shërbim i shpejtë për të gjithë.",
            location: "Rr. Skënderbeu, Lipjan",
            rating: "⭐ 4.5",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
    return AuthState.subscribe((u) => setUser(u));
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Konfirmim",
      "A jeni të sigurt që dëshironi të fshini këtë biznes?",
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Fshi",
          style: "destructive",
          onPress: () => {
            fetch(`${API_URL}/api/businesses/restaurants/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${user.token}` }
            })
              .then(res => {
                if (res.ok) {
                  Alert.alert("Sukses", "Vendi u fshi me sukses!");
                  fetchItems();
                } else {
                  Alert.alert("Gabim", "Dështoi fshirja.");
                }
              })
              .catch(() => Alert.alert("Gabim", "Lidhja dështoi!"));
          }
        }
      ]
    );
  };

  const handleOpenEdit = (item) => {
    setSelectedPlace(item);
    setEditName(item.name || item[1]);
    setEditDesc(item.description || item[2]);
    setEditLoc(item.location || item[3] || "");
    setEditImg(item.image || item[5] || "");
    setEditRating(item.rating || item[4] || "⭐ 5.0");
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editName || !editDesc || !editLoc) {
      Alert.alert("Gabim", "Plotësoni të gjitha fushat kryesore!");
      return;
    }
    setActionLoading(true);
    fetch(`${API_URL}/api/businesses/restaurants/${selectedPlace.id || selectedPlace[0]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ name: editName, description: editDesc, location: editLoc, rating: editRating, image: editImg })
    })
      .then(res => {
        setActionLoading(false);
        if (res.ok) {
          Alert.alert("Sukses", "Biznesi u përditësua me sukses!");
          setEditModalVisible(false);
          fetchItems();
        } else {
          Alert.alert("Gabim", "Dështoi përditësimi.");
        }
      })
      .catch(() => { setActionLoading(false); Alert.alert("Gabim", "Lidhja dështoi!"); });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e3a8a", "#0284c7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>🏬 Bizneset në Lipjan</Text>
      </LinearGradient>
      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={Array.isArray(items) ? items : []}
          contentContainerStyle={{ padding: 15, paddingBottom: 110 }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" }} style={styles.itemCardImg} />
              <View style={styles.itemCardContent}>
                <View style={styles.itemCardHeader}>
                  <Text style={styles.itemCardName}>{item.name || item[1]}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{item.rating || "⭐ 5.0"}</Text>
                  </View>
                </View>
                <Text style={styles.itemCardDesc}>{item.description || item[2]}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <Text style={styles.itemCardLoc}>📍 {item.location || item[3] || "Lipjan"}</Text>
                  {user && user.role === "admin" && (
                    <View style={styles.adminActionRowCard}>
                      <TouchableOpacity style={styles.editBtnCard} onPress={() => handleOpenEdit(item)}>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Ndrysho</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtnCard} onPress={() => handleDelete(item.id || item[0])}>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Fshi</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* EDIT MODAL PËR BIZNESET */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeaderTitle}>Ndrysho Biznesin 🏪</Text>

            <Text style={styles.formLabel}>Emri</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} />

            <Text style={styles.formLabel}>Përshkrimi</Text>
            <TextInput style={[styles.input, { height: 70, textAlignVertical: "top" }]} multiline value={editDesc} onChangeText={setEditDesc} />

            <Text style={styles.formLabel}>Adresa / Lokacioni</Text>
            <TextInput style={styles.input} value={editLoc} onChangeText={setEditLoc} />

            <Text style={styles.formLabel}>Yjet (Rating)</Text>
            <TextInput style={styles.input} value={editRating} onChangeText={setEditRating} />

            <Text style={styles.formLabel}>URL e Fotos</Text>
            <TextInput style={styles.input} value={editImg} onChangeText={setEditImg} />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancelBtn]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: "#475569", fontWeight: "bold" }}>Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalSaveBtn]} onPress={handleSaveEdit} disabled={actionLoading}>
                {actionLoading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold" }}>Ruaj</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- 3. MAPA SCREEN (Harta e Lipjanit) ---
function MapaScreen() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const region = {
    latitude: 42.5217,
    longitude: 21.1275,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    if (isWeb) return; // Mos bëj fetch në web — nuk kemi hartë
    setLoading(true);
    fetch(`${API_URL}/api/map-places`)
      .then(res => {
        if (!res.ok) throw new Error("Gabim nga serveri");
        return res.json();
      })
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => {
        // FALLBACK DATA: Pika testuese në hartë nëse dështon lidhja
        setPlaces([
          { id: 1, name: "Komuna e Lipjanit (Mock)", category: "Institucion", latitude: 42.5217, longitude: 21.1275 },
          { id: 2, name: "Stacioni i Autobusëve (Mock)", category: "Transport", latitude: 42.5230, longitude: 21.1250 }
        ]);
        setLoading(false);
      });
  }, []);

  // ── Fallback për Web / PC ──
  if (isWeb) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style="light" />
        <View style={{
          backgroundColor: "#eff6ff",
          borderRadius: 24,
          padding: 36,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#bfdbfe",
          marginHorizontal: 30,
        }}>
          <Text style={{ fontSize: 52, marginBottom: 16 }}>🗺️</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1e3a8a", textAlign: "center", marginBottom: 10 }}>
            Harta nuk mbështetet në Web
          </Text>
          <Text style={{ fontSize: 14, color: "#475569", textAlign: "center", lineHeight: 22 }}>
            Ju lutem hapeni aplikacionin në{"\n"}📱 <Text style={{ fontWeight: "bold", color: "#0284c7" }}>Expo Go</Text> në telefon{"\n"}për të parë hartën interaktive të Lipjanit.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Versioni Mobile me MapView ──
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {loading ? (
        <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
      ) : (
        <MapView style={{ flex: 1 }} initialRegion={region}>
          {Array.isArray(places) && places.map(p => (
            <Marker
              key={`${p.category}-${p.id}`}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.name}
              description={p.category}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

// --- 4. TRANSPORTI SCREEN (Linjat e Busit) ---
function TransportScreen() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/bus_lines`)
      .then(res => {
        if (!res.ok) throw new Error("Gabim nga serveri");
        return res.json();
      })
      .then(data => {
        setLines(data);
        setLoading(false);
      })
      .catch(() => {
        // FALLBACK DATA: Linjat testuese të autobusëve
        setLines([
          {
            id: 1,
            route: "Lipjan - Prishtinë (Mock)",
            schedule: "Çdo 15 minuta (06:00 - 22:00)",
            price: "1.00 €"
          },
          {
            id: 2,
            route: "Lipjan - Janjevë (Mock)",
            schedule: "Çdo 1 orë (07:00 - 20:00)",
            price: "1.50 €"
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0f766e", "#134e4a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>🚌 Transporti / Linjat e Busit</Text>
      </LinearGradient>
      {loading ? (
        <ActivityIndicator size="large" color="#0f766e" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={Array.isArray(lines) ? lines : []}
          contentContainerStyle={{ padding: 15, paddingBottom: 110 }}
          keyExtractor={(item, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.busTicket}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketBusIconBox}>
                  <Text style={{ fontSize: 18 }}>🚌</Text>
                </View>
                <Text style={styles.ticketRouteTitle}>{item.route || item[1]}</Text>
              </View>
              <View style={styles.ticketBody}>
                <View style={styles.ticketRow}>
                  <Text style={styles.ticketLabel}>Oraret e Qarkullimit</Text>
                  <Text style={styles.ticketValue}>{item.schedule || item[2]}</Text>
                </View>
                <View style={styles.ticketDivider} />
                <View style={styles.ticketFooter}>
                  <View>
                    <Text style={styles.ticketPriceLabel}>Bileta njëdrejtimëshe</Text>
                    <Text style={styles.ticketPriceVal}>{item.price || item[3]}</Text>
                  </View>
                  <View style={styles.ticketStatusBadge}>
                    <Text style={styles.ticketStatusText}>Aktive</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// --- 5. MENUJA KRYESORE E SHERBIMEVE ---
function MenuScreen({ navigation }) {
  const [user, setUser] = useState(AuthState.user);
  useEffect(() => {
    return AuthState.subscribe((u) => setUser(u));
  }, []);

  const sherbimet = [
    { emri: "💊 Farmacitë", endpoint: "pharmacies" },
    { emri: "🏥 Shëndetësia", endpoint: "healthcare" },
    { emri: "🏦 Bankat", endpoint: "banks" },
    { emri: "🏛️ Institucionet", endpoint: "institutions" },
    { emri: "⚽ Sportet", endpoint: "sports" },
    { emri: "📚 Arsimi", endpoint: "education" },
    { emri: "🏧 ATM", endpoint: "atms" },
    { emri: "🚖 Taxi", endpoint: "taxis" },
    { emri: "🏞️ Turizmi", endpoint: "attractions" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#334155", "#1e293b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>☰ Shërbimet e Qytetit</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* Butoni i Raportimit lart te Menuja */}
        <TouchableOpacity style={styles.menuReportItem} onPress={() => navigation.navigate("RaportoAnkese")}>
          <LinearGradient colors={["#f43f5e", "#e11d48"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.menuReportGradient}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>⚠️</Text>
            <Text style={styles.menuReportText}>Raporto një Problem (Ankesë)</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.menuSectionTitle}>Kategoritë e Shërbimeve:</Text>

        <View style={styles.menuGridContainer}>
          {Array.isArray(sherbimet) && sherbimet.map((s, index) => (
            <TouchableOpacity key={index} style={styles.menuListItem} onPress={() => navigation.navigate("SubSherbimi", { kategori: s.emri, endpoint: s.endpoint })}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemText}>{s.emri}</Text>
              </View>
              <Text style={styles.menuItemArrow}>➔</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Ekrani Dinamik që shfaq të dhënat për çdo shërbim që klikohet te Menuja (Me CRUD)
function SubSherbimiScreen({ route }) {
  const { kategori, endpoint } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(AuthState.user);

  // Edit state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editRating, setEditRating] = useState("⭐ 5.0");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_URL}/${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error("Gabim");
        return res.json();
      })
      .then(resData => { setData(resData); setLoading(false); })
      .catch(() => {
        // FALLBACK DATA: Mbushim shtetin me të dhëna testuese në rast dështimi
        setData([
          {
            id: 1,
            name: `Shërbimi ${kategori} (Mock)`,
            description: `Të dhënat për ${kategori} nuk mund të ngarkoheshin nga serveri.`,
            location: "Lipjan",
            rating: "⭐ 5.0",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    return AuthState.subscribe((u) => setUser(u));
  }, [endpoint]);

  const handleDelete = (id) => {
    Alert.alert(
      "Konfirmim",
      `A jeni të sigurt që dëshironi të fshini këtë zë nga ${kategori}?`,
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Fshi",
          style: "destructive",
          onPress: () => {
            fetch(`${API_URL}/api/businesses/${endpoint}/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${user.token}` }
            })
              .then(res => {
                if (res.ok) {
                  Alert.alert("Sukses", "U fshi me sukses!");
                  fetchData();
                } else {
                  Alert.alert("Gabim", "Dështoi fshirja.");
                }
              })
              .catch(() => Alert.alert("Gabim", "Serveri nuk përgjigjet!"));
          }
        }
      ]
    );
  };

  const handleOpenEdit = (item) => {
    setSelectedPlace(item);
    setEditName(item.name || item[1]);
    setEditDesc(item.description || item[2]);
    setEditLoc(item.location || item[3] || "");
    setEditImg(item.image || item[5] || "");
    setEditRating(item.rating || item[4] || "⭐ 5.0");
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editName || !editDesc || !editLoc) {
      Alert.alert("Gabim", "Plotësoni të gjitha fushat kryesore!");
      return;
    }
    setActionLoading(true);
    fetch(`${API_URL}/api/businesses/${endpoint}/${selectedPlace.id || selectedPlace[0]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ name: editName, description: editDesc, location: editLoc, rating: editRating, image: editImg })
    })
      .then(res => {
        setActionLoading(false);
        if (res.ok) {
          Alert.alert("Sukses", "U përditësua me sukses!");
          setEditModalVisible(false);
          fetchData();
        } else {
          Alert.alert("Gabim", "Dështoi përditësimi.");
        }
      })
      .catch(() => { setActionLoading(false); Alert.alert("Gabim", "Lidhja dështoi!"); });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e3a8a", "#0284c7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>{kategori}</Text>
      </LinearGradient>
      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={Array.isArray(data) ? data : []}
          contentContainerStyle={{ padding: 15, paddingBottom: 110 }}
          keyExtractor={(item, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500" }} style={styles.itemCardImg} />
              <View style={styles.itemCardContent}>
                <View style={styles.itemCardHeader}>
                  <Text style={styles.itemCardName}>{item.name || item[1]}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{item.rating || "⭐ 5.0"}</Text>
                  </View>
                </View>
                <Text style={styles.itemCardDesc}>{item.description || item[2]}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <Text style={styles.itemCardLoc}>📍 {item.location || item[3] || "Lipjan"}</Text>
                  {user && user.role === "admin" && (
                    <View style={styles.adminActionRowCard}>
                      <TouchableOpacity style={styles.editBtnCard} onPress={() => handleOpenEdit(item)}>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Ndrysho</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtnCard} onPress={() => handleDelete(item.id || item[0])}>
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Fshi</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* EDIT MODAL PËR SUBSHERBIMIN */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeaderTitle}>Ndrysho Rekordin 📝</Text>

            <Text style={styles.formLabel}>Emri</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} />

            <Text style={styles.formLabel}>Përshkrimi</Text>
            <TextInput style={[styles.input, { height: 70, textAlignVertical: "top" }]} multiline value={editDesc} onChangeText={setEditDesc} />

            <Text style={styles.formLabel}>Lokacioni</Text>
            <TextInput style={styles.input} value={editLoc} onChangeText={setEditLoc} />

            <Text style={styles.formLabel}>Vlerësimi (Rating)</Text>
            <TextInput style={styles.input} value={editRating} onChangeText={setEditRating} />

            <Text style={styles.formLabel}>URL e Fotos</Text>
            <TextInput style={styles.input} value={editImg} onChangeText={setEditImg} />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancelBtn]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: "#475569", fontWeight: "bold" }}>Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalSaveBtn]} onPress={handleSaveEdit} disabled={actionLoading}>
                {actionLoading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold" }}>Ruaj</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Moduli i Raportimit (Ankesat)
function ReportScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const dërgoRaportin = () => {
    if (!title || !desc) { Alert.alert("Gabim", "Ju lutem plotësoni të gjitha fushat!"); return; }
    setLoading(true);
    fetch(`${API_URL}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category: "Ankesë", description: desc, location: "Lipjan" }),
    }).then(res => {
      setLoading(false);
      if (res.ok) {
        Alert.alert("Sukses", "Raporti u dërgua me sukses në Komunë!", [
          { text: "Rregull", onPress: () => navigation.goBack() }
        ]);
        setTitle(""); setDesc("");
      } else {
        Alert.alert("Gabim", "Dërgimi dështoi. Provoni përsëri më vonë.");
      }
    }).catch(() => {
      setLoading(false);
      Alert.alert("Gabim", "Lidhja me serverin dështoi. Sigurohuni që serveri është online!");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#e11d48", "#be123c"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>Faqja e Raportimit</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.formLabel}>Titulli i Problemit</Text>
        <TextInput style={styles.input} placeholder="P.sh. Ndriçimi publik nuk punon..." placeholderTextColor="#94a3b8" value={title} onChangeText={setTitle} />

        <Text style={styles.formLabel}>Përshkrimi i Detajuar</Text>
        <TextInput style={[styles.input, { height: 140, textAlignVertical: "top" }]} multiline placeholder="Përshkruani problemin sa më saktë, duke përfshirë lokacionin..." placeholderTextColor="#94a3b8" value={desc} onChangeText={setDesc} />

        <TouchableOpacity style={styles.btnSend} onPress={dërgoRaportin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>DËRGO NË KOMUNË ➔</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 🔑 LOGIN SCREEN ---
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Gabim", "Plotësoni të gjitha fushat!");
      return;
    }

    // ADMIN BYPASS: Nëse username dhe password janë 'admin', kyçet direkt pa u lidhur me serverin
    if (username.toLowerCase() === "admin" && password === "admin") {
      const mockAdminUser = { token: "mock-admin-token", username: "admin", role: "admin" };
      AuthState.setUser(mockAdminUser);
      Alert.alert("Sukses", "Hyrja si Admin u krye me sukses (Bypass)!");
      try {
        navigation.navigate("AdminPanel");
      } catch (err) {
        navigation.navigate("Admin");
      }
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        setLoading(false);
        if (res.status === 401) {
          throw new Error("Përdoruesi ose fjalëkalimi i gabuar!");
        }
        if (!res.ok) {
          throw new Error("Lidhja me serverin dështoi.");
        }
        return res.json();
      })
      .then(data => {
        AuthState.setUser(data);
        Alert.alert("Sukses", `Mirësevini ${data.username}!`);
        if (data.role === "admin") {
          try {
            navigation.navigate("AdminPanel");
          } catch (err) {
            navigation.navigate("Admin");
          }
        } else {
          navigation.navigate("Ballina");
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Gabim", err.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e3a8a", "#0284c7"]} style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>Hyrja në myLipjan 🔐</Text>
      </LinearGradient>
      <View style={{ flex: 1, justifyContent: "center", padding: 25 }}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Kyçja si Administrator</Text>
          <Text style={styles.loginSub}>Përdorni llogarinë tuaj për të kryer veprime CRUD.</Text>

          <Text style={styles.formLabel}>Përdoruesi</Text>
          <TextInput
            style={styles.input}
            placeholder="Username (p.sh. admin)"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.formLabel}>Fjalëkalimi</Text>
          <TextInput
            style={styles.input}
            placeholder="Password (p.sh. lipjani2026)"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.btnSend} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>KYÇU</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- 🛠️ PANELI I ADMINIT (Ekrani i Administrimit me listë ankesash) ---
function AdminScreen({ navigation }) {
  const [user, setUser] = useState(AuthState.user);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsImg, setNewsImg] = useState("");

  const [bizName, setBizName] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [bizLoc, setBizLoc] = useState("");
  const [bizCat, setBizCat] = useState("restaurants");
  const [bizImg, setBizImg] = useState("");

  const fetchReports = () => {
    if (!user) return;
    setReportsLoading(true);
    fetch(`${API_URL}/api/reports`, {
      headers: { "Authorization": `Bearer ${user.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Gabim");
        return res.json();
      })
      .then(data => { setReports(data); setReportsLoading(false); })
      .catch(() => {
        // FALLBACK DATA: Lista e ankesave testuese nëse serveri nuk përgjigjet
        setReports([
          {
            id: 1,
            title: "Mbeturinat në Rrugën Kryesore (Mock)",
            description: "Ka grumbullim të mbeturinave afër shkollës.",
            location: "Rr. Skënderbeu, Lipjan",
            date: "Sot"
          },
          {
            id: 2,
            title: "Gropë në Rrugë (Mock)",
            description: "Një gropë e madhe po rrezikon veturat.",
            location: "Rr. Lidhja e Prizrenit, Lipjan",
            date: "Dje"
          }
        ]);
        setReportsLoading(false);
      });
  };

  useEffect(() => {
    const unsub = AuthState.subscribe((u) => {
      setUser(u);
    });
    fetchReports();
    return unsub;
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 30 }]}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Qasje e Ndaluar 🔒</Text>
        <Text style={{ textAlign: "center", color: "#64748b", marginBottom: 20 }}>Duhet të jeni i kyçur si administrator për të parë këtë faqe.</Text>
        <TouchableOpacity style={[styles.btnSend, { width: 200 }]} onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Shko tek Kyçja</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e293b", "#0f172a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topHeader}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>🔑 Paneli i Adminit</Text>
        <TouchableOpacity onPress={() => { AuthState.setUser(null); navigation.navigate("Ballina"); }}>
          <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Dil</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={{ padding: 20 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* SHTO LAJM */}
        <View style={styles.adminSectionCard}>
          <Text style={styles.adminSectionTitle}>📢 Shto Njoftim të Ri</Text>
          <TextInput style={styles.input} placeholder="Titulli i Njoftimit..." placeholderTextColor="#94a3b8" value={newsTitle} onChangeText={setNewsTitle} />
          <TextInput style={styles.input} placeholder="Përshkrimi..." placeholderTextColor="#94a3b8" value={newsDesc} onChangeText={setNewsDesc} />
          <TextInput style={styles.input} placeholder="URL e Fotos..." placeholderTextColor="#94a3b8" value={newsImg} onChangeText={setNewsImg} />

          <TouchableOpacity style={[styles.btnSend, { backgroundColor: "#10b981" }]} onPress={() => {
            if (!newsTitle || !newsDesc) { Alert.alert("Gabim", "Plotësoni fushat e detyrueshme!"); return; }
            setLoading(true);
            fetch(`${API_URL}/api/add-news`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
              },
              body: JSON.stringify({ title: newsTitle, description: newsDesc, image: newsImg })
            }).then(res => {
              setLoading(false);
              if (res.ok) {
                Alert.alert("Sukses", "Njoftimi u publikua me sukses!");
                setNewsTitle(""); setNewsDesc(""); setNewsImg("");
              } else {
                Alert.alert("Gabim", "Nuk jeni i autorizuar ose kërkesa dështoi.");
              }
            }).catch(() => { setLoading(false); Alert.alert("Gabim", "Lidhja dështoi!"); });
          }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>PUBLIKO LAJMIN</Text>
          </TouchableOpacity>
        </View>

        {/* SHTO VEND / BIZNES */}
        <View style={styles.adminSectionCard}>
          <Text style={styles.adminSectionTitle}>🏪 Shto Vend / Biznes të Ri</Text>
          <TextInput style={styles.input} placeholder="Emri i Biznesit/Vendit..." placeholderTextColor="#94a3b8" value={bizName} onChangeText={setBizName} />
          <TextInput style={styles.input} placeholder="Përshkrimi..." placeholderTextColor="#94a3b8" value={bizDesc} onChangeText={setBizDesc} />
          <TextInput style={styles.input} placeholder="Lokacioni (Adresa)..." placeholderTextColor="#94a3b8" value={bizLoc} onChangeText={setBizLoc} />
          <TextInput style={styles.input} placeholder="Tabela (p.sh. restaurants, hotels, attractions)..." placeholderTextColor="#94a3b8" value={bizCat} onChangeText={setBizCat} />
          <TextInput style={styles.input} placeholder="URL e Fotos..." placeholderTextColor="#94a3b8" value={bizImg} onChangeText={setBizImg} />

          <TouchableOpacity style={[styles.btnSend, { backgroundColor: "#0284c7" }]} onPress={() => {
            if (!bizName || !bizDesc || !bizLoc) { Alert.alert("Gabim", "Plotësoni të gjitha fushat!"); return; }
            setLoading(true);
            fetch(`${API_URL}/api/add-business`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
              },
              body: JSON.stringify({ name: bizName, description: bizDesc, location: bizLoc, table: bizCat, image: bizImg })
            }).then(res => {
              setLoading(false);
              if (res.ok) {
                Alert.alert("Sukses", "Vendi i ri u shtua me sukses!");
                setBizName(""); setBizDesc(""); setBizLoc(""); setBizImg("");
              } else {
                Alert.alert("Gabim", "Dështoi shtimi i vendit. Kontrolloni kategorinë.");
              }
            }).catch(() => { setLoading(false); Alert.alert("Gabim", "Lidhja dështoi!"); });
          }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>SHTO VENDIN</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA E ANKESAVE TE QYTETAREVE */}
        <View style={styles.adminSectionCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={styles.adminSectionTitle}>⚠️ Ankesat nga Qytetarët</Text>
            <TouchableOpacity onPress={fetchReports}>
              <Text style={{ color: "#3b82f6", fontWeight: "bold", fontSize: 13 }}>Rifresko</Text>
            </TouchableOpacity>
          </View>

          {reportsLoading ? (
            <ActivityIndicator size="small" color="#1e293b" />
          ) : (!Array.isArray(reports) || reports.length === 0) ? (
            <Text style={{ color: "#64748b", fontSize: 13, fontStyle: "italic" }}>Nuk ka ankesa të regjistruara për momentin.</Text>
          ) : (
            Array.isArray(reports) && reports.map((rep, idx) => (
              <View key={idx} style={styles.reportItemCardAdmin}>
                <Text style={styles.reportTitleAdmin}>{rep.title || rep[1]}</Text>
                <Text style={styles.reportDescAdmin}>{rep.description || rep[3]}</Text>
                <Text style={styles.reportLocAdmin}>📍 {rep.location || rep[4] || "Lipjan"} | {rep[5] || "Tani"}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- TAB NAVIGATORI FINAL ---
const Tab = createBottomTabNavigator();
const MenuStack = createStackNavigator();

function MenuStackScreen() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuHome" component={MenuScreen} />
      <MenuStack.Screen name="SubSherbimi" component={SubSherbimiScreen} />
      <MenuStack.Screen name="RaportoAnkese" component={ReportScreen} />
    </MenuStack.Navigator>
  );
}

export default function App() {
  // Request notification permissions on app launch
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Enable notifications to receive urgent news alerts.');
        }
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bottomTabBar,
      }}>
        <Tab.Screen name="Ballina" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
        <Tab.Screen name="Bizneset" component={BiznesetScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏬</Text> }} />
        <Tab.Screen name="Mapa" component={MapaScreen} options={{
          tabBarIcon: () => (
            <LinearGradient colors={["#0284c7", "#0ea5e9"]} style={styles.raisedMapButton}>
              <Text style={{ fontSize: 22, color: "white" }}>🗺️</Text>
            </LinearGradient>
          ),
          tabBarLabel: ""
        }} />
        <Tab.Screen name="Transporti" component={TransportScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🚌</Text> }} />
        <Tab.Screen name="Menuja" component={MenuStackScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>☰</Text> }} />

        {/* Hidden auth and administration routes in Bottom Tabs */}
        <Tab.Screen name="Login" component={LoginScreen} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="AdminPanel" component={AdminScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- STILIZIMI ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  topHeaderTitle: { color: "white", fontSize: 22, fontWeight: "bold", letterSpacing: 0.5 },
  headerWeatherBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 10 },
  headerWeatherText: { color: "white", fontWeight: "bold", fontSize: 13 },
  miniAdminBtn: { padding: 4 },
  adminIconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },

  cardContainer: { paddingHorizontal: 15, marginTop: 15 },
  mainGreetingCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  greetingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  moonIconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  greetingTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  greetingSubText: { color: "#64748b", fontSize: 13, marginTop: 2 },

  quickButtonsGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 22, marginBottom: 15 },
  qBtn: { alignItems: "center", width: "22%" },
  qIconCircle: { width: 54, height: 54, borderRadius: 18, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.02)" },
  qBtnLabel: { fontSize: 12, color: "#475569", marginTop: 8, fontWeight: "600" },

  innerReportBar: { backgroundColor: "#fff5f5", padding: 14, borderRadius: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, borderWidth: 1, borderColor: "#fee2e2" },
  innerReportLeft: { flexDirection: "row", alignItems: "center" },
  alertIconBg: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 10 },
  innerReportText: { fontWeight: "bold", color: "#b91c1c", fontSize: 13 },

  sectionWrapper: { paddingHorizontal: 15, marginTop: 22 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionMainTitle: { fontSize: 17, fontWeight: "bold", color: "#0f172a" },

  pharmacyKujdestareCard: { backgroundColor: "white", padding: 16, borderRadius: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0", elevation: 3, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  pharmacyIconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  pharmacyName: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  pharmacyAddress: { fontSize: 12, color: "#64748b", marginTop: 3 },
  kujdestareTag: { alignSelf: "flex-start", backgroundColor: "#d1fae5", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 6 },
  kujdestareTagText: { color: "#065f46", fontSize: 11, fontWeight: "700" },

  horizontalNewsCard: { backgroundColor: "white", width: width * 0.7, borderRadius: 20, marginRight: 15, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0", elevation: 3, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  horizImg: { width: "100%", height: 120 },
  horizNewsTitle: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  horizNewsDesc: { color: "#64748b", fontSize: 11, marginTop: 4, lineHeight: 15 },
  newsFooterFlex: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  newsDateText: { fontSize: 11, color: "#3b82f6", fontWeight: "600" },
  adminActionRowInline: { flexDirection: "row", alignItems: "center" },
  editIconBadge: { backgroundColor: "#eff6ff", width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 8, borderWidth: 1, borderColor: "#bfdbfe" },
  deleteIconBadge: { backgroundColor: "#fff5f5", width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#fecaca" },

  bottomTabBar: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    elevation: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 70,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    paddingBottom: 10,
    borderTopWidth: 0,
  },
  raisedMapButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    bottom: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },

  itemCard: { backgroundColor: "white", borderRadius: 20, marginBottom: 15, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0", elevation: 3, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  itemCardImg: { width: "100%", height: 150 },
  itemCardContent: { padding: 15 },
  itemCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemCardName: { fontSize: 17, fontWeight: "bold", color: "#0f172a" },
  ratingBadge: { backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  ratingText: { color: "#d97706", fontSize: 11, fontWeight: "700" },
  itemCardDesc: { color: "#475569", marginVertical: 6, fontSize: 13, lineHeight: 18 },
  itemCardLoc: { fontSize: 12, color: "#64748b", fontWeight: "500", flex: 1, marginRight: 8 },
  adminActionRowCard: { flexDirection: "row" },
  editBtnCard: { backgroundColor: "#3b82f6", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 8 },
  deleteBtnCard: { backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },

  mapIllustrationCard: { padding: 30, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#bae6fd", elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },

  busTicket: { backgroundColor: "white", borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: "#e2e8f0", overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  ticketHeader: { backgroundColor: "#f0fdf4", padding: 15, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "#dcfce7" },
  ticketBusIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#dcfce7", justifyContent: "center", alignItems: "center" },
  ticketRouteTitle: { fontSize: 16, fontWeight: "bold", color: "#115e59", marginLeft: 12 },
  ticketBody: { padding: 15 },
  ticketRow: { marginBottom: 10 },
  ticketLabel: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: "600", letterSpacing: 0.5 },
  ticketValue: { fontSize: 14, color: "#334155", fontWeight: "500", marginTop: 2 },
  ticketDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8, borderStyle: "dashed" },
  ticketFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ticketPriceLabel: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: "600", letterSpacing: 0.5 },
  ticketPriceVal: { fontSize: 18, color: "#0f766e", fontWeight: "bold", marginTop: 2 },
  ticketStatusBadge: { backgroundColor: "#dcfce7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  ticketStatusText: { color: "#15803d", fontSize: 11, fontWeight: "700" },

  menuReportItem: { borderRadius: 16, overflow: "hidden", marginBottom: 15, elevation: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  menuReportGradient: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  menuReportText: { fontSize: 15, fontWeight: "bold", color: "white" },
  menuSectionTitle: { fontSize: 16, fontWeight: "bold", color: "#334155", marginVertical: 12 },
  menuGridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  menuListItem: { backgroundColor: "white", width: "48%", padding: 16, borderRadius: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0", elevation: 2, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemText: { fontSize: 13, color: "#1e293b", fontWeight: "600" },
  menuItemArrow: { color: "#3b82f6", fontSize: 13, fontWeight: "bold" },

  formLabel: { fontSize: 14, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: "#cbd5e1", color: "#1f2937", fontSize: 15 },
  btnSend: { backgroundColor: "#e11d48", padding: 15, borderRadius: 12, alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },

  loginCard: { backgroundColor: "white", padding: 25, borderRadius: 24, borderWidth: 1, borderColor: "#e2e8f0", elevation: 5, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 5, height: 5 } },
  loginTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a", textAlign: "center", marginBottom: 5 },
  loginSub: { fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 20 },

  adminSectionCard: { backgroundColor: "white", padding: 18, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "#e2e8f0", elevation: 3, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  adminSectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginBottom: 12 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContainer: { backgroundColor: "white", width: "100%", borderRadius: 24, padding: 24, elevation: 10 },
  modalHeaderTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a", marginBottom: 18, textAlign: "center" },
  modalBtnRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginLeft: 10, minWidth: 80, alignItems: "center" },
  modalCancelBtn: { backgroundColor: "#f1f5f9" },
  modalSaveBtn: { backgroundColor: "#3b82f6" },

  // Admin Reports items
  reportItemCardAdmin: { padding: 12, backgroundColor: "#f8fafc", borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  reportTitleAdmin: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  reportDescAdmin: { fontSize: 13, color: "#475569", marginVertical: 4 },
  reportLocAdmin: { fontSize: 11, color: "#94a3b8", fontWeight: "500" }
});