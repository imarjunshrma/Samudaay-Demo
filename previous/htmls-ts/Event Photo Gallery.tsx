import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

export default function GalleryScreen() {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Community", "Workshops", "Crafts"];

  const images = [
    { id: 1, category: "Community", uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuADj1ve0nk3WnaYZ0aF4Sl3M39BNlDm8PHdCXxIKaFZaZ7GC05s1Pr9MG6HFBR31OAd9K2FQIKSxKEaqzGAP0fKJ3W1SQhLGF6JaLpLRBRoxAE3LaoL2M2ut2JplTCoXdm5aXjlJJVdw4j8TITXEKfkL5lT863pscAseJ0Mq2VgS0Ne2cvTmVVRm0C2ntIncMFamv3GFQIdDIg5KL9sjURKNe7qWqgvVawMAslqvRcW7iwQE7zk_NfNrm1322tpQQkZsaoDXSADaiaQ" },
    { id: 2, category: "Workshops", uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOM1yglEA6WfV8SEx8HuGCpcX9IENptyBFtILU5o2gZ2vjcmfR6lfzEiZmfycUm0ErDRQIX-MfkhGEQnPPtdM0URuQpgw6n1WaX0m_P1XFUU7NcTsvY3PEOc5JzfhWaZ_j13D91JDsge_78jwaL7jVyORJZ8MUK-P8GoumfqfIF5Py0DUOMKvTn2GBEZDACLmZjx9kP64ru7vPISyKNyqmioaoVd36CHlbCwi4FmPjBNIp2S_QAktc7jjxiNyreDlPfyK-bu6xbLhA" },
    { id: 3, category: "Crafts", uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjJl7n7qSBZBYVusAx3VLrz9CPB39g3UHVYitqfbn67HT0a3XSfsxgNX4lSOqB5zdJBHpExLRvgvO34NkVAZoFKG4A5Qiwye3h3C8cOZhYRR1V9f9XiZSEB3o-RR2TJXcC0mU9duNwGeRBSghsvsFJRBZ6z9_kLR8e-1Z4VLPVBDRdP4HPzYtlWg9nmUx2nGl0jTudoq1HMaPFlscnWfLnjl56sz3TwLd7a3A42zN2NNtKD1I8Zl_6oz6n2ZRECAY4RrmhzIv0FZwb" },
    { id: 4, category: "Community", uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRi3KhP2vTzdxJDnXZqs5mk6MF5L2t1cmBHlLpIZLdVELSR9aOHkRufQDflFGEzIrVkHWBpcWvxy723YITBp_aeX9o3VuWD_iJk2984bMTVvWCvux4lWUEXvKbMIav3fR4Pwcl_oyXb3XLb0jVYZuKy9GhwxuxxzDpgWTQRREcadcu-RHBHvDY7SEb7CZB3ZeKkNE6OcTH_cY3RijNm7lqc_A4--z8QYSZMXP4EBQ9Uz12e_nQCcb94RJyABXwOYemfMFpDfUVRZF2" },
  ];

  const filtered =
    activeTab === "All"
      ? images
      : images.filter((img) => img.category === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text>←</Text>
        <View>
          <Text style={styles.title}>Annual Meetup</Text>
          <Text style={styles.subtitle}>
            Oct 12-14, 2023
          </Text>
        </View>
        <Text>🔗</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
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
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
          />
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff" }}>📷</Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.nav}>
        {["Events", "Gallery", "Search", "Profile"].map(
          (item, i) => (
            <Text
              key={i}
              style={[
                styles.navItem,
                item === "Gallery" && {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#f2780d" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },

  tab: {
    padding: 10,
    color: "#999",
  },

  activeTab: {
    color: "#f2780d",
    fontWeight: "bold",
  },

  image: {
    width: "48%",
    height: 150,
    margin: "1%",
    borderRadius: 10,
  },

  fab: {
    position: "absolute",
    bottom: 80,
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