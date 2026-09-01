// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function TrusteesScreen() {
  const [trustees, setTrustees] = useState([
    {
      name: "Rajesh Kumar",
      role: "President",
      info: "25 years exp • Mumbai",
    },
    {
      name: "Amit Shah",
      role: "Secretary",
      info: "18 years exp • Agra",
    },
    {
      name: "Priya More",
      role: "Treasurer",
      info: "15 years exp • Kolhapur",
    },
    {
      name: "Vikram Singh",
      role: "Senior Advisor",
      info: "40 years exp • Jodhpur",
    },
  ]);

  const handleDelete = (index) => {
    const updated = trustees.filter((_, i) => i !== index);
    setTrustees(updated);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Manage Trustees</Text>
        <Text>🔍</Text>
      </View>

      <ScrollView>
        {/* Hero */}
        <View style={styles.hero}>
          <View>
            <Text style={styles.heading}>
              Board of Trustees
            </Text>
            <Text style={styles.sub}>
              Managing {trustees.length} Trustees
            </Text>
          </View>

          <Text style={styles.badge}>Admin</Text>
        </View>

        {/* List */}
        {trustees.map((item, i) => (
          <TrusteeCard
            key={i}
            {...item}
            onDelete={() => handleDelete(i)}
          />
        ))}

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statTitle}>
            Our Reach
          </Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.small}>Members</Text>
              <Text style={styles.big}>12,500+</Text>
            </View>

            <View>
              <Text style={styles.small}>Districts</Text>
              <Text style={styles.big}>48</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff", fontSize: 24 }}>
          +
        </Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Community", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Community" && {
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

/* 🔹 Trustee Card */

function TrusteeCard({ name, role, info, onDelete }) {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: "https://via.placeholder.com/100",
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.info}>{info}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.edit}>
          <Text>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delete}
          onPress={onDelete}
        >
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  sub: {
    fontSize: 12,
    color: "#666",
  },

  badge: {
    backgroundColor: "#ffe7d3",
    color: "#f2780d",
    padding: 5,
    borderRadius: 20,
    fontSize: 10,
  },

  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
  },

  role: {
    color: "#f2780d",
    fontSize: 12,
  },

  info: {
    fontSize: 11,
    color: "#666",
  },

  actions: {
    flexDirection: "row",
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

  stats: {
    margin: 15,
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
  },

  statTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  small: {
    color: "#fff",
    fontSize: 10,
  },

  big: {
    color: "#fff",
    fontSize: 20,
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