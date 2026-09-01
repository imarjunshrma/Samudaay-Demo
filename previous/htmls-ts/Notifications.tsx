import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function NotificationsScreen() {
  const [tab, setTab] = useState("All");

  const [data, setData] = useState([
    {
      title: "New Order Received",
      desc: "Order ID: #IN-9082",
      time: "2m ago",
      type: "order",
      read: false,
    },
    {
      title: "New Tip in Community",
      desc: "How to maintain leather shine",
      time: "1h ago",
      type: "community",
      read: false,
    },
    {
      title: "Workshop Tomorrow",
      desc: "Starts at 10 AM",
      time: "1d ago",
      type: "event",
      read: true,
    },
    {
      title: "Payout Successful",
      desc: "₹4,500 transferred",
      time: "1d ago",
      type: "payment",
      read: true,
    },
    {
      title: "New 5-Star Review",
      desc: "Excellent craftsmanship!",
      time: "2d ago",
      type: "review",
      read: true,
    },
  ]);

  const markAllRead = () => {
    const updated = data.map((n) => ({
      ...n,
      read: true,
    }));
    setData(updated);
  };

  const filtered =
    tab === "All"
      ? data
      : data.filter((n) => !n.read);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Notifications
        </Text>

        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.primary}>
            Mark all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["All", "Unread"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.tab,
                tab === t && styles.activeTab,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications */}
      <ScrollView>
        {filtered.map((item, i) => (
          <NotificationCard key={i} {...item} />
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Orders", "Notifications", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Notifications" && {
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

/* 🔹 Notification Card */

function NotificationCard({
  title,
  desc,
  time,
  read,
}) {
  return (
    <View
      style={[
        styles.card,
        read && { opacity: 0.6 },
      ]}
    >
      <View style={styles.dotWrap}>
        {!read && <View style={styles.dot} />}
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.name}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <Text style={styles.desc}>{desc}</Text>
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

  primary: {
    color: "#f2780d",
    fontSize: 12,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  tab: {
    padding: 12,
    color: "#999",
  },

  activeTab: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },

  dotWrap: {
    width: 10,
    justifyContent: "center",
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#f2780d",
    borderRadius: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "bold",
  },

  time: {
    fontSize: 10,
    color: "#999",
  },

  desc: {
    fontSize: 12,
    color: "#666",
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