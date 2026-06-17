import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, Image, FlatList, TextInput, Alert, ActivityIndicator, Dimensions 
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

const API_URL = "http://192.168.0.25:5000"; 
const { width } = Dimensions.get("window");

// --- 1. BALLINA (HomeScreen) ---
function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then((res) => res.json())
      .then((data) => { setNews(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Headeri i stilit myLipjan me Moti (Weather) të integruar */}
      <View style={styles.topHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.topHeaderTitle}>myLipjan</Text>
          <View style={styles.headerWeatherBadge}>
            <Text style={styles.headerWeatherText}>☀️ 20°C</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.miniAdminBtn} onPress={() => navigation.navigate("AdminPanel")}>
          <Text style={{ fontSize: 14 }}>🔑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* KARTA E MADHE SIPAS FOTOS TËNDE */}
        <View style={styles.mainGreyCard}>
          <View style={styles.greetingRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.moonIconContainer}>
                <Text style={{ fontSize: 22 }}>🌙</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.greetingTitle}>Mirëmbrëma</Text>
                <Text style={styles.greetingSubText}>Zbuloni qytetin tuaj</Text>
              </View>
            </View>
          </View>

          {/* 4 Butonat e Shpejtë Grid */}
          <View style={styles.quickButtonsGrid}>
            <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Menuja", { screen: "SubSherbimi", params: { kategori: "Turizmi", endpoint: "attractions" } })}>
              <View style={styles.qIconCircle}><Text style={{fontSize: 20}}>🏞️</Text></View>
              <Text style={styles.qBtnLabel}>Turizëm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Bizneset")}>
              <View style={styles.qIconCircle}><Text style={{fontSize: 20}}>🏪</Text></View>
              <Text style={styles.qBtnLabel}>Bizneset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Transporti")}>
              <View style={styles.qIconCircle}><Text style={{fontSize: 20}}>🚌</Text></View>
              <Text style={styles.qBtnLabel}>Transport</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qBtn} onPress={() => navigation.navigate("Menuja", { screen: "SubSherbimi", params: { kategori: "Farmacitë", endpoint: "pharmacies" } })}>
              <View style={styles.qIconCircle}><Text style={{fontSize: 20}}>💊</Text></View>
              <Text style={styles.qBtnLabel}>Farmaci</Text>
            </TouchableOpacity>
          </View>

          {/* Shiriti i Raportimit */}
          <TouchableOpacity style={styles.innerReportBar} onPress={() => navigation.navigate("Menuja", { screen: "RaportoAnkese" })}>
            <View style={styles.innerReportLeft}>
              <View style={styles.alertIconBg}><Text style={{color: "white", fontWeight: "bold", fontSize: 13}}>!</Text></View>
              <Text style={styles.innerReportText}>Raporto një Problem</Text>
            </View>
            <Text style={{color: "#64748b", fontSize: 16}}>➔</Text>
          </TouchableOpacity>
        </View>

        {/* FARMACIA KUJDESTARE SOT */}
        <View style={styles.sectionWrapper}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>💼</Text>
            <Text style={styles.sectionMainTitle}>Farmacia Kujdestare Sot</Text>
          </View>
          <View style={styles.pharmacyKujdestareCard}>
            <View style={styles.pharmacyIconBox}><Text style={{fontSize: 20}}>🏥</Text></View>
            <View style={{marginLeft: 12}}>
              <Text style={styles.pharmacyName}>Mentha Pharmacy</Text>
              <Text style={styles.pharmacyAddress}>📍 Rr Lidhja e Prizrenit, Lipjan 14000</Text>
            </View>
          </View>
        </View>

        {/* NJOFTIMET HORIZONTALE */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>📢</Text>
              <Text style={styles.sectionMainTitle}>Njoftime</Text>
            </View>
            <TouchableOpacity><Text style={styles.shikoTeGjitha}>Shiko të Gjitha ➔</Text></TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#1e1b4b" style={{ marginTop: 10 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {news.map((item) => (
                <View key={item.id || item[0]} style={styles.horizontalNewsCard}>
                  <Image source={{ uri: item.image || item[3] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500" }} style={styles.horizImg} />
                  <View style={{ padding: 12 }}>
                    <Text numberOfLines={1} style={styles.horizNewsTitle}>{item.title || item[1]}</Text>
                    <Text numberOfLines={2} style={styles.horizNewsDesc}>{item.description || item[2]}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- 2. BIZNESET SCREEN ---
function BiznesetScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/restaurants`)
      .then((res) => res.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>🏬 Bizneset në Lipjan</Text>
      </View>
      {loading ? <ActivityIndicator size="large" color="#1e1b4b" style={{ marginTop: 20 }} /> : (
        <FlatList data={items} contentContainerStyle={{ padding: 15 }} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1e1b4b" }}>{item.name || item[1]}</Text>
            <Text style={{ color: "#475569", marginVertical: 5 }}>{item.description || item[2]}</Text>
            <Text style={{ fontSize: 13, color: "#64748b" }}>📍 {item.location || item[3] || "Lipjan"}</Text>
          </View>
        )} />
      )}
    </SafeAreaView>
  );
}

// --- 3. MAPA SCREEN (Harta e Lipjanit) ---
function MapaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, { backgroundColor: "#0284c7" }]}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>🗺️ Harta e Lipjanit</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1e293b", marginBottom: 10 }}>Harta e Qytetit</Text>
        <Text style={{ color: "#64748b", textAlign: "center" }}>Këtu ngarkohet plani i plotë navigues gjeografik i Lipjanit.</Text>
      </View>
    </SafeAreaView>
  );
}

// --- 4. TRANSPORTI SCREEN (Linjat e Busit) ---
function TransportScreen() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/bus_lines`)
      .then(res => res.json())
      .then(data => { setLines(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, { backgroundColor: "#0f766e" }]}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>🚌 Transporti / Linjat e Busit</Text>
      </View>
      {loading ? <ActivityIndicator size="large" style={{marginTop: 20}} /> : (
        <FlatList data={lines} contentContainerStyle={{ padding: 15 }} keyExtractor={(item, idx) => idx.toString()} renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#0f766e" }}>Prej/Deri: {item.route || item[1]}</Text>
            <Text style={{ marginVertical: 5, color: "#475569" }}>Oraret: {item.schedule || item[2]}</Text>
            <Text style={{ fontWeight: "bold", color: "#1e293b" }}>Çmimi: {item.price || item[3]}</Text>
          </View>
        )} />
      )}
    </SafeAreaView>
  );
}

