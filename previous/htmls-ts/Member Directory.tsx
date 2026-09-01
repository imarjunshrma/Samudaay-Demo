import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DirectoryScreen() {
  const [search, setSearch] = useState("");

  const members = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      role: "Master Artisan • 15 Years Exp",
      online: true,
    },
    {
      name: "Sunita Devi",
      location: "Agra",
      role: "Footwear Designer",
    },
    {
      name: "Mohammad Arif",
      location: "Delhi",
      role: "Orthopedic Specialist",
    },
    {
      name: "Amit Saxena",
      location: "Bangalore",
      role: "Premium Repair Service",
      online: true,
    },
    {
      name: "Gopal Varma",
      location: "Hyderabad",
      role: "Raw Material Supplier",
    },
  ];

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Member Directory</Text>
        <Text>ℹ️</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by name..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["State", "City", "Pincode"].map((f, i) => (
          <TouchableOpacity key={i} style={styles.filter}>
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Title */}
      <View style={styles.topRow}>
        <Text style={styles.heading}>Community Members</Text>
        <Text style={styles.count}>1,248</Text>
      </View>

      {/* Members */}
      <ScrollView>
        {filtered.map((m, i) => (
          <MemberCard key={i} {...m} />
        ))}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.primary}>Load More</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Directory", "Events", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Directory" && { color: "#f2780d" },
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

/* 🔹 Member Card */

function MemberCard({ name, location, role, online }) {
  return (
    <View style={styles.card}>
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        {online && <View style={styles.online} />}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>📍 {location}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      <TouchableOpacity style={styles.call}>
        <Text>📞</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  searchBox: {
    padding: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  filter: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  heading: { fontWeight: "bold" },

  count: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  online: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
  },

  name: { fontWeight: "bold" },

  meta: { fontSize: 12, color: "#666" },

  role: {
    fontSize: 11,
    color: "#f2780d",
  },

  call: {
    padding: 10,
    backgroundColor: "#ffe7d3",
    borderRadius: 20,
  },

  loadMore: {
    alignItems: "center",
    padding: 15,
  },

  primary: {
    color: "#f2780d",
    fontWeight: "bold",
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