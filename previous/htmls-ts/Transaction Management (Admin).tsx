import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function AllTransactionsScreen() {
  const [filter, setFilter] = useState("All");

  const transactions = [
    {
      name: "Sarah Williams",
      city: "New York",
      type: "Donation",
      amount: "$250",
      status: "Completed",
    },
    {
      name: "Michael Chen",
      city: "San Francisco",
      type: "Event",
      amount: "$45",
      status: "Completed",
    },
    {
      name: "Jessica Smith",
      city: "Chicago",
      type: "Donation",
      amount: "$1200",
      status: "Pending",
    },
    {
      name: "David Miller",
      city: "Austin",
      type: "Membership",
      amount: "$150",
      status: "Completed",
    },
    {
      name: "Robert Brown",
      city: "Seattle",
      type: "Donation",
      amount: "$50",
      status: "Failed",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>All Transactions</Text>
        <View style={styles.row}>
          <Text>🔍</Text>
          <Text>⬇️</Text>
        </View>
      </View>

      <ScrollView>
        {/* Admin Profile */}
        <View style={styles.profile}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.name}>
              Alex Johnson
            </Text>
            <Text style={styles.meta}>
              National Admin
            </Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal style={styles.filters}>
          {["All Cities", "All Types", "Last 30 Days"].map(
            (f, i) => (
              <TouchableOpacity
                key={i}
                style={styles.filter}
              >
                <Text>{f}</Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Transactions */}
        {transactions.map((t, i) => (
          <TransactionRow key={i} {...t} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Transactions", "Members", "Settings"].map(
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

/* 🔹 Transaction Row */

function TransactionRow({
  name,
  city,
  type,
  amount,
  status,
}) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.meta}>
          {city} • {type}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.bold}>{amount}</Text>

        <Text
          style={[
            styles.status,
            status === "Completed" && { color: "green" },
            status === "Pending" && { color: "orange" },
            status === "Failed" && { color: "red" },
          ]}
        >
          {status}
        </Text>
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

  row: {
    flexDirection: "row",
    gap: 10,
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  name: { fontWeight: "bold" },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  filters: {
    paddingHorizontal: 10,
  },

  filter: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  status: {
    fontSize: 10,
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