// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#5D4037";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.logo}>The Atelier</Text>

        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoeFJG0ITg2ZVIKyJcnhVqwC4mjjEnC-zEJKHtEcXedHiROTP3cUw_RBCitQQ4wazO6FHevLUd0y7NqEgR5ZSQPuxmeZS8aHIBnPaX8hyo0-AMyZHmItCa3wv79HJnnj4aY3V_KmyQil1SdqJC5yjwAnWK0I_gIMqdCRkNfi1W8V3nFSQuzon3xRob4Wiwy9-Lz3V6ktNM8z3X7x99Kf_ivTA0_sfoZkbsJSWuwcl_14tMAmuREQVmWy51sUAWdHvykC6bciQHnBLb",
          }}
          style={styles.avatar}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* PROFILE */}
        <View style={styles.profile}>
          <Text style={styles.tag}>MASTER ARTISAN</Text>
          <Text style={styles.name}>Arjun Varma</Text>
          <Text style={styles.desc}>
            Overseeing the legacy of hand-stitched excellence across the Indian community.
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Active Members</Text>
            <Text style={styles.cardValue}>1,284</Text>
          </View>

          <View style={[styles.card, styles.cardHighlight]}>
            <Text style={styles.cardLabel}>Pending Tasks</Text>
            <Text style={styles.cardValue}>12</Text>
          </View>
        </View>

        {/* GRID MENU */}
        <View style={styles.grid}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridItem}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FEATURED */}
        <View style={styles.featured}>
          <Text style={styles.featuredTitle}>Dharavi Master Craftsmen</Text>
          <Text style={styles.featuredDesc}>
            Recognized for exceptional leather work.
          </Text>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Directory", "Stats", "Settings"].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Text style={styles.navText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}


const menuItems = [
  { title: "Donation", sub: "Welfare", icon: "❤️" },
  { title: "Events", sub: "Workshops", icon: "📅" },
  { title: "KYC", sub: "4 Pending", icon: "✔️" },
  { title: "Matrimony", sub: "Match", icon: "💍" },
  { title: "Expenses", sub: "Overheads", icon: "📄" },
  { title: "Journal", sub: "Publications", icon: "📰" },
  { title: "Ads", sub: "Promotions", icon: "📢" },
  { title: "Alerts", sub: "Broadcasts", icon: "🔔" },
  { title: "Roles", sub: "Assignments", icon: "👤" },
  { title: "Access", sub: "Permissions", icon: "🔓" },
  { title: "Chat", sub: "Discussion", icon: "💬" },
  { title: "Analytics", sub: "Performance", icon: "📈" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F1",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  menu: { fontSize: 20 },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5D4037",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  profile: {
    padding: 16,
  },

  tag: {
    fontSize: 10,
    color: "#8D6E63",
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5D4037",
  },

  desc: {
    color: "#666",
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },

  card: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eee",
    borderRadius: 12,
  },

  cardHighlight: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#5D4037",
  },

  cardLabel: {
    fontSize: 12,
    color: "#8D6E63",
  },

  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  gridItem: {
    width: "33%",
    padding: 10,
  },

  icon: {
    fontSize: 20,
    marginBottom: 6,
  },

  gridTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },

  gridSub: {
    fontSize: 10,
    color: "#888",
  },

  featured: {
    margin: 16,
    padding: 20,
    backgroundColor: "#2E4D44",
    borderRadius: 20,
  },

  featuredTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  featuredDesc: {
    color: "#ddd",
    marginTop: 6,
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
  },
});