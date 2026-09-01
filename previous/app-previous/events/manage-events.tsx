import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const tabs = ["All", "Upcoming", "Past", "Drafts"];

  const events = [
    {
      title: "Community Garden Planting",
      status: "Upcoming",
      date: "Oct 12",
      time: "10:00 AM",
      location: "Green Park",
    },
    {
      title: "Book Club",
      status: "Upcoming",
      date: "Oct 15",
      time: "6:30 PM",
      location: "Central Library",
    },
    {
      title: "Youth Soccer Finals",
      status: "Past",
      date: "Sep 30",
      time: "9:00 AM",
      location: "Sports Complex",
    },
  ];

  const filteredEvents = events.filter((e) => {
    const matchTab =
      activeTab === "All" || e.status === activeTab;

    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Manage Events
        </Text>

        <TouchableOpacity style={styles.createBtn}>
          <Text style={{ color: "#fff" }}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Search */}
        <TextInput
          placeholder="Search events..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 10 }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events */}
        {filteredEvents.map((event, i) => (
          <EventCard key={i} {...event} />
        ))}

        {/* Pagination */}
        <View style={styles.pagination}>
          <Text style={styles.pageActive}>1</Text>
          <Text style={styles.page}>2</Text>
          <Text style={styles.page}>3</Text>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff", fontSize: 22 }}>
          +
        </Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Admin", "Events", "Users", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Events" && {
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

function EventCard({ title, status, date, time, location }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle}>
          {title}
        </Text>

        <Text style={styles.meta}>
          📅 {date} | ⏰ {time}
        </Text>

        <Text style={styles.meta}>
          📍 {location}
        </Text>

        <Text
          style={[
            styles.status,
            status === "Upcoming"
              ? { color: "green" }
              : { color: "#999" },
          ]}
        >
          {status}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.edit}>
          <Text>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delete}>
          <Text>🗑️</Text>
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

  createBtn: {
    backgroundColor: "#f2780d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  search: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },

  tab: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  activeTab: {
    backgroundColor: "#f2780d",
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
  },

  eventTitle: {
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  status: {
    fontSize: 12,
    marginTop: 5,
  },

  actions: {
    justifyContent: "space-between",
  },

  edit: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  delete: {
    padding: 8,
    backgroundColor: "#ffe5e5",
    borderRadius: 8,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10,
  },

  page: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  pageActive: {
    padding: 8,
    backgroundColor: "#f2780d",
    color: "#fff",
    borderRadius: 8,
  },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 50,
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