
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";

const PRIMARY = "#46291e";

export default function App() {
  const [step, setStep] = useState(1);
  const [subCommunity, setSubCommunity] = useState(true);
  const [users, setUsers] = useState("25");

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.title}>Client Onboarding</Text>
        <Text>?</Text>
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.stepBar}>
        {[1, 2, 3, 4].map((s) => (
          <TouchableOpacity key={s} onPress={() => setStep(s)}>
            <Text
              style={[
                styles.step,
                step === s && styles.activeStep,
              ]}
            >
              Step {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>

        {/* STEP 1 */}
        {step === 1 && (
          <Section title="Organization Details">
            <Input label="Organization Name" />
            <Input label="Domain (heirloom.artisan)" />
            <Input label="Contact Name" />
            <Input label="Admin Email" />
          </Section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Section title="Licensing & Seats">
            <Input label="License Type" />
            <Input
              label="Max Users"
              value={users}
              onChangeText={setUsers}
            />
          </Section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Section title="Feature Configuration">
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.label}>
                  Allow Sub-communities
                </Text>
                <Text style={styles.sub}>
                  Enable nested groups
                </Text>
              </View>

              <Switch
                value={subCommunity}
                onValueChange={setSubCommunity}
              />
            </View>
          </Section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <Section title="Brand & Identity">
            <View style={styles.logoBox}>
              <Text style={styles.upload}>Upload Logo</Text>
            </View>

            <Text style={styles.label}>Color Palette</Text>

            <View style={styles.paletteRow}>
              {["#46291e", "#964900", "#003733"].map((c, i) => (
                <View
                  key={i}
                  style={[styles.color, { backgroundColor: c }]}
                />
              ))}
            </View>
          </Section>
        )}

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancel}>
          <Text>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>
            Save & Launch
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 Components */
function Input({ label, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
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

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf9f6" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  title: { fontWeight: "bold" },

  stepBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },

  step: {
    fontSize: 12,
    color: "#777",
  },

  activeStep: {
    color: PRIMARY,
    fontWeight: "bold",
  },

  section: { padding: 16 },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: PRIMARY,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  sub: {
    fontSize: 11,
    color: "#999",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoBox: {
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },

  upload: {
    color: PRIMARY,
  },

  paletteRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  color: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },

  cancel: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  submit: {
    flex: 2,
    backgroundColor: PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});