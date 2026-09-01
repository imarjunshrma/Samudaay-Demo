// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [privacy, setPrivacy] = useState(true);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.icon}>←</Text>
        <Text style={styles.title}>Create Matrimony Profile</Text>
      </View>

      <ScrollView>

        {/* PHOTO UPLOAD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>

          <ScrollView horizontal>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <TouchableOpacity key={i} style={styles.photoBox}>
                {i === 0 ? (
                  <Image
                    source={{ uri: "https://picsum.photos/100" }}
                    style={styles.photo}
                  />
                ) : (
                  <Text style={styles.add}>＋</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PERSONAL */}
        <Section title="Personal Details">
          <Input label="Full Name" />
          
          <Row>
            <Input label="DOB" />
            <Input label="Gender" />
          </Row>

          <Row>
            <Input label="Height" />
            <Input label="Religion / Caste" />
          </Row>
        </Section>

        {/* PROFESSIONAL */}
        <Section title="Professional & Education">
          <Input label="Education" />
          <Input label="Occupation" />
          <Input label="Income" />
        </Section>

        {/* LOCATION */}
        <Section title="Location">
          <Row>
            <Input label="City" />
            <Input label="State" />
          </Row>
        </Section>

        {/* BIO */}
        <Section title="About Me">
          <TextInput
            placeholder="Write about yourself..."
            multiline
            style={[styles.input, { height: 100 }]}
          />
        </Section>

        {/* PRIVACY */}
        <View style={styles.privacyBox}>
          <View>
            <Text style={styles.privacyTitle}>Contact Privacy</Text>
            <Text style={styles.privacyDesc}>
              Hide contact until approval
            </Text>
          </View>

          <Switch value={privacy} onValueChange={setPrivacy} />
        </View>

      </ScrollView>

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Reusable Components */
function Input({ label, ...props }) {
  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }) {
  return (
    <View style={styles.row}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    padding: 16,
  },

  icon: { fontSize: 18 },

  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: PRIMARY,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  input: {
    marginTop: 5,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  add: {
    fontSize: 24,
    color: "#999",
  },

  privacyBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff3e6",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  privacyTitle: { fontWeight: "bold" },

  privacyDesc: {
    fontSize: 12,
    color: "#777",
  },

  footer: {
    padding: 16,
  },

  submit: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});