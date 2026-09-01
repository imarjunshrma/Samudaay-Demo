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
  const invoices = [
    {
      client: "Heritage Leathers Co.",
      id: "INV-0842",
      amount: "$1,250",
      status: "Paid",
    },
    {
      client: "Savile Row Bespoke",
      id: "INV-0839",
      amount: "$2,400",
      status: "Overdue",
    },
    {
      client: "The Lasting Studio",
      id: "INV-0831",
      amount: "$850",
      status: "Paid",
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>The Digital Atelier</Text>
        <Text style={styles.role}>Superadmin</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.tag}>FINANCIAL LEDGER</Text>
          <Text style={styles.title}>Billing & Revenue</Text>
          <Text style={styles.desc}>
            Track subscriptions and financial insights.
          </Text>
        </View>

        {/* KPI */}
        <View style={styles.kpiRow}>
          <View style={styles.bigCard}>
            <Text style={styles.kpiTitle}>MRR</Text>
            <Text style={styles.kpiValue}>$42,850</Text>
            <Text style={styles.kpiSub}>+12.4%</Text>
          </View>

          <View style={styles.smallCard}>
            <Text>Renewals</Text>
            <Text style={styles.kpiValue}>14</Text>
          </View>

          <View style={styles.smallCard}>
            <Text>Outstanding</Text>
            <Text style={styles.kpiValue}>$3,210</Text>
          </View>
        </View>

        {/* INVOICES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Invoices</Text>

          {invoices.map((item, i) => (
            <View key={i} style={styles.invoice}>
              
              <View>
                <Text style={styles.client}>{item.client}</Text>
                <Text style={styles.id}>{item.id}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === "Overdue" && styles.overdue,
                  ]}
                >
                  {item.status}
                </Text>
              </View>

            </View>
          ))}
        </View>

        {/* CLIENT TIERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Tiers</Text>

          {[
            { name: "Master", value: 80 },
            { name: "Journeyman", value: 45 },
            { name: "Apprentice", value: 60 },
          ].map((item, i) => (
            <View key={i} style={styles.progressBlock}>
              <Text>{item.name}</Text>
              <View style={styles.progress}>
                <View style={[styles.progressFill, { width: `${item.value}%` }]} />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Clients", "Configs", "Billing", "Audit"].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Billing" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: { fontWeight: "bold", color: PRIMARY },

  role: { fontSize: 12, color: "#666" },

  hero: { padding: 16 },

  tag: { fontSize: 10, color: "#964900" },

  title: { fontSize: 26, fontWeight: "bold", color: PRIMARY },

  desc: { color: "#666", marginTop: 6 },

  kpiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },

  bigCard: {
    width: "100%",
    padding: 16,
    backgroundColor: PRIMARY,
    borderRadius: 12,
  },

  smallCard: {
    width: "48%",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  kpiTitle: { color: "#fff", fontSize: 12 },

  kpiValue: { fontSize: 20, fontWeight: "bold", color: "#fff" },

  kpiSub: { color: "#ccc", fontSize: 12 },

  section: { padding: 16 },

  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  invoice: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },

  client: { fontWeight: "bold" },

  id: { fontSize: 12, color: "#777" },

  amount: { fontWeight: "bold", color: PRIMARY },

  status: { fontSize: 10, color: "green" },

  overdue: { color: "red" },

  progressBlock: { marginBottom: 10 },

  progress: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 4,
  },

  progressFill: {
    height: 6,
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: { color: PRIMARY, fontWeight: "bold" },
});