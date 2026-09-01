import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DashboardShell() {
  return (
    <View style={styles.container}>
      {/* Sidebar (Static for now) */}
      <View style={styles.sidebar}>
        <View style={styles.profile}>
          <Image
            source={{
              uri: "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            Rajesh Mochi
          </Text>
          <Text style={styles.role}>
            Master Cordwainer
          </Text>
        </View>

        {[
          "Dashboard",
          "My Profile",
          "Members",
          "Family",
          "Events",
          "Donations",
          "News",
          "Chats",
        ].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.menuItem,
              i === 0 && styles.activeMenu,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome back,
          </Text>
          <Text style={styles.heading}>
            Master Craftsman
          </Text>
        </View>

        {/* Featured Event */}
        <View style={styles.cardRow}>
          <View style={styles.featureCard}>
            <Text style={styles.badge}>
              Upcoming Event
            </Text>

            <Text style={styles.bigTitle}>
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
            source={{
              uri: "https://via.placeholder.com/200",
            }}
            style={styles.featureImage}
          />
        </View>

        {/* Stats Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            Community Fund
          </Text>
          <Text style={styles.statValue}>
            ₹42,500
          </Text>
          <Text style={styles.desc}>
            Goal reached: 84%
          </Text>
        </View>

        {/* News */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Guild News
          </Text>

          <NewsItem
            title="New Export Quality Standards"
          />
          <NewsItem
            title="Raw Material Price Stabilization"
          />
        </View>

        {/* Quick Cards */}
        <View style={styles.row}>
          <MiniCard
            title="Matrimony"
            desc="3 new matches"
          />
          <MiniCard
            title="Birthdays"
            desc="3 today"
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* 🔹 Components */

function NewsItem({ title }) {
  return (
    <View style={styles.news}>
      <Text style={styles.newsText}>
        {title}
      </Text>
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
    backgroundColor: "#f8f7f5",
  },

  sidebar: {
    width: 220,
    backgroundColor: "#f1edea",
    padding: 15,
  },

  profile: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  name: {
    fontWeight: "bold",
    marginTop: 10,
  },

  role: {
    fontSize: 12,
    color: "#666",
  },

  menuItem: {
    padding: 10,
    color: "#603f33",
  },

  activeMenu: {
    backgroundColor: "#46291e",
    color: "#fff",
  },

  main: {
    flex: 1,
    padding: 15,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },

  cardRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
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

  bigTitle: {
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

  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  statTitle: {
    fontWeight: "bold",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  news: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },

  newsText: {
    fontSize: 14,
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
    borderRadius: 10,
  },

  bold: {
    fontWeight: "bold",
  },

  desc: {
    fontSize: 12,
    color: "#666",
  },
});