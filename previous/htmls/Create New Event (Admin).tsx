import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateEventScreen() {
  return (
    <View className="flex-1 bg-background-light">
      {/* Header */}
      <View className="p-4 flex-row items-center border-b border-primary/10">
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <MaterialIcons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text className="text-xl font-bold ml-2">Create New Event</Text>
      </View>

      <ScrollView className="px-4 pt-4">
        {/* STEP 1 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center border-b border-primary/20 pb-2 mb-4">
            <View className="flex-row items-center gap-2">
              <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-sm">1</Text>
              </View>
              <Text className="text-lg font-bold">Basic Info</Text>
            </View>
            <Text className="text-xs text-primary">Step 1 of 4</Text>
          </View>

          <Text className="text-sm font-semibold mb-1.5">Event Title</Text>
          <TextInput
            placeholder="e.g. Annual Cobbler Meetup 2024"
            className="h-12 px-4 rounded-lg border border-primary/20 bg-white mb-4"
          />

          <Text className="text-sm font-semibold mb-1.5">Description</Text>
          <TextInput
            multiline
            placeholder="Describe the purpose and highlights of the event..."
            className="p-4 rounded-lg border border-primary/20 bg-white h-32 mb-4"
          />

          <Text className="text-sm font-semibold mb-1.5">Event Type</Text>
          <TextInput
            placeholder="Free Event"
            className="h-12 px-4 rounded-lg border border-primary/20 bg-white"
          />
        </View>

        {/* STEP 2 */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 border-b border-primary/20 pb-2 mb-4">
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-sm">2</Text>
            </View>
            <Text className="text-lg font-bold">Date & Time</Text>
          </View>

          <Text className="text-sm font-semibold mb-1.5">Date</Text>
          <TextInput className="h-12 px-4 rounded-lg border border-primary/20 bg-white mb-4" />

          <Text className="text-sm font-semibold mb-1.5">Start Time</Text>
          <TextInput className="h-12 px-4 rounded-lg border border-primary/20 bg-white mb-4" />

          <Text className="text-sm font-semibold mb-1.5">End Time</Text>
          <TextInput className="h-12 px-4 rounded-lg border border-primary/20 bg-white" />
        </View>

        {/* STEP 3 */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 border-b border-primary/20 pb-2 mb-4">
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-sm">3</Text>
            </View>
            <Text className="text-lg font-bold">Location</Text>
          </View>

          <Text className="text-sm font-semibold mb-1.5">Venue Name</Text>
          <TextInput className="h-12 px-4 rounded-lg border border-primary/20 bg-white mb-4" />

          <Text className="text-sm font-semibold mb-1.5">Address</Text>
          <TextInput
            multiline
            className="p-4 rounded-lg border border-primary/20 bg-white h-24 mb-4"
          />

          <View className="h-40 rounded-xl overflow-hidden relative border border-primary/10">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBh9Jb7hPcMvVqjwHNL2YeVBA2CwoLhLjNnthZHoudqN5mgfNGNVxi4F_wURiTUwgAxMMtnjvk2asny--M8Vuca-TCuXwzx6OSQe3CYeA_3Z35y43M5sd61tRHnj7zfQ-HcIds9khmfwcJgXeSSYLj3e2yCGsDElGepz6dYnYWvTdZ7OckqzqRZLEta752fEiWHawagj_RdcW0VJ46yN2UvOEAB5aNa8iFNEdci2fc-Iv9Vqgm0JUBnpHg-561SIxgvowinJsamEsh",
              }}
              className="w-full h-full"
            />

            <View className="absolute inset-0 items-center justify-center">
              <View className="bg-white px-3 py-2 rounded-lg flex-row items-center gap-2 border border-primary/20">
                <MaterialIcons name="location-on" size={16} color="#f2780d" />
                <Text className="text-xs font-medium">Verify on Map</Text>
              </View>
            </View>
          </View>
        </View>

        {/* STEP 4 */}
        <View className="mb-32">
          <View className="flex-row items-center gap-2 border-b border-primary/20 pb-2 mb-4">
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-sm">4</Text>
            </View>
            <Text className="text-lg font-bold">Event Add-ons</Text>
          </View>

          {/* Card 1 */}
          <View className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <TextInput
                value="Lunch Buffet"
                className="font-semibold flex-1"
              />
              <MaterialIcons name="delete" size={18} color="red" />
            </View>

            <View className="flex-row gap-3">
              <TextInput
                value="450"
                className="flex-1 h-10 px-3 rounded-lg border border-primary/10 bg-white text-sm"
              />
              <TextInput
                value="100"
                className="flex-1 h-10 px-3 rounded-lg border border-primary/10 bg-white text-sm"
              />
            </View>
          </View>

          {/* Card 2 */}
          <View className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <TextInput value="Gift Pack" className="font-semibold flex-1" />
              <MaterialIcons name="delete" size={18} color="red" />
            </View>

            <View className="flex-row gap-3">
              <TextInput
                value="200"
                className="flex-1 h-10 px-3 rounded-lg border border-primary/10 bg-white text-sm"
              />
              <TextInput
                value="50"
                className="flex-1 h-10 px-3 rounded-lg border border-primary/10 bg-white text-sm"
              />
            </View>
          </View>

          <TouchableOpacity className="py-4 border-2 border-dashed border-primary/30 rounded-xl items-center">
            <Text className="text-primary font-semibold">
              Add Another Option
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-light border-t border-primary/10 flex-row gap-4">
        <TouchableOpacity className="flex-1 h-12 rounded-xl border border-primary/20 items-center justify-center">
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-[2] h-12 rounded-xl bg-primary items-center justify-center">
          <Text className="text-white font-bold">Create Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
