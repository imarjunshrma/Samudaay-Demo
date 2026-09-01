import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#ec5b13";

export default function App() {
  const [contentType, setContentType] = useState("text");
  const [plan, setPlan] = useState("premium");
  const [price, setPrice] = useState("499");

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.icon}>←</Text>
        <Text style={styles.title}>Create Advertisement</Text>
        <Text style={styles.icon}>📢</Text>
      </View>

      <ScrollView>

        {/* TITLE */}
        <View style={styles.section}>
          <Text style={styles.heading}>Ad Campaign Details</Text>
          <Text style={styles.sub}>
            Promote your services to the community
          </Text>
        </View>

        {/* TITLE INPUT */}
        <Input label="Ad Title" placeholder="Enter title..." />

        {/* TYPE */}
        <Select label="Advertisement Type" />

        {/* DESCRIPTION */}
        <Input label="Ad Description" multiline />

        {/* CONTENT TYPE */}
        <Text style={styles.label}>Content Type</Text>

        <View style={styles.row}>
          {["text", "image", "video"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setContentType(type)}
              style={[
                styles.typeCard,
                contentType === type && styles.activeType,
              ]}
            >
              <Text>{type.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MEDIA */}
        <Input label="Media URL" placeholder="https://..." />

        {/* DATES */}
        <View style={styles.row}>
          <Input label="Start Date" />
          <Input label="End Date" />
        </View>

        {/* PLAN */}
        <View style={styles.planBox}>
          <Text style={styles.planTitle}>Plan Type</Text>

          <View style={styles.row}>
            {["free", "premium"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPlan(p)}
                style={[
                  styles.radio,
                  plan === p && styles.activeRadio,
                ]}
              >
                <Text>{p.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PRICE */}
          <Text style={styles.label}>Price (₹)</Text>

          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>
            Publish Advertisement
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Ads", "Reports", "Profile"].map((item) => (
          <Text
            key={item}
            style={[
              styles.navItem,
              item === "Ads" && styles.activeNav,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* 🔹 Input Component */
function Input({ label, ...props }) {
  return (
    <View style={{ margin: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

/* 🔹 Dummy Select */
function Select({ label }) {
  return (
    <View style={{ margin: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Text>Banner</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f6f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  icon: { fontSize: 18 },

  title: { fontWeight: "bold" },

  section: { padding: 16 },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },

  sub: { color: "#666" },

  label: {
    fontSize: 12,
    color: "#777",
  },

  input: {
    marginTop: 6,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
  },

  typeCard: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 10,
  },

  activeType: {
    backgroundColor: PRIMARY,
  },

  planBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff3e6",
    borderRadius: 10,
  },

  planTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  radio: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 10,
  },

  activeRadio: {
    backgroundColor: PRIMARY,
  },

  submit: {
    margin: 16,
    padding: 14,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: "center",
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