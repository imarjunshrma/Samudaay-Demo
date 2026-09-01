import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function PremiumDiscover() {
  const profiles = [
    {
      name: "Ananya Sharma",
      role: "Footwear Designer",
      location: "London",
      age: "27 yrs, 5'6\"",
      education: "MA Fashion Design",
    },
    {
      name: "Vikram Mehta",
      role: "Master Cordwainer",
      location: "Milan",
      age: "31 yrs, 5'11\"",
      education: "B.Tech Leather",
    },
    {
      name: "Sana Khan",
      role: "Orthopedic Shoemaker",
      location: "Dubai",
      age: "29 yrs, 5'5\"",
      education: "Doctor of Podiatry",
    },
    {
      name: "Rahul Deshmukh",
      role: "Tannery Heir",
      location: "Kanpur",
      age: "33 yrs, 6'0\"",
      education: "MBA INSEAD",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cobbler Matrimony</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
      </View>

      <ScrollView>
        {/* Intro Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Hand-picked Matches
          </Text>

          <Text style={styles.heroDesc}>
            Find a partner who shares your story and heritage.
          </Text>
        </View>

        {/* Tags */}
        <ScrollView horizontal style={styles.tags}>
          {["New", "Compatible", "Nearby"].map((t, i) => (
            <View key={i} style={styles.tag}>
              <Text>{t}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Profiles */}
        {profiles.map((p, i) => (
          <ProfileCard key={i} {...p} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Discover", "Requests", "Messages", "Account"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                i === 0 && { color: "#f2780d" },
              ]}
            >
              {item}
            </Text>
          )
        )}
      </View>
    </View>
  );
}

/* 🔹 Profile Card */

function ProfileCard({
  name,
  role,
  location,
  age,
  education,
}) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: "https://via.placeholder.com/300" }}
        style={styles.img}
      />

      <View style={styles.overlay}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>
          {role} • {location}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.meta}>{age}</Text>
        <Text style={styles.meta}>{education}</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            Send Request
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  hero: {
    padding: 15,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },

  heroDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  tags: {
    paddingHorizontal: 10,
  },

  tag: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  img: {
    width: "100%",
    height: 220,
  },

  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  role: {
    color: "#ddd",
    fontSize: 12,
  },

  content: {
    padding: 15,
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#46291e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },

  navItem: {
    fontSize: 12,
    color: "#888",
  },
});