import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function AdminDashboard() {
  const cities = [
    { name: "Mumbai", value: 90 },
    { name: "Delhi", value: 75 },
    { name: "Agra", value: 60 },
    { name: "Kanpur", value: 45 },
    { name: "Chennai", value: 30 },
  ];

  const regions = [
    {
      name: "Mumbai Metro",
      state: "Maharashtra",
      count: "3,420",
      growth: "+2.4%",
    },
    {
      name: "Delhi NCR",
      state: "North Region",
      count: "2,890",
      growth: "+1.8%",
    },
    {
      name: "Agra District",
      state: "Uttar Pradesh",
      count: "1,540",
      growth: "-0.5%",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ICC Analytics</Text>
        <Text style={styles.subtitle}>
          Indian Cobbler Community
        </Text>
      </View>

      <ScrollView>
        {/* Hero KPI */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>
            Total Community Strength
          </Text>
          <Text style={styles.heroValue}>
            12,500+
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              ↑ 12% growth
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.grid}>
          <StatCard
            title="New Registrations"
            value="842"
            growth="+5%"
          />
          <StatCard
            title="Active Matrimony"
            value="2,104"
            growth="+8%"
          />
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Members by City
          </Text>

          <View style={styles.chart}>
            {cities.map((c, i) => (
              <View key={i} style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    { height: `${c.value}%` },
                  ]}
                />
                <Text style={styles.city}>
                  {c.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Region List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Regional Distribution
          </Text>

          {regions.map((r, i) => (
            <View key={i} style={styles.card}>
              <View>
                <Text style={styles.name}>
                  {r.name}
                </Text>
                <Text style={styles.meta}>
                  {r.state}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.count}>
                  {r.count}
                </Text>
                <Text
                  style={[
                    styles.growth,
                    r.growth.includes("-")
                      ? { color: "red" }
                      : { color: "green" },
                  ]}
                >
                  {r.growth}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {[
          "Dashboard",
          "Events",
          "Transactions",
          "Matrimony",
        ].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Dashboard" && {
                color: "#f2780d",
              },
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* 🔹 Components */

function StatCard({ title, value, growth }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.meta}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.growth}>{growth}</Text>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
  },

  hero: {
    backgroundColor: "#f2780d",
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },

  heroLabel: {
    color: "#fff",
    fontSize: 12,
  },

  heroValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  badge: {
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },

  stat: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  value: {
    fontWeight: "bold",
    fontSize: 18,
  },

  section: {
    padding: 15,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
  },

  barWrap: {
    alignItems: "center",
    flex: 1,
  },

  bar: {
    width: 10,
    backgroundColor: "#f2780d",
    borderRadius: 5,
  },

  city: {
    fontSize: 10,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  count: {
    fontWeight: "bold",
  },

  growth: {
    fontSize: 12,
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