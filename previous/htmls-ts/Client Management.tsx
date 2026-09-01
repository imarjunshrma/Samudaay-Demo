import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

const PRIMARY = "#46291e";

export default function App() {
  const clients = [
    { name: "The Tanner's Guild", users: 842, status: "Verified" },
    { name: "Waxed Thread Co.", users: 0, status: "Inactive" },
  ];

  const list = [
    { name: "Bespoke Finishes Ltd", users: 312, status: "ACTIVE" },
    { name: "The Lasting Studio", users: 194, status: "ACTIVE" },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>The Digital Atelier</Text>
        <Text style={styles.role}>Superadmin</Text>
      </View>

      <ScrollView>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.tag}>Registry</Text>
          <Text style={styles.title}>
            Client Directory
          </Text>

          <TextInput
            placeholder="Search communities..."
            style={styles.search}
          />
        </View>

        {/* FEATURED CARD */}
        <View style={styles.featured}>
          <Text style={styles.featuredTitle}>
            Stitch & Sole Collective
          </Text>

          <Text style={styles.featuredSub}>
            Active Community
          </Text>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Artisans</Text>
              <Text style={styles.statValue}>1,284</Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Last Sync</Text>
              <Text style={styles.statValue}>2h ago</Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Tier</Text>
              <Text style={styles.statValue}>Pro</Text>
            </View>
          </View>

          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqXIpGhlS-Qj06EHXe381vEy8WZtrFa7n9Sam9x3WA38GiXrJC5WGGLcvU0o0TgXV3Nqzg1ZWwKBCYHCkRdRSZ5filnHqFtqZvFHx6RvWScW6D4rOUYcSejRcfTr2Yyk0C2TbyC1SeSHjPfcPZca-fxYCOcXYicX8GiisMptpLJmDB1O6BLXhwvEZqLm_oiytpoIoFiSo7k9oMl1oVBdwgxf5hMQ57quUHhMCI9qXZqpVnNc3dY-ubG9UEGrEVK2ubr0inxZ33fKYq",
            }}
            style={styles.featuredImg}
          />
        </View>

        {/* SMALL CARDS */}
        <View style={styles.grid}>
          {clients.map((item, i) => (
            <View key={i} style={styles.card}>
              
              <Text style={styles.cardTitle}>{item.name}</Text>

              <Text style={styles.cardUsers}>
                {item.users} users
              </Text>

              <Text
                style={[
                  styles.status,
                  item.status === "Inactive" && { color: "red" },
                ]}
              >
                {item.status}
              </Text>

              <View style={styles.cardBtns}>
                <TouchableOpacity>
                  <Text style={styles.link}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={[styles.link, { color: "red" }]}>
                    Action
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Clients</Text>

          {list.map((item, i) => (
            <View key={i} style={styles.listItem}>
              
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>
                  {item.users} users
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity>
                  <Text style={styles.link}>⚙️</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.link}>↗</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Clients", "Configs", "Billing", "Audit"].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Clients" && styles.activeNav,
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

  tag: { fontSize: 12, color: "#964900" },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: PRIMARY,
  },

  search: {
    borderBottomWidth: 1,
    marginTop: 10,
  },

  featured: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  featuredSub: {
    fontSize: 12,
    color: "green",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  statLabel: { fontSize: 10, color: "#777" },

  statValue: { fontWeight: "bold" },

  featuredImg: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  card: {
    width: "48%",
    margin: "1%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  cardTitle: { fontWeight: "bold" },

  cardUsers: { fontSize: 12, color: "#777" },

  status: { fontSize: 10, color: "green" },

  cardBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  link: { fontSize: 12, color: PRIMARY },

  section: { padding: 16 },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },

  name: { fontWeight: "bold" },

  sub: { fontSize: 12, color: "#777" },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  fabText: {
    color: "#fff",
    fontSize: 24,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});