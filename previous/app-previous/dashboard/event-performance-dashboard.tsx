// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function EventAnalyticsScreen() {
  const progress = (value, total) => `${(value / total) * 100}%`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>
            Annual Artisans Meet
          </Text>
          <Text style={styles.subtitle}>
            Mumbai • Oct 2023
          </Text>
        </View>

        <Text>🔗</Text>
      </View>

      <ScrollView>
        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Financial Overview
          </Text>

          <View style={styles.grid}>
            <View style={styles.metricCard}>
              <Text>Total Revenue</Text>
              <Text style={styles.big}>₹45,200</Text>
              <Text style={styles.green}>+12.5%</Text>
            </View>

            <View style={styles.metricCard}>
              <Text>Net Profit</Text>
              <Text style={styles.big}>₹18,450</Text>
              <Text style={styles.green}>+8.2%</Text>
            </View>
          </View>
        </View>

        {/* Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Attendance Rate
          </Text>

          <Text style={styles.big}>85%</Text>

          <View style={styles.chart}>
            {/* Registered */}
            <View style={styles.barContainer}>
              <View style={[styles.bar, { height: "100%" }]} />
              <Text style={styles.label}>Registered</Text>
            </View>

            {/* Attended */}
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { height: "85%", backgroundColor: "#f2780d" },
                ]}
              />
              <Text style={styles.label}>Attended</Text>
            </View>
          </View>
        </View>

        {/* Add-ons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Add-on Usage
          </Text>

          {/* Lunch */}
          <ProgressItem
            title="Lunches"
            value={150}
            total={200}
          />

          {/* Toolkits */}
          <ProgressItem
            title="Tool Kits"
            value={165}
            total={170}
          />

          {/* Certificates */}
          <ProgressItem
            title="Certificates"
            value={120}
            total={170}
          />
        </View>

        {/* Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              View Full Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Dashboard", "Events", "Community", "Profile"].map(
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

// 🔹 Reusable Progress Component
function ProgressItem({ title, value, total }) {
  const percent = (value / total) * 100;

  return (
    <View style={styles.progressCard}>
      <View style={styles.rowBetween}>
        <Text>{title}</Text>
        <Text>{value} / {total}</Text>
      </View>

      <View style={styles.progressBg}>
        <View
          style={[styles.progressFill, { width: `${percent}%` }]}
        />
      </View>

      <Text style={styles.percentText}>
        {percent.toFixed(0)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#f2780d" },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    gap: 10,
  },

  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  big: {
    fontSize: 22,
    fontWeight: "bold",
  },

  green: {
    color: "green",
    fontSize: 12,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 120,
    marginTop: 10,
  },

  barContainer: {
    alignItems: "center",
    flex: 1,
  },

  bar: {
    width: 20,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },

  label: {
    fontSize: 10,
    marginTop: 5,
  },

  progressCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressBg: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },

  progressFill: {
    height: 8,
    backgroundColor: "#f2780d",
    borderRadius: 5,
  },

  percentText: {
    fontSize: 10,
    marginTop: 5,
    color: "#666",
  },

  button: {
    backgroundColor: "#f2780d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
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