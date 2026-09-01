import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function TrusteesScreen() {
  const trustees = [
    {
      name: "Rajesh Kumar",
      role: "President",
      exp: "25 years exp",
      location: "Dharavi, Mumbai",
    },
    {
      name: "Amit Shah",
      role: "Secretary",
      exp: "18 years exp",
      location: "Agra, UP",
    },
    {
      name: "Priya More",
      role: "Treasurer",
      exp: "15 years exp",
      location: "Kolhapur, MH",
    },
    {
      name: "Vikram Singh",
      role: "Senior Advisor",
      exp: "40 years exp",
      location: "Jodhpur, RJ",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Community Trustees
        </Text>
        <Text>🔍</Text>
      </View>

      <ScrollView>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Board of Trustees
          </Text>

          <Text style={styles.heroDesc}>
            Dedicated leaders serving the community
          </Text>
        </View>

        {/* Trustees List */}
        {trustees.map((t, i) => (
          <TrusteeCard key={i} {...t} />
        ))}

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsTitle}>
            Our Reach
          </Text>

          <View style={styles.grid}>
            <Stat label="Members" value="12,500+" />
            <Stat label="Districts" value="48" />
          </View>
        </View>
      </ScrollView>

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

function TrusteeCard({ name, role, exp, location }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.meta}>
          {exp} • {location}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={{ color: "#fff" }}>
          Contact
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🔹 Stat */

function Stat({ label, value }) {
  return (
    <View>
      <Text style={styles.meta}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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

  hero: {
    padding: 15,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  heroDesc: {
    fontSize: 12,
    color: "#666",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: { fontWeight: "bold" },

  role: {
    color: "#f2780d",
    fontSize: 12,
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  btn: {
    backgroundColor: "#f2780d",
    padding: 8,
    borderRadius: 8,
  },

  stats: {
    backgroundColor: "#f2780d",
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },

  statsTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  statValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
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