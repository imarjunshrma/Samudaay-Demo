// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

export default function EventScreen() {
  const [items, setItems] = useState({
    lunch: { selected: false, qty: 1, price: 200 },
    dinner: { selected: false, qty: 1, price: 350 },
    gift: { selected: false, qty: 1, price: 150 },
  });

  const toggleItem = (key) => {
    setItems({
      ...items,
      [key]: { ...items[key], selected: !items[key].selected },
    });
  };

  const updateQty = (key, type) => {
    const qty =
      type === "inc"
        ? items[key].qty + 1
        : Math.max(1, items[key].qty - 1);

    setItems({
      ...items,
      [key]: { ...items[key], qty },
    });
  };

  const total = Object.values(items).reduce((sum, item) => {
    return item.selected ? sum + item.qty * item.price : sum;
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>←</Text>
        <Text style={styles.title}>Event Details</Text>
        <Text>🔗</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxtBg7MhjfrIfzefccmJw6v2MBG6TJGXsxLzECkiWhoNL5bz9csls_Gi4WPWDndqe_F046bs2eYB3Qdebs8rVlQyGiiYnmf6-ccJ29UnJ_NVqN-LIGCWjPftErnKfjic1W52ZhivjJG_QN8u6-HqX9yDzY6ZRpxg2xGHjCBEIEU1g5nUFSJbvErQSmwgFkmXKPwwXt7HIti-OYFoFYIsopYrloI0oAGOJ2Mg4BJMKQ-UdTa-fYLFZhob159mvTaiqNOwOQBDkuGfQY",
          }}
          style={styles.hero}
        />

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.badge}>COMMUNITY EVENT</Text>
          <Text style={styles.eventTitle}>
            Anand Medo, Vadodara
          </Text>
          <Text style={styles.primary}>
            Indian Cobbler Community
          </Text>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            📅 October 15, 2024
          </Text>
          <Text style={styles.desc}>
            Sunday, 10:00 AM - 08:00 PM
          </Text>

          <Text style={[styles.bold, { marginTop: 10 }]}>
            📍 Pragati Maidan
          </Text>
          <Text style={styles.desc}>
            New Delhi
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About Event
          </Text>
          <Text style={styles.desc}>
            Join the largest cobbler community meetup.
            Network, learn, and explore innovations.
          </Text>
        </View>

        {/* Add-ons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Add-ons
          </Text>

          {Object.keys(items).map((key) => {
            const item = items[key];

            return (
              <View key={key} style={styles.addon}>
                <TouchableOpacity
                  onPress={() => toggleItem(key)}
                >
                  <Text style={styles.bold}>
                    {key.toUpperCase()} ₹{item.price}
                  </Text>
                </TouchableOpacity>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() =>
                      updateQty(key, "dec")
                    }
                  >
                    <Text style={styles.qtyBtn}>-</Text>
                  </TouchableOpacity>

                  <Text>{item.qty}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      updateQty(key, "inc")
                    }
                  >
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.chatBtn}>
        <Text style={{ color: "#fff" }}>💬 Chat</Text>
      </TouchableOpacity>

      {/* Bottom Bar */}
      <View style={styles.bottom}>
        <View>
          <Text style={styles.desc}>Total</Text>
          <Text style={styles.total}>₹{total}</Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaText}>
            View Event Photos
          </Text>
        </TouchableOpacity>
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

  title: { fontWeight: "bold" },
  icon: { fontSize: 18 },

  hero: { width: "100%", height: 180 },

  section: { padding: 15 },

  badge: {
    color: "#f2780d",
    fontSize: 12,
    fontWeight: "bold",
  },

  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  primary: { color: "#f2780d" },

  desc: { color: "#666", fontSize: 12 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  addon: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qtyBtn: {
    fontSize: 18,
    paddingHorizontal: 10,
  },

  bold: { fontWeight: "bold" },

  chatBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
  },

  ctaBtn: {
    backgroundColor: "#f2780d",
    padding: 12,
    borderRadius: 10,
  },

  ctaText: {
    color: "#fff",
    fontWeight: "bold",
  },
});