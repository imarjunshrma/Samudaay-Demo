import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function MyEventsScreen() {
  const [tab, setTab] = useState("Upcoming");

  const events = {
    Upcoming: {
      "This Month": [
        {
          title: "Annual Cobbler Meetup 2024",
          date: "Oct 25, 2024",
          location: "Pragati Maidan, Delhi",
        },
        {
          title: "Leather Craft Workshop",
          date: "Oct 28, 2024",
          location: "Dharavi, Mumbai",
        },
      ],
      "Next Month": [
        {
          title: "Sustainable Footwear Expo",
          date: "Nov 12, 2024",
          location: "Whitefield, Bengaluru",
        },
      ],
    },
    Past: {},
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>My Events</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Upcoming", "Past"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tab,
              tab === t && styles.activeTab,
            ]}
            onPress={() => setTab(t)}
          >
            <Text
              style={
                tab === t
                  ? styles.activeText
                  : styles.tabText
              }
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView>
        {Object.keys(events[tab]).map((section) => (
          <View key={section}>
            <Text
              style={[
                styles.section,
                section === "Next Month" && {
                  opacity: 0.6,
                },
              ]}
            >
              {section}
            </Text>

            {events[tab][section].map((e, i) => (
              <EventCard key={i} {...e} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "My Events", "Community", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "My Events" && {
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

/* 🔹 Event Card */

function EventCard({ title, date, location }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{title}</Text>

          <Text style={styles.meta}>
            📅 {date}
          </Text>

          <Text style={styles.meta}>
            📍 {location}
          </Text>
        </View>

        <Image
          source={{
            uri: "https://via.placeholder.com/150",
          }}
          style={styles.img}
        />
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={{ color: "#fff" }}>
          🎟 View Pass
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    marginLeft: 10,
    fontWeight: "bold",
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#f2780d",
  },

  tabText: { color: "#999" },

  activeText: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  section: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  img: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },

  name: { fontWeight: "bold" },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#f2780d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
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