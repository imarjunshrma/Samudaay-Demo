// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function PublicationsScreen() {
  const [search, setSearch] = useState("");

  const data = {
    "2024": [
      {
        title: "January 2024 Edition",
        desc: "New Year resolutions and community projects",
      },
      {
        title: "February 2024 Edition",
        desc: "Valentines special and local market features",
      },
    ],
    "2023": [
      {
        title: "December 2023 Edition",
        desc: "Year in review and holiday celebrations",
      },
      {
        title: "November 2023 Edition",
        desc: "Autumn harvest and volunteer spotlight",
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Community Publications
        </Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search months or topics"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      <ScrollView>
        {Object.keys(data).map((year) => (
          <View key={year}>
            {/* Year Title */}
            <Text style={styles.year}>
              Archive {year}
            </Text>

            {/* Publications */}
            {data[year].map((item, i) => (
              <PublicationCard key={i} {...item} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "News", "Pubs", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Pubs" && {
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

/* 🔹 Publication Card */

function PublicationCard({ title, desc }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>

        <Image
          source={{ uri: "https://via.placeholder.com/100x140" }}
          style={styles.img}
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.read}>
          <Text style={{ color: "#fff" }}>
            📖 Read Online
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.download}>
          <Text style={styles.primary}>
            ⬇ PDF
          </Text>
        </TouchableOpacity>
      </View>
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

  searchBox: { padding: 15 },

  input: {
    backgroundColor: "#fff3e6",
    padding: 12,
    borderRadius: 10,
  },

  year: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  img: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },

  name: { fontWeight: "bold" },

  desc: {
    fontSize: 12,
    color: "#666",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  read: {
    flex: 1,
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  download: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffe7d3",
    justifyContent: "center",
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