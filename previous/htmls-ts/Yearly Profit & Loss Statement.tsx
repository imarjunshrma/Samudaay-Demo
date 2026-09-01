import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function PLDashboard() {
  const [year, setYear] = useState("2023-24");

  const years = ["2023-24", "2022-23", "2021-22", "All"];

  const income = [
    { label: "Donations", value: "₹18.4L" },
    { label: "Registrations", value: "₹12.2L" },
    { label: "Matrimony", value: "₹8.5L" },
    { label: "Advertising", value: "₹6.1L" },
  ];

  const expenses = [
    { label: "Venue Rentals", value: "₹9.2L" },
    { label: "Catering", value: "₹7.8L" },
    { label: "Marketing", value: "₹4.2L" },
    { label: "Scholarships", value: "₹8.5L" },
    { label: "Admin Costs", value: "₹3.05L" },
  ];

  const chart = [40, 55, 30, 45, 70, 90, 50, 35, 80, 60, 45, 65];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>P&L Statement</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text>📤</Text>
          <Text>⬇️</Text>
        </View>
      </View>

      <ScrollView>
        {/* Year Filters */}
        <ScrollView horizontal style={styles.filters}>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              onPress={() => setYear(y)}
              style={[
                styles.filter,
                year === y && styles.activeFilter,
              ]}
            >
              <Text
                style={
                  year === y ? styles.white : styles.primary
                }
              >
                FY {y}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* KPI Card */}
        <View style={styles.hero}>
          <Text style={styles.small}>
            Net Profit ({year})
          </Text>
          <Text style={styles.big}>
            ₹12,45,000
          </Text>
          <Text style={styles.badge}>
            +12.4%
          </Text>
        </View>

        {/* Income */}
        <Text style={styles.section}>Income</Text>
        <View style={styles.grid}>
          {income.map((i, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.meta}>{i.label}</Text>
              <Text style={styles.bold}>{i.value}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <Text style={styles.section}>Monthly Trend</Text>
        <View style={styles.chart}>
          {chart.map((h, i) => (
            <View key={i} style={styles.barWrap}>
              <View style={[styles.bar, { height: h }]} />
            </View>
          ))}
        </View>

        {/* Expenses */}
        <Text style={styles.section}>Expenses</Text>
        {expenses.map((e, i) => (
          <View key={i} style={styles.row}>
            <Text>{e.label}</Text>
            <Text style={{ color: "red" }}>
              {e.value}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Export */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text>Excel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={{ color: "#fff" }}>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Finance", "Community", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Finance" && {
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

  filters: { paddingHorizontal: 10 },

  filter: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 10,
  },

  activeFilter: {
    backgroundColor: "#f2780d",
  },

  primary: { color: "#f2780d" },
  white: { color: "#fff" },

  hero: {
    margin: 15,
    padding: 20,
    backgroundColor: "#f2780d",
    borderRadius: 12,
  },

  small: { color: "#fff" },

  big: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  badge: {
    marginTop: 5,
    color: "#fff",
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
    borderRadius: 10,
  },

  chart: {
    flexDirection: "row",
    height: 120,
    padding: 10,
    alignItems: "flex-end",
  },

  barWrap: { flex: 1, alignItems: "center" },

  bar: {
    width: 6,
    backgroundColor: "#f2780d",
    borderRadius: 3,
  },

  row: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    backgroundColor: "#fff",
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#f2780d",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
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

  meta: {
    fontSize: 12,
    color: "#666",
  },

  bold: {
    fontWeight: "bold",
  },
});