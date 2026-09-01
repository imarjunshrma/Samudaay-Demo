// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>ICC Digital ID</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.icon}>☰</Text>
        </View>
      </View>

      <ScrollView>
        {/* Sponsored */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sponsored}>Sponsored</Text>
            <View style={styles.row}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOFlvgbn6TNNOqEgec2A_oXMmeA_ZoHLGwKG5JzqbnXCgh9BDlmtdLJDjw-3ekRb_GB4cvHK-W8rRINMxuOe_uhJaMQhlVP2WP1x7UmtLY3QuI-eWzx71lK_bsUW564aXaTBMPnHZS5R49GCIDbzghV231tNwOQEWCoR8mLkbfa2_utfb_hp7mJdSdGlCEQap8AwPBk8ieIilesnX0QuSL0fvvxkBB2fP7RcMCpH5qSZZR6lknw4eKjSLkXYw3QAjCHqo47xR1sula",
                }}
                style={styles.imageSmall}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>
                  Premium Leather Supplies
                </Text>
                <Text style={styles.desc}>
                  Get 20% off on bulk orders of authentic full-grain leather.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Membership Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Digital Membership Card
          </Text>

          <View style={styles.membershipCard}>
            <Text style={styles.memberName}>Rajesh Kumar</Text>
            <Text>ID: IC-2024-8839</Text>

            <View style={styles.row}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcTdiOPDFjB0DIG6ekJmydxKptp_AKtUY16EjP9JCuLZYwa-fdfH48OI1asmtP4RTU3E45Muq36kU4TuPc1ppDyympPbZY5FhgXEqmPhKsIC_ZdY21lYRrRK06RsbgH1MBaXXXP5tXi0uU2U2n_90x-G_mqpzQ5VxeXLxWlkRDrz-4C6mFxPatuU1QBa-FsEv9PlFfeZcjweOkW6Rhgadcs6krvBlRwAKU-ZN_cShw6PwgAW5oE4kEZYvAklE75L9J3aPyI_OR9inX",
                }}
                style={styles.profileImage}
              />

              <View>
                <Text>Mumbai, Maharashtra</Text>
                <Text>Valid thru: Dec 2030</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.verifyBtn}>
              <Text style={{ color: "#fff" }}>Verify Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>

          <View style={styles.grid}>
            {[
              "My Profile",
              "Family",
              "Events",
              "Donations",
              "News",
              "Matrimony",
            ].map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <Text style={styles.bold}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Updates
          </Text>

          <View style={styles.activity}>
            <Text style={styles.bold}>
              Skill Workshop in Mumbai
            </Text>
            <Text style={styles.desc}>
              2 days ago • Community Center
            </Text>
          </View>

          <View style={styles.activity}>
            <Text style={styles.bold}>
              Health Insurance Drive Started
            </Text>
            <Text style={styles.desc}>
              5 days ago • Welfare Board
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Directory", "Services", "Account"].map(
          (item, i) => (
            <Text key={i} style={styles.navItem}>
              {item}
            </Text>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: { fontSize: 24 },
  icon: { fontSize: 20, marginLeft: 10 },

  title: { fontSize: 18, fontWeight: "bold" },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  sponsored: {
    fontSize: 10,
    color: "#999",
    marginBottom: 5,
  },

  imageSmall: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  bold: { fontWeight: "bold" },

  desc: { fontSize: 12, color: "#666" },

  membershipCard: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 12,
  },

  memberName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  verifyBtn: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  activity: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
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