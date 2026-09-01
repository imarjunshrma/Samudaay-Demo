import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Profile</Text>
        <Text>IC</Text>
      </View>

      <ScrollView>
        {/* Profile Top */}
        <View style={styles.center}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: "https://via.placeholder.com/200",
              }}
              style={styles.avatar}
            />
            <Text style={styles.verified}>✔</Text>
          </View>

          <Text style={styles.name}>
            Rajesh Kumar
          </Text>

          <Text style={styles.id}>
            MEMBER ID: IC-2024-8839
          </Text>

          <Text style={styles.badge}>
            Verified Artisan
          </Text>
        </View>

        {/* Personal Details */}
        <Section title="Personal Details">
          <Row label="Full Name" value="Rajesh Kumar" />
          <Row label="Father Name" value="Suresh Kumar" />
          <Row label="Gender" value="Male" />
          <Row label="DOB" value="12 Aug 1985" />
          <Row label="Occupation" value="Master Cordwainer" />
        </Section>

        {/* Contact */}
        <Section title="Contact & Location">
          <Card label="Mobile" value="+91 98765 43210" />
          <Card label="Email" value="rajesh.kumar@artisan.in" />

          <View style={styles.block}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              42, Leather Artisan Row, Dharavi Market
            </Text>

            <View style={styles.rowBetween}>
              <Text style={styles.meta}>Mumbai</Text>
              <Text style={styles.meta}>400017</Text>
            </View>
          </View>
        </Section>

        {/* Management */}
        <Section title="Management">
          <ActionCard
            title="Manage Family Members"
            desc="4 Registered Members"
          />
          <ActionCard
            title="Document Management"
            desc="View KYC documents"
          />
        </Section>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logout}>
            <Text style={{ color: "red" }}>
              Sign Out
            </Text>
          </TouchableOpacity>

          <Text style={styles.version}>
            Version 2.4.1
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Feed", "Community", "Profile", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Profile" && {
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

/* 🔹 Components */

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Card({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function ActionCard({ title, desc }) {
  return (
    <TouchableOpacity style={styles.action}>
      <View>
        <Text style={styles.bold}>{title}</Text>
        <Text style={styles.meta}>{desc}</Text>
      </View>
      <Text>›</Text>
    </TouchableOpacity>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  center: {
    alignItems: "center",
    padding: 20,
  },

  avatarWrap: { position: "relative" },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  verified: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "green",
    color: "#fff",
    padding: 4,
    borderRadius: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  id: {
    fontSize: 12,
    color: "#666",
  },

  badge: {
    marginTop: 5,
    color: "#f2780d",
  },

  section: {
    padding: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    marginTop: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  label: {
    fontSize: 12,
    color: "#999",
  },

  value: {
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  block: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  action: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  footer: {
    alignItems: "center",
    marginTop: 20,
  },

  logout: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 20,
  },

  version: {
    marginTop: 10,
    fontSize: 10,
    color: "#999",
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