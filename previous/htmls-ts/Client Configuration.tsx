import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";

const PRIMARY = "#46291e";

export default function App() {
  const [users, setUsers] = useState("24");
  const [subCommunity, setSubCommunity] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState(0);

  const palettes = [
    ["#46291e", "#964900", "#fdf9f6"],
    ["#1a2e35", "#5d6d7e", "#f8f9f9"],
    ["#2d5a27", "#8fb9a8", "#f4f7f4"],
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Client Configuration</Text>
        <Text style={styles.role}>Superadmin</Text>
      </View>

      <ScrollView>

        {/* CLIENT TITLE */}
        <View style={styles.section}>
          <Text style={styles.client}>Aurum Leatherworks</Text>
          <Text style={styles.desc}>
            Configure client settings and branding.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LICENSE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>License & Access</Text>

          <Text style={styles.label}>Max Users</Text>
          <TextInput
            value={users}
            onChangeText={setUsers}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.label}>Allow Sub-communities</Text>
              <Text style={styles.subText}>
                Enable nested departments
              </Text>
            </View>

            <Switch
              value={subCommunity}
              onValueChange={setSubCommunity}
            />
          </View>
        </View>

        {/* BRANDING */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Branding</Text>

          {/* LOGO */}
          <View style={styles.logoBox}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO85Fs909FEiy6RJ9URS6UUI50Io1t9AdQBEQkoz-iK-wCND-XbcvYMjhfqAdaB8_nTTnJ7zkSXbZIeL5OnoxmSCQfGLdj39wYacGtfbaeMuJEG0i6X09In4xaeiq7zeewdByJSGpMTVqv7rtk7tCza1W9E7n09hk2Ss-vz8tPIZFEK38p66j0sMKAkZcSdfwhZAt0pkektWzDzEMs4R7gkObw1SzRqIGF_qIxOpuASoHNJakCfMl2qW92vxw0p08wyPAeePOmD3YU",
              }}
              style={styles.logo}
            />
            <Text style={styles.small}>Tap to upload</Text>
          </View>

          {/* COLOR PALETTE */}
          <Text style={styles.label}>Color Palette</Text>

          <View style={styles.paletteRow}>
            {palettes.map((colors, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.palette,
                  selectedPalette === i && styles.paletteActive,
                ]}
                onPress={() => setSelectedPalette(i)}
              >
                <View style={{ flexDirection: "row" }}>
                  {colors.map((c, j) => (
                    <View
                      key={j}
                      style={[styles.color, { backgroundColor: c }]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            Enterprise Subscription
          </Text>

          <Text style={styles.statusItem}>
            Created: Jan 12, 2024
          </Text>

          <Text style={styles.statusItem}>
            Last Updated: 2 hours ago
          </Text>

          <Text style={styles.statusItem}>
            Managed by: Julian Vane
          </Text>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Clients", "Configs", "Billing", "Audit"].map((item, i) => (
          <Text
            key={i}
            style={[
              styles.navItem,
              item === "Configs" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  title: { fontWeight: "bold", color: PRIMARY },

  role: { fontSize: 12, color: "#666" },

  section: { padding: 16 },

  client: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY,
  },

  desc: { color: "#666", marginTop: 4 },

  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  primaryBtn: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 6,
  },

  secondaryBtn: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subText: { fontSize: 11, color: "#999" },

  logoBox: {
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    width: 80,
    height: 80,
  },

  small: { fontSize: 10, color: "#777" },

  paletteRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  palette: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#eee",
  },

  paletteActive: {
    borderWidth: 2,
    borderColor: PRIMARY,
  },

  color: {
    width: 15,
    height: 15,
    marginRight: 2,
    borderRadius: 3,
  },

  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },

  statusTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },

  statusItem: {
    color: "#ddd",
    fontSize: 12,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: { fontSize: 12, color: "#777" },

  activeNav: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});