import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>
            Annual Artisans Meet 2024
          </Text>
          <Text style={styles.subtitle}>
            Financial Summary • Jan 15-17
          </Text>
        </View>

        <Text>🔗</Text>
      </View>

      <ScrollView>
        {/* Summary Cards */}
        <View style={styles.grid}>
          <Metric title="Total Income" value="₹8,45,000" trend="+12.5%" color="green" />
          <Metric title="Total Expenses" value="₹5,12,400" trend="8% over" color="orange" />
          <Metric title="Net Profit" value="₹3,32,600" trend="39.3% margin" color="#f2780d" highlight />
        </View>

        {/* Income */}
        <Section title="Income Breakdown" type="credit">
          <Item title="Ticket Sales" subtitle="450 General • 120 VIP" amount="₹5,80,000" status="Completed" />
          <Item title="Sponsorships" subtitle="Bata, Metro" amount="₹2,25,000" status="Pending ₹50k" />
          <Item title="Add-ons" subtitle="Workshops & Tools" amount="₹40,000" status="Completed" />
        </Section>

        {/* Expenses */}
        <Section title="Expense Breakdown" type="debit">
          <Item title="Venue" subtitle="Community Center" amount="-₹1,20,000" />
          <Item title="Catering" subtitle="3 Days" amount="-₹1,85,000" />
          <Item title="Materials" subtitle="Leather & Tools" amount="-₹95,000" />
          <Item title="Staff" subtitle="12 Staff" amount="-₹1,12,400" status="Reconciling" />
        </Section>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Events", "Finances", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Finances" && { color: "#f2780d" },
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

function Metric({ title, value, trend, color, highlight }) {
  return (
    <View
      style={[
        styles.metric,
        highlight && { backgroundColor: "#fff3e6" },
      ]}
    >
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.big}>{value}</Text>
      <Text style={{ color }}>{trend}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Item({ title, subtitle, amount, status }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.bold}>{title}</Text>
        <Text style={styles.desc}>{subtitle}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.bold}>{amount}</Text>
        {status && (
          <Text style={styles.status}>{status}</Text>
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
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#666" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },

  metric: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  label: { fontSize: 12, color: "#666" },

  big: {
    fontSize: 20,
    fontWeight: "bold",
  },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  desc: { fontSize: 12, color: "#666" },

  status: {
    fontSize: 10,
    color: "#f2780d",
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