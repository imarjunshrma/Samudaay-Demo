// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function PublicationScreen() {
  const [selectedMonth, setSelectedMonth] = useState("Jan 2024");

  const [options, setOptions] = useState({
    news: true,
    ads: true,
    matrimony: false,
    events: true,
  });

  const toggleOption = (key) => {
    setOptions({
      ...options,
      [key]: !options[key],
    });
  };

  const pdfs = [
    {
      name: "December 2023",
      status: "Ready",
    },
    {
      name: "January 2024",
      status: "In Progress",
    },
    {
      name: "November 2023",
      status: "Ready",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Generate Publication
        </Text>
      </View>

      <ScrollView>
        {/* Month */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Select Month
          </Text>

          <TouchableOpacity style={styles.select}>
            <Text>{selectedMonth}</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Content to Include
          </Text>

          <Option
            label="Community News"
            value={options.news}
            onPress={() => toggleOption("news")}
          />
          <Option
            label="Advertisements"
            value={options.ads}
            onPress={() => toggleOption("ads")}
          />
          <Option
            label="Matrimony"
            value={options.matrimony}
            onPress={() => toggleOption("matrimony")}
          />
          <Option
            label="Event Highlights"
            value={options.events}
            onPress={() => toggleOption("events")}
          />
        </View>

        {/* Generate */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>
              Generate PDF
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.bold}>
            Recent PDFs
          </Text>

          {pdfs.map((item, i) => (
            <PdfItem key={i} {...item} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Generate", "Settings"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Generate" && {
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

function Option({ label, value, onPress }) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
    >
      <Text>{label}</Text>
      <Text>{value ? "☑" : "☐"}</Text>
    </TouchableOpacity>
  );
}

function PdfItem({ name, status }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.bold}>{name}</Text>
        <Text style={styles.desc}>
          Generated recently
        </Text>
      </View>

      <Text
        style={{
          fontSize: 10,
          color:
            status === "Ready"
              ? "green"
              : "blue",
        }}
      >
        {status}
      </Text>
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

  section: { padding: 15 },

  bold: { fontWeight: "bold" },

  select: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  option: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  btn: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  desc: { fontSize: 12, color: "#666" },

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