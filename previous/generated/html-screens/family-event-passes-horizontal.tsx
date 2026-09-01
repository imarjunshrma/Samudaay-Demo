// @ts-nocheck
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

cssInterop(MaterialIcons, {
  className: {
    target: 'style',
  },
});

export default function FamilyEventPassesHorizontalScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
    <View className="flex items-center px-4 py-4 justify-between border-b border-primary/10 bg-white/80 dark:bg-slate-900/80 absolute top-0 z-20">
      <View className="flex size-10 items-center justify-center rounded-full">
        <MaterialIcons className="text-slate-700 dark:text-slate-300" name={"arrow_back" as MaterialIconName} />
      </View>
      <Text className="text-lg font-bold tracking-tight">
        {"Family Event Passes"}
      </Text>
      <View className="size-10" />
    </View>
    <View className="absolute bottom-0 w-full border-t border-primary/10 bg-white dark:bg-slate-900 px-4 pb-6 pt-2 z-20">
      <View className="flex gap-2 max-w-lg mx-auto">
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"home" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal">
            {"Home"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal">
            {"Schedule"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"confirmation_number" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal">
            {"Pass"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"person" as MaterialIconName} />
          <Text className="text-[10px] font-medium leading-normal">
            {"Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex-1 overflow-x-hidden py-8 flex flex-col items-center">
        <View className="w-full flex flex-col items-center">
          <View className="w-full overflow-x-auto snap-x snap-mandatory flex gap-6 px-6 pb-4 hide-scrollbar">
            <View className="min-w-full snap-center flex justify-center">
              <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-primary/10">
                <View className="p-8 flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent">
                  <View className="w-full aspect-square max-w-[240px] bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <Image className="w-full h-full" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDhECAUB7AhCKz1tCrwNmPLX7NleJ3NGLV4mRCji6JEkot8L0Qw5yWIM0Q27XwUwloot8kMEvBzE7rwzNTMW0rNGRrGW5FhrdL9JNuK4LNC2Gir5DCGQIqIXU5Co5XRs8aU5ntswx6WOO7lddlxwVjEFZLfrJw2x0oima_LaEQh5f1QFnhVSPVoVUI2iEbVAEP_-sH8bzp7078PgaK91EuBkWLUu2Ekjz7K-bceWDQd_4rFv6mTqry2mSIcLR8CMcdUBZSogeSse5" }} accessibilityLabel="QR Code for Rajesh Kumar" />
                  </View>
                  <Text className="mt-4 text-sm font-medium text-primary uppercase tracking-widest text-center">
                    {" Scan at Entrance "}
                  </Text>
                </View>
                <View className="px-6 pb-6 text-center">
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                    {" Rajesh Kumar "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {" Global Tech Summit 2024 "}
                  </Text>
                  <View className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700 relative">
                    <View className="absolute -left-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-r border-primary/10" />
                    <View className="absolute -right-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-l border-primary/10" />
                  </View>
                  <View className="space-y-3 text-left">
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      {" Registered Add-ons "}
                    </Text>
                    <View className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10">
                      <MaterialIcons className="text-primary text-xl" name={"restaurant" as MaterialIconName} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {" Lunch Buffet "}
                        </Text>
                        <Text className="text-xs text-primary font-medium">
                          {"Included"}
                        </Text>
                      </View>
                      <MaterialIcons className="text-green-500 text-lg" name={"check_circle" as MaterialIconName} />
                    </View>
                    <View className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10">
                      <MaterialIcons className="text-primary text-xl" name={"groups" as MaterialIconName} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {" Networking Dinner "}
                        </Text>
                        <Text className="text-xs text-primary font-medium">
                          {"Included"}
                        </Text>
                      </View>
                      <MaterialIcons className="text-green-500 text-lg" name={"check_circle" as MaterialIconName} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className="min-w-full snap-center flex justify-center">
              <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-primary/10">
                <View className="p-8 flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent">
                  <View className="w-full aspect-square max-w-[240px] bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <Image className="w-full h-full" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDhECAUB7AhCKz1tCrwNmPLX7NleJ3NGLV4mRCji6JEkot8L0Qw5yWIM0Q27XwUwloot8kMEvBzE7rwzNTMW0rNGRrGW5FhrdL9JNuK4LNC2Gir5DCGQIqIXU5Co5XRs8aU5ntswx6WOO7lddlxwVjEFZLfrJw2x0oima_LaEQh5f1QFnhVSPVoVUI2iEbVAEP_-sH8bzp7078PgaK91EuBkWLUu2Ekjz7K-bceWDQd_4rFv6mTqry2mSIcLR8CMcdUBZSogeSse5" }} accessibilityLabel="QR Code for Sunita Devi" />
                  </View>
                  <Text className="mt-4 text-sm font-medium text-primary uppercase tracking-widest text-center">
                    {" Scan at Entrance "}
                  </Text>
                </View>
                <View className="px-6 pb-6 text-center">
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                    {" Sunita Devi "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {" Global Tech Summit 2024 "}
                  </Text>
                  <View className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700 relative">
                    <View className="absolute -left-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-r border-primary/10" />
                    <View className="absolute -right-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-l border-primary/10" />
                  </View>
                  <View className="space-y-3 text-left">
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      {" Registered Add-ons "}
                    </Text>
                    <View className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10">
                      <MaterialIcons className="text-primary text-xl" name={"restaurant" as MaterialIconName} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {" Lunch Buffet "}
                        </Text>
                        <Text className="text-xs text-primary font-medium">
                          {"Included"}
                        </Text>
                      </View>
                      <MaterialIcons className="text-green-500 text-lg" name={"check_circle" as MaterialIconName} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className="min-w-full snap-center flex justify-center">
              <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-primary/10">
                <View className="p-8 flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent">
                  <View className="w-full aspect-square max-w-[240px] bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <Image className="w-full h-full" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDhECAUB7AhCKz1tCrwNmPLX7NleJ3NGLV4mRCji6JEkot8L0Qw5yWIM0Q27XwUwloot8kMEvBzE7rwzNTMW0rNGRrGW5FhrdL9JNuK4LNC2Gir5DCGQIqIXU5Co5XRs8aU5ntswx6WOO7lddlxwVjEFZLfrJw2x0oima_LaEQh5f1QFnhVSPVoVUI2iEbVAEP_-sH8bzp7078PgaK91EuBkWLUu2Ekjz7K-bceWDQd_4rFv6mTqry2mSIcLR8CMcdUBZSogeSse5" }} accessibilityLabel="QR Code for Anjali Kumar" />
                  </View>
                  <Text className="mt-4 text-sm font-medium text-primary uppercase tracking-widest text-center">
                    {" Scan at Entrance "}
                  </Text>
                </View>
                <View className="px-6 pb-6 text-center">
                  <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                    {" Anjali Kumar "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {" Global Tech Summit 2024 "}
                  </Text>
                  <View className="my-6 border-t border-dashed border-slate-200 dark:border-slate-700 relative">
                    <View className="absolute -left-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-r border-primary/10" />
                    <View className="absolute -right-9 -top-3 size-6 rounded-full bg-background-light dark:bg-background-dark border-l border-primary/10" />
                  </View>
                  <View className="space-y-3 text-left">
                    <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      {" Registered Add-ons "}
                    </Text>
                    <View className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10">
                      <MaterialIcons className="text-primary text-xl" name={"workspace_premium" as MaterialIconName} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {" Workshop Access "}
                        </Text>
                        <Text className="text-xs text-primary font-medium">
                          {"Included"}
                        </Text>
                      </View>
                      <MaterialIcons className="text-green-500 text-lg" name={"check_circle" as MaterialIconName} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="flex gap-2 mt-4">
            <View className="size-2 rounded-full bg-primary" />
            <View className="size-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <View className="size-2 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>
          <Text className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            {" Swipe for more passes "}
          </Text>
        </View>
        <View className="w-full max-w-sm px-6 mt-8">
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"download" as MaterialIconName} />
            <Text>{" Download Pass "}</Text>
          </TouchableOpacity>
          <Text className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center px-4">
            {" Please have the current pass ready on your device or printed for quick entry to the venue. "}
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
