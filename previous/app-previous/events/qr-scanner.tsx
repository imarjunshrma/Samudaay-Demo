// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";

export default function QRScannerScreen() {
  const [showResult, setShowResult] = useState(true);
  const [mode, setMode] = useState("attendance");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>
          Admin QR Scanner
        </Text>
        <Text>⏱</Text>
      </View>

      {/* Scanner */}
      <View style={styles.camera}>
        <View style={styles.frame}>
          <View style={styles.scanLine} />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text>🔦</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.scanBtn}>
            <Text style={{ color: "#fff" }}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Text>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Switch */}
      <View style={styles.modeWrap}>
        <TouchableOpacity
          style={[
            styles.mode,
            mode === "attendance" && styles.activeMode,
          ]}
          onPress={() => setMode("attendance")}
        >
          <Text>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mode,
            mode === "addon" && styles.activeMode,
          ]}
          onPress={() => setMode("addon")}
        >
          <Text>Add-ons</Text>
        </TouchableOpacity>
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {/* User */}
            <View style={styles.user}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/100",
                }}
                style={styles.avatar}
              />

              <View>
                <Text style={styles.name}>
                  Rajesh Kumar
                </Text>
                <Text style={styles.meta}>
                  #ICC-2024-8892
                </Text>
              </View>
            </View>

            {/* Add-ons */}
            <AddonItem title="Lunch Coupon" />
            <AddonItem title="Gift Pack" used />
            <AddonItem title="Dinner Pass" />

            <TouchableOpacity
              style={styles.next}
              onPress={() => setShowResult(false)}
            >
              <Text style={{ color: "#fff" }}>
                Next Scan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* 🔹 Addon */

function AddonItem({ title, used }) {
  return (
    <View style={styles.addon}>
      <Text>{title}</Text>

      {used ? (
        <Text style={{ color: "green" }}>
          ✔ Used
        </Text>
      ) : (
        <TouchableOpacity style={styles.useBtn}>
          <Text style={{ color: "#fff" }}>
            Use
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* 🔹 Styles */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },

  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#f2780d",
  },

  scanLine: {
    height: 2,
    backgroundColor: "#f2780d",
    marginTop: 10,
  },

  controls: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    gap: 20,
  },

  iconBtn: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 50,
  },

  scanBtn: {
    padding: 20,
    backgroundColor: "#f2780d",
    borderRadius: 50,
  },

  modeWrap: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },

  mode: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  activeMode: {
    backgroundColor: "#f2780d",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },

  user: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  name: { fontWeight: "bold" },

  meta: { fontSize: 12, color: "#666" },

  addon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  useBtn: {
    backgroundColor: "#f2780d",
    padding: 6,
    borderRadius: 6,
  },

  next: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
  },
});