import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>🛡 ICC Digital ID</Text>
        <View style={styles.headerIcons}>
          <Text>🔔</Text>
          <Text>☰</Text>
        </View>
      </View>

      <ScrollView>

        {/* DIGITAL CARD */}
        <View style={styles.card}>
          
          <Text style={styles.cardTitle}>
            Indian Cobbler Community
          </Text>

          <View style={styles.cardRow}>
            <Image
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>Rajesh Kumar</Text>
              <Text style={styles.id}>ID: IC-2024-8839</Text>
              <Text style={styles.meta}>Mumbai</Text>
              <Text style={styles.meta}>
                Valid: Dec 2030
              </Text>
            </View>
          </View>

          {/* QR */}
          <View style={styles.qrRow}>
            <View style={styles.qr}>
              <Text>QR</Text>
            </View>

            <TouchableOpacity style={styles.verifyBtn}>
              <Text style={{ color: "#fff" }}>
                Verify Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DASHBOARD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Community Dashboard
          </Text>

          <View style={styles.grid}>
            {[
              "Profile",
              "Family",
              "Events",
              "Donations",
              "News",
              "Matrimony",
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.cardItem}>
                <Text style={styles.icon}>📦</Text>
                <Text style={styles.cardText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Updates
          </Text>

          {[1, 2].map((_, i) => (
            <View key={i} style={styles.activity}>
              
              <Image
                source={{ uri: "https://picsum.photos/100?random=" + i }}
                style={styles.activityImg}
              />

              <View>
                <Text style={styles.activityTitle}>
                  Workshop Update
                </Text>
                <Text style={styles.activityMeta}>
                  2 days ago
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Directory", "Services", "Account"].map((item) => (
          <Text
            key={item}
            style={[
              styles.navItem,
              item === "Home" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: { fontWeight: "bold" },

  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    margin: 16,
    padding: 16,
    backgroundColor: PRIMARY,
    borderRadius: 12,
  },

  cardTitle: {
    color: "#fff",
    marginBottom: 10,
  },

  cardRow: {
    flexDirection: "row",
    gap: 10,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  id: { color: "#fff" },

  meta: { color: "#eee", fontSize: 12 },

  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  qr: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
  },

  verifyBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
  },

  section: { padding: 16 },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cardItem: {
    width: "48%",
    margin: "1%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },

  cardText: { fontSize: 12 },

  icon: { fontSize: 18 },

  activity: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  activityImg: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },

  activityTitle: { fontWeight: "bold" },

  activityMeta: { fontSize: 11, color: "#777" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});
