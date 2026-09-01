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

export default function MyEventsListScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="absolute top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10">
          <View className="flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="ml-2 text-xl font-bold leading-tight tracking-tight">
            {" My Events "}
          </Text>
        </View>
        <View className="absolute top-[73px] z-10 bg-background-light dark:bg-background-dark">
          <View className="flex border-b border-primary/10 px-4">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center border-b-2 border-primary pb-3 pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold text-primary">
                {"Upcoming"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center border-b-2 border-transparent pb-3 pt-4 opacity-60" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold">
                {"Past"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 p-4 pb-24">
          <View className="mb-6">
            <Text className="text-lg font-bold mb-4">
              {"This Month"}
            </Text>
            <View className="mb-4 flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/50 p-4 shadow-sm border border-primary/5">
              <View className="flex items-start justify-between gap-4">
                <View className="flex flex-col gap-1 flex-1">
                  <Text className="text-base font-bold">
                    {"Annual Cobbler Meetup 2024"}
                  </Text>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"calendar_today" as MaterialIconName} />
                    <Text>
                      {"Oct 25, 2024"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                    <Text>
                      {"Pragati Maidan, Delhi"}
                    </Text>
                  </View>
                </View>
                <View className="h-20 w-28 shrink-0 bg-center bg-cover rounded-lg" />
              </View>
              <View className="flex gap-2 mt-2">
                <TouchableOpacity className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"confirmation_number" as MaterialIconName} />
                  <Text>{" View Pass "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="mb-4 flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/50 p-4 shadow-sm border border-primary/5">
              <View className="flex items-start justify-between gap-4">
                <View className="flex flex-col gap-1 flex-1">
                  <Text className="text-base font-bold">
                    {"Leather Craft Workshop"}
                  </Text>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"calendar_today" as MaterialIconName} />
                    <Text>
                      {"Oct 28, 2024"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                    <Text>
                      {"Dharavi, Mumbai"}
                    </Text>
                  </View>
                </View>
                <View className="h-20 w-28 shrink-0 bg-center bg-cover rounded-lg" />
              </View>
              <View className="flex gap-2 mt-2">
                <TouchableOpacity className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"confirmation_number" as MaterialIconName} />
                  <Text>{" View Pass "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-lg font-bold mb-4 opacity-60">
              {"Next Month"}
            </Text>
            <View className="mb-4 flex flex-col gap-4 rounded-xl bg-white/60 dark:bg-slate-800/30 p-4 border border-primary/5">
              <View className="flex items-start justify-between gap-4">
                <View className="flex flex-col gap-1 flex-1">
                  <Text className="text-base font-bold">
                    {"Sustainable Footwear Expo"}
                  </Text>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"calendar_today" as MaterialIconName} />
                    <Text>
                      {"Nov 12, 2024"}
                    </Text>
                  </View>
                  <View className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                    <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                    <Text>
                      {"Whitefield, Bengaluru"}
                    </Text>
                  </View>
                </View>
                <View className="h-20 w-28 shrink-0 bg-center bg-cover rounded-lg" />
              </View>
              <View className="flex gap-2 mt-2">
                <TouchableOpacity className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/20 px-4 py-2 text-sm font-bold text-primary" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"confirmation_number" as MaterialIconName} />
                  <Text>{" View Pass "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 z-20 flex border-t border-primary/10 bg-background-light/95 dark:bg-background-dark/95 px-4 pb-6 pt-2">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"home" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"calendar_month" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"My Events"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Community"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"account_circle" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
