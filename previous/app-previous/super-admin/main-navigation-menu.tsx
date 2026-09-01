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

export default function DashboardScreen() {
  const menu = [
    "Dashboard",
    "My Profile",
    "Family",
    "Events",
    "Donations",
    "News",
    "Matrimony",
    "Transactions",
    "Chats",
    "Notifications",
    "Birthdays",
  ];

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Profile />

        {menu.map((item, i) => (
          <MenuItem key={i} title={item} active={i === 0} />
        ))}

        <MenuItem title="Logout" danger />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.main}>
        <Header />

        <FeaturedCard />

        <FundCard />

        <NewsSection />

        <QuickCards />
      </ScrollView>
    </View>
  );
}

/* 🔹 Components */

function Profile() {
  return (
    <View style={styles.profile}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Rajesh Kumar</Text>
      <Text style={styles.role}>Master Cordwainer</Text>
      <Text style={styles.meta}>
        Guild Member since 1994
      </Text>
    </View>
  );
}

function MenuItem({ title, active, danger }) {
  return (
    <Text
      style={[
        styles.menuItem,
        active && styles.activeMenu,
        danger && styles.danger,
      ]}
    >
      {title}
    </Text>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.heading}>
        Welcome back,
      </Text>
      <Text style={styles.bigHeading}>
        Master Craftsman
      </Text>
    </View>
  );
}

function FeaturedCard() {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureCard}>
        <Text style={styles.badge}>
          Upcoming Event
        </Text>

        <Text style={styles.titleLarge}>
          Cordwainers Summit 2024
        </Text>

        <Text style={styles.desc}>
          Join 200+ masters in Jodhpur
        </Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>
            Reserve Seat
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: "https://via.placeholder.com/200" }}
        style={styles.featureImage}
      />
    </View>
  );
}

function FundCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.bold}>
        Community Fund
      </Text>
      <Text style={styles.big}>₹42,500</Text>
      <Text style={styles.desc}>
        Goal reached: 84%
      </Text>
    </View>
  );
}

function NewsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Guild News
      </Text>

      <NewsItem title="Export Quality Standards Updated" />
      <NewsItem title="Raw Material Price Stabilization" />
    </View>
  );
}

function NewsItem({ title }) {
  return (
    <View style={styles.news}>
      <Text>{title}</Text>
    </View>
  );
}

function QuickCards() {
  return (
    <View style={styles.row}>
      <MiniCard title="Matrimony" desc="3 matches" />
      <MiniCard title="Birthdays" desc="3 today" />
    </View>
  );
}

function MiniCard({ title, desc }) {
  return (
    <View style={styles.mini}>
      <Text style={styles.bold}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fdf9f6",
  },

  sidebar: {
    width: 240,
    backgroundColor: "#f1edea",
    padding: 15,
  },

  profile: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  name: {
    fontWeight: "bold",
    marginTop: 10,
  },

  role: {
    fontSize: 12,
    color: "#f2780d",
  },

  meta: {
    fontSize: 10,
    color: "#666",
  },

  menuItem: {
    padding: 12,
    color: "#603f33",
  },

  activeMenu: {
    backgroundColor: "#46291e",
    color: "#fff",
  },

  danger: {
    color: "red",
  },

  main: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 16,
  },

  bigHeading: {
    fontSize: 28,
    fontWeight: "bold",
  },

  featureRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  featureCard: {
    flex: 1,
    padding: 15,
  },

  featureImage: {
    width: 120,
    height: "100%",
  },

  badge: {
    fontSize: 10,
    color: "#f2780d",
  },

  titleLarge: {
    fontSize: 18,
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#46291e",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  news: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  mini: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  bold: {
    fontWeight: "bold",
  },

  big: {
    fontSize: 22,
    fontWeight: "bold",
  },

  desc: {
    fontSize: 12,
    color: "#666",
  },
});