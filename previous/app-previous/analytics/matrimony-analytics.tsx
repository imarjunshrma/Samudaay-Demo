// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function MatrimonyAdminScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Community Admin
          </Text>
          <Text style={styles.subtitle}>
            Matrimony Dashboard
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text>👤</Text>
        </View>
      </View>

      <ScrollView>
        {/* Heading */}
        <View style={styles.section}>
          <Text style={styles.big}>
            Analytics Overview
          </Text>
          <Text style={styles.desc}>
            Platform performance
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.grid}>
          <StatCard title="Active Profiles" value="12,450" growth="+12%" />
          <StatCard title="New This Month" value="840" growth="+5%" />
          <StatCard title="Revenue" value="₹4.2L" growth="+18%" />
        </View>

        {/* Chart */}
        <View style={styles.card}>
          <Text style={styles.bold}>
            Revenue Analytics
          </Text>

          <View style={styles.chart}>
            {[35, 60, 45, 55, 80, 100].map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    { height: `${h}%` },
                    i === 5 && styles.barActive,
                  ]}
                />
                <Text style={styles.month}>
                  {["JAN","FEB","MAR","APR","MAY","JUN"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Approvals */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Recent Approvals
          </Text>

          <ProfileItem name="Rajesh Kumar" status="Approved" />
          <ProfileItem name="Priya Varma" status="Pending" />
          <ProfileItem name="Amit Jaiswal" status="Approved" />

          <TouchableOpacity style={styles.viewAll}>
            <Text style={styles.primary}>
              View All Requests
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Profiles", "Revenue", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                i === 0 && { color: "#f2780d" },
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
      <Text style={styles.desc}>{title}</Text>
      <Text style={styles.big}>{value}</Text>
      <Text style={styles.green}>{growth}</Text>
    </View>
  );
}

function ProfileItem({ name, status }) {
  return (
    <View style={styles.item}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.avatarSmall}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.desc}>Location • Age</Text>
      </View>

      <Text
        style={{
          fontSize: 10,
          color:
            status === "Approved" ? "green" : "orange",
        }}
      >
        {status}
      </Text>
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

  subtitle: { fontSize: 12, color: "#666" },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  section: { padding: 15 },

  big: {
    fontSize: 20,
    fontWeight: "bold",
  },

  desc: { fontSize: 12, color: "#666" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },

  stat: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  green: { color: "green", fontSize: 12 },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    marginTop: 10,
  },

  barWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },

  bar: {
    width: 10,
    backgroundColor: "#f2780d33",
    borderRadius: 5,
  },

  barActive: {
    backgroundColor: "#f2780d",
  },

  month: {
    fontSize: 10,
    marginTop: 5,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  viewAll: {
    marginTop: 10,
    alignItems: "center",
  },

  primary: {
    color: "#f2780d",
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