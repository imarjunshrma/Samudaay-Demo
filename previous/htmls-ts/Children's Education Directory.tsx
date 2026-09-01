import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#46291e";

export default function App() {
  const students = [
    {
      name: "Arjun Mehta",
      gujarati: "અર્જુન મહેતા",
      parent: "Rajesh Mehta",
      school: "St. Xavier's Academy",
      class: "Class 2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFLP7g0ufaOAOMHs6_NsVMLe-1WH91s1PhbwEkJab9GrDOI0Le-F3EMNSTy9drWNg3cJ2kzLwYJhxM4AYAnbRGnLh3LL0BHSuhe0Bvfx-VrLLH9ip7jDfl-b2CM3NyF8Rbw6-BwWyrC-yNrKg9XFAjrQoawRjX4PBeMCPP-yDN7hOqhwLxnyluvkyoZQjVTzWq7RQmrXExXfx_A3XOrSEWRjb_KgPv4Gw0Y01nK1grY48eSsYuQbaf1gTQBAvr6Y-gsrvf1YgsmjrM",
    },
    {
      name: "Diya Patel",
      gujarati: "દિયા પટેલ",
      parent: "Sanjay Patel",
      school: "Greenwood International",
      class: "Class 2",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXKczLHSdKLIsaA1eQBahYm0pnuvJa17EHx5uuOG6SupfM-TKg6kTeUlaGZqvWF3UzMHJFHZfuk3MS0J7LhrOa4Yc_5ezVVeWNP_8Ec-pCc7Cpb9-qmzRMbTWvtPQYYlRoVPltlcpZlUwgEsc8dnn3CRCc9E3IPkIT9ypxtKyH5b2WkybgH19fZ5X9MzXXwuJA-XTuYQPjIuyvGyyDmu4x8ruGoHtLhVo5BlbRUeIdbpcdFkwzUDDJp4UMVVGam0Y6D6Sm2CqpU5SX",
    },
    {
      name: "Ishaan Shah",
      gujarati: "ઈશાન શાહ",
      parent: "Amit Shah",
      school: "Bright Future School",
      class: "Class 1",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAtajG4GRIl5vZH9vmjnAICk-q169uFeR-ipQNESBdRJeY9FgUABtEymyyzYMcan6p54E5TUJvvFMVCQ8bYgYUoR3D7pCIVNGhsPr-YiWkoiFCrzmjou7t40eIyoBbvep48g5dSrMgKU3J0eWlb4LQEbLHmBu18T5o5Djz0m7QyVbUY5Ft8WVRUY6rfg3nTtqPi-j8-cyBwquAG56NE6R3LYPGkAZu6Rg9lb__9FID51tDI0eqoScIAZqarN9wirVgB_G-mtVq6hlfL",
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🎓 Student Directory</Text>
        <Text style={styles.icon}>🔍</Text>
      </View>

      <ScrollView>
        {/* SEARCH */}
        <View style={styles.searchSection}>
          <Text style={styles.heading}>Registry of the Rising Generation</Text>

          <TextInput
            placeholder="Search by name..."
            style={styles.searchInput}
          />

          {/* FILTERS */}
          <View style={styles.filters}>
            {["Class 1", "Class 2", "Class 3"].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.filterBtn,
                  item === "Class 2" && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    item === "Class 2" && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {students.map((item, i) => (
            <View key={i} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.class}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.gujarati}>{item.gujarati}</Text>

                <Text style={styles.meta}>Parent: {item.parent}</Text>

                <Text style={styles.meta}>School: {item.school}</Text>

                <TouchableOpacity style={styles.download}>
                  <Text style={styles.downloadText}>Download Marksheet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Students", "Reports", "Filters", "Profile"].map((item, i) => (
          <Text
            key={i}
            style={[styles.navItem, item === "Students" && styles.activeNav]}
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

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY,
  },

  icon: { fontSize: 18 },

  searchSection: {
    padding: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },

  filters: {
    flexDirection: "row",
    gap: 10,
  },

  filterBtn: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: PRIMARY,
  },

  filterText: { fontSize: 12 },

  activeFilterText: { color: "#fff" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: "1%",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 120,
  },

  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ff8928",
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  tagText: {
    fontSize: 10,
    color: "#fff",
  },

  cardContent: {
    padding: 10,
  },

  name: {
    fontWeight: "bold",
  },

  gujarati: {
    color: "#964900",
    fontSize: 12,
  },

  meta: {
    fontSize: 11,
    color: "#666",
  },

  download: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    padding: 6,
    borderRadius: 6,
  },

  downloadText: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
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
