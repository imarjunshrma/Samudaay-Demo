import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function UploadMarksheet() {
  const [selectedChild, setSelectedChild] = useState(0);

  const children = [
    { name: "Arjun Mehta" },
    { name: "Diya Patel" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Upload Marksheet</Text>
      </View>

      <ScrollView>
        {/* Step 1 */}
        <Text style={styles.section}>
          Select Child (Step 1/3)
        </Text>

        <ScrollView horizontal>
          {children.map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedChild(i)}
              style={styles.childWrap}
            >
              <View
                style={[
                  styles.avatar,
                  selectedChild === i && styles.active,
                ]}
              />
              <Text
                style={
                  selectedChild === i
                    ? styles.bold
                    : styles.meta
                }
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add new */}
          <View style={styles.childWrap}>
            <View style={styles.addCircle}>
              <Text>+</Text>
            </View>
            <Text style={styles.meta}>New</Text>
          </View>
        </ScrollView>

        {/* Step 2 */}
        <Text style={styles.section}>
          Academic Year
        </Text>

        <View style={styles.dropdown}>
          <Text>2023 - 2024</Text>
        </View>

        {/* Step 3 */}
        <Text style={styles.section}>
          Upload Document
        </Text>

        <TouchableOpacity style={styles.upload}>
          <Text>📤 Upload Marksheet</Text>
          <Text style={styles.meta}>
            PDF / JPG / PNG
          </Text>
        </TouchableOpacity>

        {/* File Preview */}
        <View style={styles.file}>
          <View>
            <Text style={styles.bold}>
              Arjun_Grade_8.pdf
            </Text>
            <Text style={styles.meta}>
              1.2 MB • Ready
            </Text>
          </View>

          <View style={styles.row}>
            <Text>👁</Text>
            <Text>🗑</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            Submit Marksheet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Home", "Education", "Family", "Inbox"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Education" && {
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

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { marginLeft: 10, fontWeight: "bold" },

  section: {
    padding: 15,
    fontWeight: "bold",
  },

  childWrap: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },

  active: {
    borderWidth: 2,
    borderColor: "#f2780d",
  },

  addCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  upload: {
    margin: 15,
    padding: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    borderRadius: 10,
  },

  file: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  bold: { fontWeight: "bold" },

  meta: {
    fontSize: 12,
    color: "#666",
  },

  footer: {
    padding: 15,
    backgroundColor: "#fff",
  },

  btn: {
    backgroundColor: "#46291e",
    padding: 15,
    borderRadius: 10,
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