import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const PRIMARY = "#f2780d";

export default function App() {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.title}>Indian Cobbler Community</Text>
        <Text style={styles.icon}>🔔</Text>
      </View>

      <ScrollView>

        {/* STORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyRow}>
          {["Spotlight", "Tools", "Techniques", "Leather", "Meetup"].map((item, i) => (
            <View key={i} style={styles.story}>
              <Image
                source={{
                  uri: "https://picsum.photos/100?random=" + i,
                }}
                style={styles.storyImg}
              />
              <Text style={styles.storyText}>{item}</Text>
            </View>
          ))}
        </ScrollView>

        {/* MONTHLY PUBLICATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Publication</Text>

          <View style={styles.publication}>
            <Image
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.pubImg}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.pubTag}>
                Issue #42 • October 2023
              </Text>

              <Text style={styles.pubTitle}>
                The Future of Sustainable Soling
              </Text>

              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={{ color: "#fff" }}>
                  Download PDF
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* EVENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2].map((_, i) => (
              <View key={i} style={styles.eventCard}>
                
                <Image
                  source={{ uri: "https://picsum.photos/300?random=" + i }}
                  style={styles.eventImg}
                />

                <Text style={styles.eventTitle}>
                  Event {i + 1}
                </Text>

                <Text style={styles.eventLoc}>
                  Delhi / Mumbai
                </Text>

                <TouchableOpacity style={styles.eventBtn}>
                  <Text style={{ color: PRIMARY }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* NEWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community News</Text>

          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.newsRow}>
              
              <Image
                source={{ uri: "https://picsum.photos/100?random=" + i }}
                style={styles.newsImg}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.newsTitle}>
                  News headline {i + 1}
                </Text>

                <Text style={styles.newsDesc}>
                  Short description of news...
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.loadBtn}>
            <Text>Load More</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {["Home", "Events", "Forum", "Directory", "Profile"].map((item) => (
          <Text
            key={item}
            style={[
              styles.navItem,
              item === "Home" && styles.activeNav,
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
  container: { flex: 1, backgroundColor: "#f8f7f5" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  icon: { fontSize: 18 },

  title: { fontWeight: "bold", fontSize: 16 },

  storyRow: {
    paddingHorizontal: 10,
  },

  story: {
    alignItems: "center",
    marginRight: 12,
  },

  storyImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  storyText: {
    fontSize: 10,
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  publication: {
    flexDirection: "row",
    backgroundColor: "#fff3e6",
    padding: 10,
    borderRadius: 10,
  },

  pubImg: {
    width: 80,
    height: 100,
    marginRight: 10,
  },

  pubTag: {
    fontSize: 10,
    color: PRIMARY,
  },

  pubTitle: {
    fontWeight: "bold",
  },

  downloadBtn: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    padding: 6,
    borderRadius: 6,
  },

  eventCard: {
    width: 200,
    marginRight: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  eventImg: {
    width: "100%",
    height: 100,
    borderRadius: 6,
  },

  eventTitle: {
    fontWeight: "bold",
    marginTop: 6,
  },

  eventLoc: {
    fontSize: 12,
    color: "#777",
  },

  eventBtn: {
    marginTop: 6,
    backgroundColor: "#fff3e6",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
  },

  newsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  newsImg: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 10,
  },

  newsTitle: {
    fontWeight: "bold",
  },

  newsDesc: {
    fontSize: 12,
    color: "#777",
  },

  loadBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
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