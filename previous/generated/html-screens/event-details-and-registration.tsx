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

export default function EventDetailsAndRegistrationScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden max-w-2xl mx-auto pb-32">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 justify-between absolute top-0 z-20 border-b border-primary/10">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {" Event Details "}
          </Text>
          <View className="flex w-12 items-center justify-end">
            <TouchableOpacity className="flex items-center justify-center rounded-lg h-12 bg-transparent text-slate-900 dark:text-slate-100" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"share" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-4">
          <View className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-md overflow-hidden relative">
            <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <View className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
              <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
              <Text>{" Pragati Maidan "}</Text>
            </View>
          </View>
        </View>
        <View className="px-4 pt-4">
          <Text className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2">
            {"COMMUNITY EVENT"}
          </Text>
          <Text className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-extrabold leading-tight">
            {" Anand Medo, Vadodara "}
          </Text>
          <Text className="text-primary font-medium mt-1">
            {" Indian Cobbler Community "}
          </Text>
        </View>
        <View className="mt-6 px-4 space-y-4">
          <View className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
              <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
            </View>
            <View className="flex flex-col justify-center">
              <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">
                {" October 15, 2024 "}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal">
                {" Sunday, 10:00 AM - 08:00 PM "}
              </Text>
            </View>
          </View>
          <View className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
              <MaterialIcons className="" name={"map" as MaterialIconName} />
            </View>
            <View className="flex flex-col justify-center">
              <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">
                {" Pragati Maidan, Hall 7 "}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal">
                {" Mathura Rd, New Delhi, Delhi 110001 "}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 py-8">
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-3">
            {" About this Event "}
          </Text>
          <Text className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {" Join us for the largest gathering of the Indian Cobbler Community. This national meetup aims to bring together artisans, suppliers, and tech innovators from across the country. We will discuss modern techniques, sustainable materials, and the future of traditional footwear craftsmanship in India. Don't miss this opportunity to network with fellow professionals and showcase your work. "}
          </Text>
        </View>
        <View className="px-4 py-4 bg-primary/5 rounded-2xl mx-4 border border-primary/10">
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-4 flex items-center gap-2">
            <MaterialIcons className="text-primary" name={"add_circle" as MaterialIconName} />
            {" Select Add-ons "}
          </Text>
          <View className="space-y-3">
            <View className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <View className="flex items-center gap-3">
                <TextInput className="w-5 h-5 rounded border-slate-300 text-primary" />
                <View className="flex flex-col">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {"Lunch Buffet"}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {"₹200 per person"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" - "}</Text>
                </TouchableOpacity>
                <Text className="w-4 text-center font-bold">
                  {"1"}
                </Text>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" + "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <View className="flex items-center gap-3">
                <TextInput className="w-5 h-5 rounded border-slate-300 text-primary" />
                <View className="flex flex-col">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {"Networking Dinner"}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {"₹350 per person"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" - "}</Text>
                </TouchableOpacity>
                <Text className="w-4 text-center font-bold">
                  {"1"}
                </Text>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" + "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <View className="flex items-center gap-3">
                <TextInput className="w-5 h-5 rounded border-slate-300 text-primary" />
                <View className="flex flex-col">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {"Artisan Gift Pack"}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {"₹150 each"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" - "}</Text>
                </TouchableOpacity>
                <Text className="w-4 text-center font-bold">
                  {"1"}
                </Text>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" + "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-4 z-50 shadow-2xl">
          <View className="max-w-2xl mx-auto flex items-center justify-between">
            <View className="flex flex-col">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {" Total Amount "}
              </Text>
              <Text className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold">
                {" ₹700 "}
              </Text>
            </View>
            <TouchableOpacity className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
              <Text>
                {"Pay & Register"}
              </Text>
              <MaterialIcons className="" name={"chevron_right" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
