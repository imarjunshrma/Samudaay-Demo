import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [showAd, setShowAd] = useState(true);

  // Auto open ad on screen load
  useEffect(() => {
    setShowAd(true);
  }, []);

  return (
    <View style={styles.container}>

      {/* 🔥 AD MODAL */}
      <Modal visible={showAd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          
          <View style={styles.modalBox}>
            
            {/* CLOSE */}
            <TouchableOpacity
              style={styles.close}
              onPress={() => setShowAd(false)}
            >
              <Text style={{ color: "#fff" }}>✕</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: "https://picsum.photos/400" }}
              style={styles.adImage}
            />

            <View style={{ padding: 16 }}>
              <Text style={styles.adTitle}>
                Exclusive Member Discount
              </Text>

              <Text style={styles.adDesc}>
                Get up to 30% off on leather tools.
              </Text>

              <TouchableOpacity style={styles.adBtn}>
                <Text style={{ color: "#fff" }}>Shop Now</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>ICC Digital ID</Text>
        <Text>🔔</Text>
      </View>

      <ScrollView>

        {/* 🔥 INLINE SPONSORED CARD */}
        <View style={styles.sponsored}>
          <Text style={styles.sponsorTag}>Sponsored</Text>

          <View style={styles.sponsorRow}>
            <Image
              source={{ uri: "https://picsum.photos/100" }}
              style={styles.sponsorImg}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.sponsorTitle}>
                Premium Leather Supplies
              </Text>
              <Text style={styles.sponsorDesc}>
                Get 20% off for ICC members
              </Text>
            </View>

            <TouchableOpacity style={styles.openBtn}>
              <Text style={{ color: "#fff" }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DIGITAL CARD */}
        <View style={styles.card}>
          <Text style={styles.name}>Rajesh Kumar</Text>
          <Text style={styles.id}>IC-2024-8839</Text>

          <View style={styles.qrRow}>
            <View style={styles.qr}>
              <Text>QR</Text>
            </View>

            <TouchableOpacity style={styles.verify}>
              <Text style={{ color: "#fff" }}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DASHBOARD */}
        <View style={styles.grid}>
          {["Profile", "Family", "Events", "Donations"].map(
            (item, i) => (
              <TouchableOpacity key={i} style={styles.gridItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: { fontWeight: "bold" },

  /* 🔥 MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  close: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "black",
    padding: 6,
    borderRadius: 20,
  },

  adImage: {
    width: "100%",
    height: 200,
  },

  adTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  adDesc: {
    marginVertical: 6,
    color: "#666",
  },

  adBtn: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  /* 🔥 SPONSORED */
  sponsored: {
    margin: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  sponsorTag: {
    fontSize: 10,
    color: "#999",
  },

  sponsorRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
    alignItems: "center",
  },

  sponsorImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  sponsorTitle: { fontWeight: "bold" },

  sponsorDesc: { fontSize: 12, color: "#777" },

  openBtn: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 6,
  },

  /* CARD */
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },

  name: { color: "#fff", fontWeight: "bold" },

  id: { color: "#fff" },

  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  qr: {
    backgroundColor: "#fff",
    padding: 10,
  },

  verify: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },

  gridItem: {
    width: "48%",
    margin: "1%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
});