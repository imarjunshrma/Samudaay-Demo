// @ts-nocheck
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const today = [
    {
      name: "Rajesh Kumar",
      age: 45,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAZfdAmOTNalNfxkdL4xLeeyTbDHVT1HbevK9a0oYXpQxKiTXgjYJCVR3yQmXJL3gJe-JsE-T3jC9Mi4bnerjF9GxyXQzcSEkIBVsDsn9bTxoGsE3YAPYOporC8AE9HXRebQqNFk5rsz42i1HWbsGIUlkSQaDUix8Csy3h8OpJpUENGPpLIle84ju_-mxboSw_z0YmvhHGTDq8pbOPZkuBWxv8d0MtDyJpDEzsbzsN5G-BzS-WBtR5vGn7uJ0pxBF2ae8KuPXoxvKXz",
    },
    {
      name: "Amit Prajapati",
      age: 32,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA4XBH6w6wUn8B3Yiz4Z9SR7RyjPLtPXiwtz0KjZkCWMR8G9FUv4nSqd7tgBe9pvCNjbtVHvB4gHPgKL3atDUgPVV21_yOL6gHwCAptJ0JH-hll2y4KKc0OH-RgCmplvHCmI8qJaABofHfR3BsMpDXRoOysQIBxlb-rGxv8hZpTRRcXqyJIQydK9H0LDkzXhRSWmJhlgrCYXfpgmUvn1m6gNgErPr6ko-c9vEALJkC9RPt6dHFzF6PAd_MaXD6A55mGNmZdBq1bVSGs",
    },
  ];

  const upcoming = [
    { name: "Sunil Varma", date: "Tomorrow" },
    { name: "Deepak Chauhan", date: "Friday" },
    { name: "Meena Solanki", date: "Saturday" },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.title}>Birthday Reminders</Text>
        <Text>🔔</Text>
      </View>

      <ScrollView>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Today's Birthdays 🎉</Text>
          <Text style={styles.heroSub}>
            Don’t forget to wish them!
          </Text>
        </View>

        {/* TODAY LIST */}
        {today.map((item, i) => (
          <View key={i} style={styles.card}>
            
            <Image source={{ uri: item.image }} style={styles.avatar} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.age}>
                Turning {item.age} today
              </Text>
            </View>

            <TouchableOpacity style={styles.wishBtn}>
              <Text style={styles.wishText}>Wish</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* UPCOMING */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming This Week</Text>

          {upcoming.map((item, i) => (
            <View key={i} style={styles.upcomingRow}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>

              <TouchableOpacity style={styles.alertBtn}>
                <Text style={styles.alertText}>Set Alert</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Members", "Birthdays", "Profile"].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Birthdays" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  back: { fontSize: 20 },

  title: { fontWeight: "bold" },

  hero: {
    padding: 16,
    backgroundColor: "#fff3e6",
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  heroSub: {
    color: "#666",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  name: { fontWeight: "bold" },

  age: { color: PRIMARY, fontSize: 12 },

  wishBtn: {
    backgroundColor: PRIMARY,
    padding: 8,
    borderRadius: 6,
  },

  wishText: { color: "#fff" },

  section: { padding: 16 },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  upcomingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  date: { fontSize: 12, color: "#777" },

  alertBtn: {
    backgroundColor: "#fff3e6",
    padding: 6,
    borderRadius: 6,
  },

  alertText: {
    color: PRIMARY,
    fontSize: 12,
  },

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