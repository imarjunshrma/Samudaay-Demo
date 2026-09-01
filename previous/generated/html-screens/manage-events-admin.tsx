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

export default function ManageEventsAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-4 border-b border-primary/10 absolute top-0 z-10">
          <View className="flex items-center gap-3">
            <MaterialIcons className="text-primary text-3xl" name={"event_available" as MaterialIconName} />
            <Text className="text-xl font-bold tracking-tight">
              {"Manage Events"}
            </Text>
          </View>
          <TouchableOpacity className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"add" as MaterialIconName} />
            <Text className="hidden sm:inline">
              {"Create Event"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 p-4 max-w-5xl mx-auto w-full">
          <View className="mb-6 space-y-4">
            <View className="flex flex-col sm:flex-row gap-3">
              <View className="relative flex-1">
                <MaterialIcons className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" name={"search" as MaterialIconName} />
                <TextInput className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 outline-none" placeholder="Search events by name or location..." />
              </View>
              <View className="flex gap-2">
                <TouchableOpacity className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-primary" name={"filter_list" as MaterialIconName} />
                  <Text className="font-medium">
                    {"Filters"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <TouchableOpacity className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" All Events "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Upcoming "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Past Events "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Drafts "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex gap-4">
            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <View className="flex items-start gap-4">
                <View className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <MaterialIcons className="text-2xl" name={"eco" as MaterialIconName} />
                </View>
                <View>
                  <View className="flex items-center gap-2 mb-1">
                    <Text className="font-bold text-lg">
                      {"Community Garden Planting"}
                    </Text>
                    <Text className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {"Upcoming"}
                    </Text>
                  </View>
                  <View className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"calendar_month" as MaterialIconName} />
                      {"Oct 12, 2023"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"schedule" as MaterialIconName} />
                      {"10:00 AM"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                      {"Green Park, West Side"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 border border-primary/20 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{"Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-red-500 dark:hover:bg-red-900/20 font-semibold flex items-center justify-center gap-2 border border-red-200 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{"Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <View className="flex items-start gap-4">
                <View className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <MaterialIcons className="text-2xl" name={"local_library" as MaterialIconName} />
                </View>
                <View>
                  <View className="flex items-center gap-2 mb-1">
                    <Text className="font-bold text-lg">
                      {"Neighborhood Book Club"}
                    </Text>
                    <Text className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {"Upcoming"}
                    </Text>
                  </View>
                  <View className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"calendar_month" as MaterialIconName} />
                      {"Oct 15, 2023"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"schedule" as MaterialIconName} />
                      {"06:30 PM"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                      {"Central Library"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 border border-primary/20 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{"Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-red-500 dark:hover:bg-red-900/20 font-semibold flex items-center justify-center gap-2 border border-red-200 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{"Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75">
              <View className="flex items-start gap-4">
                <View className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-slate-500 shrink-0">
                  <MaterialIcons className="text-2xl" name={"sports_soccer" as MaterialIconName} />
                </View>
                <View>
                  <View className="flex items-center gap-2 mb-1">
                    <Text className="font-bold text-lg">
                      {"Youth Soccer Finals"}
                    </Text>
                    <Text className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      {"Past"}
                    </Text>
                  </View>
                  <View className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"calendar_month" as MaterialIconName} />
                      {"Sep 30, 2023"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"schedule" as MaterialIconName} />
                      {"09:00 AM"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                      {"Metro Sports Complex"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 border border-primary/20 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{"Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-red-500 dark:hover:bg-red-900/20 font-semibold flex items-center justify-center gap-2 border border-red-200 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{"Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <View className="flex items-start gap-4">
                <View className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <MaterialIcons className="text-2xl" name={"theater_comedy" as MaterialIconName} />
                </View>
                <View>
                  <View className="flex items-center gap-2 mb-1">
                    <Text className="font-bold text-lg">
                      {"Summer Night Improv"}
                    </Text>
                    <Text className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {"Upcoming"}
                    </Text>
                  </View>
                  <View className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"calendar_month" as MaterialIconName} />
                      {"Oct 20, 2023"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"schedule" as MaterialIconName} />
                      {"08:00 PM"}
                    </Text>
                    <Text className="flex items-center gap-1">
                      <MaterialIcons className="text-sm" name={"location_on" as MaterialIconName} />
                      {"The Laugh Barn"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-primary font-semibold flex items-center justify-center gap-2 border border-primary/20 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"edit" as MaterialIconName} />
                  <Text>{"Edit "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 md:flex-none px-4 py-2 rounded-lg text-red-500 dark:hover:bg-red-900/20 font-semibold flex items-center justify-center gap-2 border border-red-200 md:border-transparent" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-lg" name={"delete" as MaterialIconName} />
                  <Text>{"Delete "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="mt-8 mb-20 flex justify-center">
            <View className="flex items-center gap-1">
              <TouchableOpacity className="p-2 rounded-lg text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"chevron_left" as MaterialIconName} />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-lg bg-primary text-white font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" 1 "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-lg font-medium" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" 2 "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-lg font-medium" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" 3 "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-2 rounded-lg text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="" name={"chevron_right" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-primary/10 px-4 py-2 flex justify-around items-center sm:hidden z-20">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Admin"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"event" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Events"}
            </Text>
          </TouchableOpacity>
          <View className="relative -top-6">
            <TouchableOpacity className="bg-primary text-white w-12 h-12 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"add" as MaterialIconName} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Users"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Settings"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="hidden sm:flex absolute bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full shadow-xl shadow-primary/30 items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}
