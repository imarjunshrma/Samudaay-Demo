import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function TransactionsScreen() {
  const [tab, setTab] = useState("All");

  const tabs = ["All", "Donations", "Events", "Subscriptions"];

  const data = [
    {
      title: "Annual Charity Fund",
      type: "Donations",
      date: "Oct 22, 2023",
      amount: "-$500",
    },
    {
      title: "Gala Night 2023",
      type: "Events",
      date: "Oct 15, 2023",
      amount: "-$150",
    },
    {
      title: "Premium Membership",
      type: "Subscriptions",
      date: "Oct 01, 2023",
      amount: "-$299",
    },
    {
      title: "Community Kitchen",
      type: "Donations",
      date: "Sep 28, 2023",
      amount: "-$301",
    },
  ];

  const filtered =
    tab === "All"
      ? data
      : data.filter((t) => t.type === tab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          My Transactions
        </Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.label}>
          Total Contribution
        </Text>
        <Text style={styles.amount}>
          $1,250
        </Text>
        <Text style={styles.meta}>
          Last updated: Oct 24, 2023
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.tab,
                tab === t && styles.activeTab,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions */}
      <ScrollView>
        <Text style={styles.section}>
          Recent Transactions
        </Text>

        {filtered.map((item, i) => (
          <TransactionCard key={i} {...item} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Transactions", "Profile", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Transactions" && {
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

/* 🔹 Transaction Card */

function TransactionCard({
  title,
  type,
  date,
  amount,
}) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.meta}>
          {date} • {type}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.amountText}>
          {amount}
        </Text>

        <TouchableOpacity>
          <Text style={styles.primary}>
            📄 Receipt
          </Text>
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
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    marginLeft: 10,
    fontWeight: "bold",
  },

  summary: {
    backgroundColor: "#fff3e6",
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f2780d",
  },

  meta: {
    fontSize: 10,
    color: "#888",
  },

  tabs: {
    paddingHorizontal: 10,
  },

  tab: {
    padding: 10,
    marginRight: 10,
    color: "#666",
  },

  activeTab: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  section: {
    padding: 15,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: { fontWeight: "bold" },

  amountText: {
    fontWeight: "bold",
  },

  primary: {
    color: "#f2780d",
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