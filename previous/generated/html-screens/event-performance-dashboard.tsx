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

export default function EventPerformanceDashboardScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl min-h-screen flex flex-col">
        <View className="flex items-center p-4 absolute top-0 bg-background-light/80 dark:bg-background-dark/80 z-10">
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"arrow_back" as MaterialIconName} />
          </TouchableOpacity>
          <View className="flex-1 ml-2">
            <Text className="text-xl font-bold leading-tight">
              {"Annual Artisans Meet"}
            </Text>
            <Text className="text-xs text-primary font-medium">
              {" Mumbai Chapter • Oct 2023 "}
            </Text>
          </View>
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"share" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 overflow-y-auto px-4 pb-24">
          <View className="mt-4">
            <Text className="text-lg font-bold mb-4">
              {"Financial Overview"}
            </Text>
            <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
              <View className="bg-primary/10 dark:bg-primary/20 p-5 rounded-xl border border-primary/20 w-full md:w-[48%]">
                <Text className="text-sm font-medium opacity-80">
                  {"Total Revenue"}
                </Text>
                <Text className="text-2xl font-bold mt-1">
                  {"₹45,200"}
                </Text>
                <View className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400">
                  <MaterialIcons className="text-sm" name={"trending_up" as MaterialIconName} />
                  <Text className="text-xs font-bold">
                    {"+12.5%"}
                  </Text>
                </View>
              </View>
              <View className="bg-primary/10 dark:bg-primary/20 p-5 rounded-xl border border-primary/20 w-full md:w-[48%]">
                <Text className="text-sm font-medium opacity-80">
                  {"Net Profit"}
                </Text>
                <Text className="text-2xl font-bold mt-1">
                  {"₹18,450"}
                </Text>
                <View className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400">
                  <MaterialIcons className="text-sm" name={"trending_up" as MaterialIconName} />
                  <Text className="text-xs font-bold">
                    {"+8.2%"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-8">
            <View className="flex justify-between items-end mb-4">
              <View>
                <Text className="text-lg font-bold">
                  {"Attendance Rate"}
                </Text>
                <Text className="text-sm opacity-60">
                  {"Actual vs. Registered"}
                </Text>
              </View>
              <View className="text-right">
                <Text className="text-2xl font-bold text-primary">
                  {"85%"}
                </Text>
              </View>
            </View>
            <View className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <View className="flex items-end justify-around h-32 gap-4 mb-2">
                <View className="flex flex-col items-center flex-1">
                  <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                    <View className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-sm">
                      <Text>{" 200 "}</Text>
                    </View>
                  </View>
                  <Text className="text-[10px] font-bold mt-2 uppercase tracking-wider opacity-60">
                    {"Registered"}
                  </Text>
                </View>
                <View className="flex flex-col items-center flex-1">
                  <View className="w-full bg-primary rounded-t-lg relative h-[85%]">
                    <View className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-sm text-primary">
                      <Text>{" 170 "}</Text>
                    </View>
                  </View>
                  <Text className="text-[10px] font-bold mt-2 uppercase tracking-wider opacity-60">
                    {"Attended"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-8">
            <Text className="text-lg font-bold mb-4">
              {"Add-on Usage"}
            </Text>
            <View className="space-y-4">
              <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex justify-between items-center mb-2">
                  <View className="flex items-center gap-2">
                    <MaterialIcons className="text-primary" name={"restaurant" as MaterialIconName} />
                    <Text className="font-semibold text-sm">
                      {"Lunches Served"}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold">
                    {"150 / 200"}
                  </Text>
                </View>
                <View className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <View className="bg-primary h-full rounded-full" />
                </View>
                <Text className="text-[10px] mt-2 opacity-50 font-medium">
                  {" 75% OF REGISTERED USERS "}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex justify-between items-center mb-2">
                  <View className="flex items-center gap-2">
                    <MaterialIcons className="text-primary" name={"tools_installation_kit" as MaterialIconName} />
                    <Text className="font-semibold text-sm">
                      {"Tool Kits Distributed"}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold">
                    {"165 / 170"}
                  </Text>
                </View>
                <View className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <View className="bg-primary h-full rounded-full" />
                </View>
                <Text className="text-[10px] mt-2 opacity-50 font-medium">
                  {" 97% OF ATTENDEES "}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <View className="flex justify-between items-center mb-2">
                  <View className="flex items-center gap-2">
                    <MaterialIcons className="text-primary" name={"workspace_premium" as MaterialIconName} />
                    <Text className="font-semibold text-sm">
                      {"Certificates Issued"}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold">
                    {"120 / 170"}
                  </Text>
                </View>
                <View className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <View className="bg-primary h-full rounded-full" />
                </View>
                <Text className="text-[10px] mt-2 opacity-50 font-medium">
                  {" CLAIMED BY ATTENDEES "}
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-8 mb-4">
            <TouchableOpacity className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"analytics" as MaterialIconName} />
              <Text>{" View Full Financial Report "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 px-6 z-20">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="fill-1" name={"dashboard" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-tighter">
              {"Dashboard"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-tighter">
              {"Events"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-tighter">
              {"Community"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"person" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-tighter">
              {"Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
