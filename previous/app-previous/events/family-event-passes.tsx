// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PassScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    {
      name: "Rajesh Kumar",
      event: "Global Tech Summit 2024",
      addons: ["Lunch Buffet", "Networking Dinner"],
    },
    {
      name: "Sunita Devi",
      event: "Global Tech Summit 2024",
      addons: ["Lunch Buffet"],
    },
    {
      name: "Anjali Kumar",
      event: "Global Tech Summit 2024",
      addons: ["Workshop Access"],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Family Event Passes</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Carousel */}
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center" }}>
            <View style={styles.card}>
              {/* QR */}
              <View style={styles.qrBox}>
                <Image
                  source={{
                    uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-pass",
                  }}
                  style={styles.qr}
                />
                <Text style={styles.scanText}>
                  Scan at Entrance
                </Text>
              </View>

              {/* Info */}
              <Text style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.event}>
                {item.event}
              </Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Add-ons */}
              <Text style={styles.label}>
                Registered Add-ons
              </Text>

              {item.addons.map((addon, i) => (
                <View key={i} style={styles.addon}>
                  <Text>{addon}</Text>
                  <Text style={{ color: "green" }}>✔</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>
            Download Pass
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Keep pass ready for quick entry
        </Text>
      </View>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Schedule", "Pass", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Pass" && { color: "#f2780d" },
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

  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },

  qrBox: {
    alignItems: "center",
    marginBottom: 10,
  },

  qr: {
    width: 180,
    height: 180,
  },

  scanText: {
    color: "#f2780d",
    fontSize: 12,
    marginTop: 5,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  event: {
    fontSize: 12,
    color: "#666",
  },

  divider: {
    width: "100%",
    borderTopWidth: 1,
    borderStyle: "dashed",
    marginVertical: 15,
  },

  label: {
    fontSize: 10,
    color: "#999",
    marginBottom: 5,
  },

  addon: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff3e6",
    borderRadius: 10,
    marginBottom: 5,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 3,
  },

  activeDot: {
    backgroundColor: "#f2780d",
  },

  footer: {
    padding: 20,
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  note: {
    fontSize: 10,
    color: "#666",
    marginTop: 10,
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