// --- 5. MENUJA KRYESORE E SHERBIMEVE ---
function MenuScreen({ navigation }) {
  const sherbimet = [
    { emri: "💊 Farmacitë", endpoint: "pharmacies" },
    { emri: "🏥 Shëndetësia", endpoint: "health" },
    { emri: "🏦 Bankat", endpoint: "banks" },
    { emri: "🏛️ Institucionet", endpoint: "institutions" },
    { emri: "⚽ Sportet", endpoint: "sports" },
    { emri: "📚 Arsimi", endpoint: "education" },
    { emri: "🏧 ATM", endpoint: "atm" },
    { emri: "🚖 Taxi", endpoint: "taxi" },
    { emri: "🏞️ Turizmi", endpoint: "attractions" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, { backgroundColor: "#475569" }]}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>☰ Shërbimet e Qytetit</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        
        {/* Butoni i Raportimit lart te Menuja */}
        <TouchableOpacity style={styles.menuReportItem} onPress={() => navigation.navigate("RaportoAnkese")}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>⚠️ Raporto një Problem (Ankesë)</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1e293b", marginVertical: 10 }}>Kategoritë:</Text>
        
        {sherbimet.map((s, index) => (
          <TouchableOpacity key={index} style={styles.menuListItem} onPress={() => navigation.navigate("SubSherbimi", { kategori: s.emri, endpoint: s.endpoint })}>
            <Text style={{ fontSize: 16, color: "#1e293b", fontWeight: "500" }}>{s.emri}</Text>
            <Text style={{ color: "#94a3b8" }}>➔</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Ekrani Dinamik që shfaq të dhënat për çdo shërbim që klikohet te Menuja
function SubSherbimiScreen({ route }) {
  const { kategori, endpoint } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${endpoint}`)
      .then(res => res.json())
      .then(resData => { setData(resData); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  }, [endpoint]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>{kategori}</Text>
      </View>
      {loading ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : (
        <FlatList data={data} contentContainerStyle={{ padding: 15 }} keyExtractor={(item, idx) => idx.toString()} renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1e1b4b" }}>{item.name || item[1]}</Text>
            <Text style={{ color: "#475569", marginVertical: 5 }}>{item.description || item[2]}</Text>
            <Text style={{ fontSize: 13, color: "#64748b" }}>📍 {item.location || item[3] || "Lipjan"}</Text>
          </View>
        )} />
      )}
    </SafeAreaView>
  );
}

// Moduli i Raportimit
function ReportScreen() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const dërgoRaportin = () => {
    if (!title || !desc) { Alert.alert("Gabim", "Plotësoni fushat!"); return; }
    fetch(`${API_URL}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category: "Ankesë", description: desc, location: "Lipjan" }),
    }).then(res => {
      if (res.ok) {
        Alert.alert("Sukses", "Raporti u dërgua me sukses në Komunë!");
        setTitle(""); setDesc("");
      }
    }).catch(() => Alert.alert("Gabim", "Lidhja dështoi!"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topHeader, { backgroundColor: "#e11d48" }]}>
        <Text style={[styles.topHeaderTitle, { color: "white" }]}>Faqja e Raportimit</Text>
      </View>
      <View style={{ padding: 20 }}>
        <TextInput style={styles.input} placeholder="Titulli i problemit..." value={title} onChangeText={setTitle} />
        <TextInput style={[styles.input, { height: 120 }]} multiline placeholder="Përshkrimi i problemit..." value={desc} onChangeText={setDesc} />
        <TouchableOpacity style={styles.btnSend} onPress={dërgoRaportin}>
          <Text style={{ color: "white", fontWeight: "bold" }}>DËRGO NË KOMUNË</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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

// --- 🔐 PANELI I ADMINIT (Me foto për lajme/vende dhe Pop-up konfirmimi) ---
function AdminScreen() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsImg, setNewsImg] = useState("");
  
  const [bizName, setBizName] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [bizLoc, setBizLoc] = useState("");

  if (!authed) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", padding: 30 }]}>
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15 }}>Hyrja si Admin</Text>
        <TextInput secureTextEntry style={styles.input} placeholder="Fjalëkalimi..." value={pass} onChangeText={setPass} />
        <TouchableOpacity style={styles.btnSend} onPress={() => pass === "lipjani2026" ? setAuthed(true) : Alert.alert("Gabim", "I gabuar!")}>
          <Text style={{ color: "white", fontWeight: "bold" }}>KYÇU</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.sectionMainTitle}>📢 Shto Njoftim / Lajm të Ri</Text>
        <TextInput style={styles.input} placeholder="Titulli..." value={newsTitle} onChangeText={setNewsTitle} />
        <TextInput style={styles.input} placeholder="Përshkrimi..." value={newsDesc} onChangeText={setNewsDesc} />
        <TextInput style={styles.input} placeholder="URL e Fotos për Lajm..." value={newsImg} onChangeText={setNewsImg} />
        <TouchableOpacity style={[styles.btnSend, { backgroundColor: "#10b981", marginBottom: 25 }]} onPress={() => {
          if(!newsTitle || !newsDesc) return;
          fetch(`${API_URL}/api/add-news`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newsTitle, description: newsDesc, image: newsImg })
          }).then(() => { Alert.alert("Njoftim", "U shtua!"); setNewsTitle(""); setNewsDesc(""); setNewsImg(""); });
        }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>PUBLIKO LAJMIN</Text>
        </TouchableOpacity>

        <Text style={styles.sectionMainTitle}>🏪 Shto Biznes / Vend të Ri</Text>
        <TextInput style={styles.input} placeholder="Emri i Biznesit..." value={bizName} onChangeText={setBizName} />
        <TextInput style={styles.input} placeholder="Përshkrimi..." value={bizDesc} onChangeText={setBizDesc} />
        <TextInput style={styles.input} placeholder="Lokacioni..." value={bizLoc} onChangeText={setBizLoc} />
        <TouchableOpacity style={[styles.btnSend, { backgroundColor: "#0284c7" }]} onPress={() => {
          if(!bizName || !bizDesc) return;
          fetch(`${API_URL}/api/add-business`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: bizName, description: bizDesc, location: bizLoc, category: "restaurants" })
          }).then(() => { Alert.alert("Njoftim", "U shtua!"); setBizName(""); setBizDesc(""); setBizLoc(""); });
        }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>RREGULLO BIZNESIN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- TAB NAVIGATORI FINAL ---
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: "#1e1b4b",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: { height: 65, paddingBottom: 10, backgroundColor: "white" }
      }}>
        <Tab.Screen name="Ballina" component={HomeScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }} />
        <Tab.Screen name="Bizneset" component={BiznesetScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏬</Text> }} />
        <Tab.Screen name="Mapa" component={MapaScreen} options={{ 
          tabBarIcon: () => (
            <View style={styles.raisedMapButton}>
              <Text style={{ fontSize: 24, color: "white" }}>🗺️</Text>
            </View>
          ),
          tabBarLabel: ""
        }} />
        <Tab.Screen name="Transporti" component={TransportScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🚌</Text> }} />
        <Tab.Screen name="Menuja" component={MenuStackScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>☰</Text> }} />
        <Tab.Screen name="AdminPanel" component={AdminScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- STILIZIMI ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  topHeader: { backgroundColor: "#1e1b4b", paddingHorizontal: 20, paddingVertical: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topHeaderTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  headerWeatherBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 10 },
  headerWeatherText: { color: "white", fontWeight: "bold", fontSize: 13 },
  miniAdminBtn: { padding: 4, opacity: 0.7 },
  
  mainGreyCard: { backgroundColor: "#e2e8f0", padding: 20, borderRadius: 24, marginHorizontal: 15, marginVertical: 15 },
  greetingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  moonIconContainer: { width: 45, height: 45, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.4)", justifyContent: "center", alignItems: "center" },
  greetingTitle: { fontSize: 22, fontWeight: "bold", color: "#1e293b" },
  greetingSubText: { color: "#64748b", fontSize: 13, marginTop: 2 },
  
  quickButtonsGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 15 },
  qBtn: { alignItems: "center", width: "22%" },
  qIconCircle: { width: 50, height: 50, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.7)", justifyContent: "center", alignItems: "center" },
  qBtnLabel: { fontSize: 12, color: "#334155", marginTop: 6, fontWeight: "500" },
  
  innerReportBar: { backgroundColor: "rgba(255,255,255,0.8)", padding: 12, borderRadius: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  innerReportLeft: { flexDirection: "row", alignItems: "center" },
  alertIconBg: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#0284c7", justifyContent: "center", alignItems: "center", marginRight: 10 },
  innerReportText: { fontWeight: "bold", color: "#1e293b", fontSize: 14 },

  sectionWrapper: { paddingHorizontal: 15, marginTop: 15 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionMainTitle: { fontSize: 17, fontWeight: "bold", color: "#1e293b" },
  shikoTeGjitha: { color: "#0284c7", fontSize: 13, fontWeight: "600" },
  
  pharmacyKujdestareCard: { backgroundColor: "white", padding: 16, borderRadius: 18, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0", marginTop: 5 },
  pharmacyIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: "#f1f5f9", justifyContent: "center", alignItems: "center" },
  pharmacyName: { fontSize: 15, fontWeight: "bold", color: "#1e293b" },
  pharmacyAddress: { fontSize: 12, color: "#64748b", marginTop: 3 },

  horizontalNewsCard: { backgroundColor: "white", width: width * 0.65, borderRadius: 18, marginRight: 15, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0" },
  horizImg: { width: "100%", height: 110 },
  horizNewsTitle: { fontWeight: "bold", fontSize: 13, color: "#1e293b" },
  horizNewsDesc: { color: "#64748b", fontSize: 11, marginTop: 3 },

  raisedMapButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#0284c7", justifyContent: "center", alignItems: "center", bottom: 14, elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  itemCard: { backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  menuReportItem: { backgroundColor: "#e11d48", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 15 },
  menuListItem: { backgroundColor: "white", padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  input: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#cbd5e1", color: "#1e293b" },
  btnSend: { backgroundColor: "#e11d48", padding: 14, borderRadius: 8, alignItems: "center" }
});