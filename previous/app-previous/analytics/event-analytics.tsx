// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Text style={styles.icon}>📊</Text>
          <View>
            <Text style={styles.title}>
              Indian Cobbler Community
            </Text>
            <Text style={styles.subtitle}>
              Event Analytics Dashboard
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text>🔔</Text>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE49vrUtVcuQYl6dtRMrCA1oCXmGBesR5ErTNvksejFyeD4fgU5cOI8ubgt79K0YDhDVewsTAoBQ-jEI79SVoPxBkH1MJnD5Hp5PnYZaI-8Y6fnNoadzo4PcM0spDqKsbqe1YOUmIptSNFI_1rw17cBwOpcb1MPWvU0LnfhxzusXspyebKccQFdbapguO6hGxF-PnAI4CQs-bc3OMvSm9NlLKrZSn29x7bk5LwScU7K1yR13QM7OpDp8N3WRzb__p7-ggpseQX-qTo",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView>
        {/* Tabs */}
        <View style={styles.tabs}>
          {["Overview", "Registrations", "Catering"].map(
            (tab, i) => (
              <Text
                key={i}
                style={[
                  styles.tab,
                  i === 0 && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
            )
          )}
        </View>

        {/* Metrics */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text>Total Event Registrations</Text>
            <Text style={styles.big}>4,821</Text>
            <Text style={styles.green}>
              +14.2% from last month
            </Text>
          </View>

          <View style={styles.card}>
            <Text>Attendance Rate</Text>
            <Text style={styles.big}>87.4%</Text>

            <View style={styles.progressBg}>
              <View style={[styles.progress, { width: "87%" }]} />
            </View>
          </View>

          <View style={styles.card}>
            <Text>Active Workshops</Text>
            <Text style={styles.big}>24</Text>
            <Text style={styles.desc}>
              Across 8 cities
            </Text>
          </View>
        </View>

        {/* Catering */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Catering Requirements
          </Text>

          {/* Lunch */}
          <Text style={styles.bold}>
            Lunch: 1,240 / 1,500
          </Text>
          <View style={styles.progressBg}>
            <View style={[styles.progress, { width: "82%" }]} />
          </View>

          {/* Dinner */}
          <Text style={styles.bold}>
            Dinner: 850 / 1,000
          </Text>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progress,
                { width: "85%", backgroundColor: "blue" },
              ]}
            />
          </View>

          {/* Veg/Non-Veg */}
          <View style={styles.rowBetween}>
            <View style={styles.smallCard}>
              <Text>Vegetarian</Text>
              <Text style={styles.primary}>82%</Text>
            </View>

            <View style={styles.smallCard}>
              <Text>Non-Veg</Text>
              <Text>18%</Text>
            </View>
          </View>
        </View>

        {/* Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Events
          </Text>

          {/* Item */}
          <View style={styles.listItem}>
            <View>
              <Text style={styles.bold}>
                Dharavi Artisan Meet
              </Text>
              <Text style={styles.desc}>
                Mumbai • Oct 24
              </Text>
            </View>

            <View>
              <Text style={styles.bold}>
                450 Registrations
              </Text>
              <Text style={styles.green}>Completed</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View>
              <Text style={styles.bold}>
                Modern Tooling Workshop
              </Text>
              <Text style={styles.desc}>
                Agra • Oct 28
              </Text>
            </View>

            <View>
              <Text style={styles.bold}>
                120 Registrations
              </Text>
              <Text style={{ color: "blue" }}>
                Upcoming
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Events", "Members", "Settings"].map(
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  row: { flexDirection: "row", alignItems: "center", gap: 10 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  icon: { fontSize: 22 },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginLeft: 10,
  },

  title: { fontWeight: "bold" },

  subtitle: { fontSize: 12, color: "#666" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },

  tab: {
    padding: 10,
    color: "#999",
  },

  activeTab: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  big: {
    fontSize: 22,
    fontWeight: "bold",
  },

  green: { color: "green", fontSize: 12 },

  desc: { color: "#666", fontSize: 12 },

  progressBg: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },

  progress: {
    height: 8,
    backgroundColor: "#f2780d",
    borderRadius: 5,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  primary: { color: "#f2780d", fontWeight: "bold" },

  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bold: { fontWeight: "bold" },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },

  navItem: { fontSize: 12, color: "#888" },
});