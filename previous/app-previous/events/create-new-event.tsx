// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  const [step, setStep] = useState(1);

  const [addons, setAddons] = useState([
    { name: "Lunch Buffet", price: "450", qty: "100" },
    { name: "Gift Pack", price: "200", qty: "50" },
  ]);

  const addAddon = () => {
    setAddons([...addons, { name: "", price: "", qty: "" }]);
  };

  const updateAddon = (index, key, value) => {
    const updated = [...addons];
    updated[index][key] = value;
    setAddons(updated);
  };

  const removeAddon = (index) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text>←</Text>
        <Text style={styles.title}>Create Event</Text>
        <Text>📅</Text>
      </View>

      <ScrollView>

        {/* STEP NAV */}
        <View style={styles.stepBar}>
          {[1, 2, 3, 4].map((s) => (
            <TouchableOpacity key={s} onPress={() => setStep(s)}>
              <Text
                style={[
                  styles.step,
                  step === s && styles.activeStep,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* STEP 1 */}
        {step === 1 && (
          <Section title="Basic Info">
            <Input label="Event Title" />
            <Input label="Description" multiline />
            <Input label="Event Type (Free/Paid)" />
          </Section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Section title="Date & Time">
            <Input label="Date" />
            <Input label="Start Time" />
            <Input label="End Time" />
          </Section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Section title="Location">
            <Input label="Venue Name" />
            <Input label="Address" multiline />
          </Section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <Section title="Event Add-ons">

            {addons.map((item, i) => (
              <View key={i} style={styles.addonCard}>
                
                <TextInput
                  value={item.name}
                  placeholder="Addon Name"
                  onChangeText={(v) =>
                    updateAddon(i, "name", v)
                  }
                  style={styles.input}
                />

                <View style={styles.row}>
                  <TextInput
                    value={item.price}
                    placeholder="Price"
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      updateAddon(i, "price", v)
                    }
                    style={[styles.input, { flex: 1 }]}
                  />

                  <TextInput
                    value={item.qty}
                    placeholder="Qty"
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      updateAddon(i, "qty", v)
                    }
                    style={[styles.input, { flex: 1 }]}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => removeAddon(i)}
                >
                  <Text style={{ color: "red" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={addAddon}
              style={styles.addBtn}
            >
              <Text>Add Add-on</Text>
            </TouchableOpacity>

          </Section>
        )}

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submit}>
          <Text style={{ color: "#fff" }}>
            Create Event
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
  container: { flex: 1, backgroundColor: "#f8f7f5" },

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

  step: { color: "#777" },

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

  label: { fontSize: 12, color: "#777" },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  addonCard: {
    backgroundColor: "#fff3e6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  addBtn: {
    padding: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 8,
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