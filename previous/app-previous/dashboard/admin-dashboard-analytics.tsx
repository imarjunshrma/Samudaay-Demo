// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#46291e";

export default function App() {
  const transactions = [
    { title: "Custom Oxford Boot", sub: "Order #7721", amount: "+$850" },
    { title: "Waxed Laces", sub: "Order #7720", amount: "+$120" },
    { title: "Sole Stitching", sub: "Order #7719", amount: "+$245" },
  ];

  const cards = [
    { title: "People Analytics", sub: "+48 New" },
    { title: "Event Analytics", sub: "92% Success" },
    { title: "Transactions", sub: "$42,800/mo" },
    { title: "Matrimony", sub: "Trending" },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.logo}>The Digital Atelier</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.tag}>WORKSHOP PERFORMANCE</Text>
          <Text style={styles.title}>Ledger & Insights</Text>
          <Text style={styles.desc}>
            Track growth, performance and financial insights.
          </Text>

          <View style={styles.growthCard}>
            <Text style={styles.growthValue}>12.4%</Text>
            <Text style={styles.growthText}>Net Growth vs Q3</Text>
          </View>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {cards.map((item, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        {/* TRANSACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions</Text>

          {transactions.map((item, i) => (
            <View key={i} style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* P&L */}
        <View style={styles.pnl}>
          <Text style={styles.pnlTitle}>Yearly P&L</Text>

          <View style={styles.pnlRow}>
            <View>
              <Text style={styles.pnlLabel}>Revenue</Text>
              <Text style={styles.pnlValue}>$1.2M</Text>
            </View>
            <View>
              <Text style={styles.pnlLabel}>Costs</Text>
              <Text style={styles.pnlValue}>$420k</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Studio", "People", "Events", "Ledger", "Union"].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Text style={styles.navText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf9f6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  menu: {
    fontSize: 20,
  },

  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY,
  },

  hero: {
    padding: 16,
  },

  tag: {
    fontSize: 10,
    color: "#964900",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY,
  },

  desc: {
    color: "#666",
    marginVertical: 8,
  },

  growthCard: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  growthValue: {
    fontSize: 20,
    fontWeight: "bold",
  },

  growthText: {
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  card: {
    width: "50%",
    padding: 12,
  },

  cardTitle: {
    fontWeight: "bold",
  },

  cardSub: {
    fontSize: 12,
    color: "#777",
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  rowTitle: {
    fontWeight: "bold",
  },

  rowSub: {
    fontSize: 12,
    color: "#777",
  },

  amount: {
    fontWeight: "bold",
    color: "#964900",
  },

  pnl: {
    margin: 16,
    padding: 16,
    backgroundColor: PRIMARY,
    borderRadius: 12,
  },

  pnlTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  pnlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  pnlLabel: {
    color: "#ccc",
    fontSize: 12,
  },

  pnlValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  exportBtn: {
    marginTop: 16,
    backgroundColor: "#964900",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  exportText: {
    color: "#fff",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#666",
  },
});