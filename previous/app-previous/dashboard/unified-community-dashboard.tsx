// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function AdminDashboard() {
  const actions = [
    { title: "Donation", sub: "Community fund" },
    { title: "Events", sub: "Workshops" },
    { title: "KYC", sub: "4 Pending" },
    { title: "Matrimony", sub: "Profiles" },
    { title: "Expenses", sub: "Tracking" },
    { title: "Publication", sub: "Journal" },
    { title: "Ads", sub: "Promotions" },
    { title: "Notifications", sub: "Broadcast" },
    { title: "Roles", sub: "Access control" },
    { title: "Permissions", sub: "User access" },
    { title: "Chat", sub: "Community" },
    { title: "Analytics", sub: "Insights" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>The Atelier</Text>
        <View style={styles.avatar} />
      </View>

      <ScrollView>
        {/* Profile + Stats */}
        <View style={styles.hero}>
          <Text style={styles.role}>Master Artisan</Text>
          <Text style={styles.name}>Arjun Varma</Text>

          <Text style={styles.desc}>
            Overseeing community excellence
          </Text>

          <View style={styles.stats}>
            <Stat label="Members" value="1,284" />
            <Stat label="Tasks" value="12" />
          </View>
        </View>

        {/* Actions Grid */}
        <Text style={styles.section}>
          Artisan Management
        </Text>

        <View style={styles.grid}>
          {actions.map((a, i) => (
            <ActionCard key={i} {...a} />
          ))}
        </View>

        {/* Featured */}
        <View style={styles.feature}>
          <Text style={styles.featureTitle}>
            Dharavi Master Craftsmen
          </Text>

          <Text style={styles.featureDesc}>
            45 artisans with sustainable leather work
          </Text>

          <TouchableOpacity style={styles.btnOutline}>
            <Text>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Insights */}
        <Insight
          title="Regional Growth"
          desc="North zone +12% apprentices"
        />

        <Insight
          title="Craft Preservation"
          desc="Kolhapuri archive 80% done"
        />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Directory", "Analytics", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Home" && {
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

/* 🔹 Components */

function ActionCard({ title, sub }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.meta}>{sub}</Text>
    </TouchableOpacity>
  );
}

function Stat({ label, value }) {
  return (
    <View>
      <Text style={styles.meta}>{label}</Text>
      <Text style={styles.stat}>{value}</Text>
    </View>
  );
}

function Insight({ title, desc }) {
  return (
    <View style={styles.insight}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.meta}>{desc}</Text>
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

  title: { fontWeight: "bold" },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },

  hero: {
    padding: 15,
  },

  role: {
    fontSize: 12,
    color: "#f2780d",
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
  },

  desc: {
    fontSize: 12,
    color: "#666",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  stat: {
    fontSize: 20,
    fontWeight: "bold",
  },

  section: {
    padding: 15,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  cardTitle: {
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  feature: {
    margin: 15,
    padding: 15,
    backgroundColor: "#e0f2f1",
    borderRadius: 12,
  },

  featureTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  featureDesc: {
    fontSize: 12,
    marginTop: 5,
  },

  btnOutline: {
    marginTop: 10,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  insight: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
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