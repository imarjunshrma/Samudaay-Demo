// @ts-nocheck
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
      role: "Master Artisan",
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
      role: "Premium Repair",
      online: true,
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
        <Text style={styles.title}>
          Manage Directory
        </Text>
        <Text>⚙️</Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search members..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["State", "City", "Role"].map((f, i) => (
          <TouchableOpacity key={i} style={styles.filter}>
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Members */}
      <ScrollView>
        {filtered.map((m, i) => (
          <MemberCard key={i} {...m} />
        ))}

        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.primary}>
            Load More Members
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff", fontSize: 22 }}>
          +
        </Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Directory", "Events", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Directory" && {
                  color: "#f2780d",
                },
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
          source={{
            uri: "https://via.placeholder.com/100",
          }}
          style={styles.avatar}
        />

        {online && <View style={styles.online} />}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>📍 {location}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.edit}>
          <Text>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delete}>
          <Text>🗑️</Text>
        </TouchableOpacity>
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
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  search: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },

  filter: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
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

  actions: {
    gap: 10,
  },

  edit: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  delete: {
    padding: 8,
    backgroundColor: "#ffe5e5",
    borderRadius: 8,
  },

  loadMore: {
    alignItems: "center",
    padding: 15,
  },

  primary: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 50,
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