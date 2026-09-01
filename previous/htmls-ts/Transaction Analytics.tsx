import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function TransactionAnalytics() {
  const pincodes = [
    { name: "400001 (Mumbai South)", value: "₹1.2L", width: "85%" },
    { name: "110001 (Delhi CP)", value: "₹85K", width: "65%" },
    { name: "560001 (Bangalore)", value: "₹72K", width: "55%" },
  ];

  const transactions = [
    {
      name: "Rajesh Kumar",
      type: "Matrimony Subscription",
      amount: "₹1,100",
      status: "SUCCESS",
    },
    {
      name: "Anonymous Donor",
      type: "Education Fund",
      amount: "₹5,000",
      status: "SUCCESS",
    },
    {
      name: "Sunita Verma",
      type: "Matrimony Subscription",
      amount: "₹1,100",
      status: "PENDING",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transaction Analytics</Text>
        <Text style={styles.sub}>Admin Panel</Text>
      </View>

      <ScrollView>
        {/* KPIs */}
        <View style={styles.grid}>
          <StatCard title="Total Donations" value="₹8,45,200" growth="+14%" />
          <StatCard title="Matrimony Revenue" value="₹2,12,500" growth="+8%" />
        </View>

        {/* Chart */}
        <View style={styles.card}>
          <Text style={styles.bold}>Revenue Trends</Text>

          <View style={styles.chart}>
            {[20, 40, 60, 80, 100, 120].map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    { height: h },
                  ]}
                />
                <Text style={styles.month}>
                  {["Jan","Feb","Mar","Apr","May","Jun"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pincode Analytics */}
        <View style={styles.card}>
          <Text style={styles.bold}>
            Top Donation Pincodes
          </Text>

          {pincodes.map((p, i) => (
            <View key={i} style={{ marginTop: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.small}>{p.name}</Text>
                <Text style={styles.primary}>{p.value}</Text>
              </View>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progress,
                    { width: p.width },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.bold}>Recent Transactions</Text>

          {transactions.map((t, i) => (
            <TransactionItem key={i} {...t} />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Txns", "Members", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Txns" && { color: "#f2780d" },
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

function StatCard({ title, value, growth }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.small}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.green}>{growth}</Text>
    </View>
  );
}

function TransactionItem({ name, type, amount, status }) {
  return (
    <View style={styles.txn}>
      <View>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.small}>{type}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.bold}>{amount}</Text>
        <Text
          style={[
            styles.status,
            status === "SUCCESS"
              ? { color: "green" }
              : { color: "orange" },
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
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  sub: { fontSize: 12, color: "#666" },

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
    fontSize: 18,
    fontWeight: "bold",
  },

  green: { color: "green", fontSize: 12 },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    marginTop: 10,
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

  month: {
    fontSize: 10,
    marginTop: 5,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 5,
  },

  progress: {
    height: "100%",
    backgroundColor: "#f2780d",
    borderRadius: 10,
  },

  section: {
    padding: 15,
  },

  txn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  small: { fontSize: 12, color: "#666" },

  primary: { color: "#f2780d" },

  status: { fontSize: 10 },

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