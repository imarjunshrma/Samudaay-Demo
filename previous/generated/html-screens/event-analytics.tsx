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

export default function EventAnalyticsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 justify-between absolute top-0 z-10">
          <View className="flex items-center gap-3">
            <View className="bg-primary text-white p-2 rounded-lg">
              <MaterialIcons className="" name={"analytics" as MaterialIconName} />
            </View>
            <View>
              <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                {" Indian Cobbler Community "}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {" Event Analytics Dashboard "}
              </Text>
            </View>
          </View>
          <View className="flex items-center gap-2">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"notifications" as MaterialIconName} />
            </TouchableOpacity>
            <View className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-primary">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE49vrUtVcuQYl6dtRMrCA1oCXmGBesR5ErTNvksejFyeD4fgU5cOI8ubgt79K0YDhDVewsTAoBQ-jEI79SVoPxBkH1MJnD5Hp5PnYZaI-8Y6fnNoadzo4PcM0spDqKsbqe1YOUmIptSNFI_1rw17cBwOpcb1MPWvU0LnfhxzusXspyebKccQFdbapguO6hGxF-PnAI4CQs-bc3OMvSm9NlLKrZSn29x7bk5LwScU7K1yR13QM7OpDp8N3WRzb__p7-ggpseQX-qTo" }} accessibilityLabel="Admin profile picture of a community manager" />
            </View>
          </View>
        </View>
        <View className="bg-background-light dark:bg-background-dark">
          <View className="flex border-b border-primary/10 px-4 gap-8">
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-3 pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Overview"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Registrations"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Catering"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-4 space-y-6 mb-20">
          <View className="flex md:grid-cols-3 gap-4 flex-col">
            <View className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
              <View className="flex justify-between items-start">
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {" Total Event Registrations "}
                </Text>
                <MaterialIcons className="text-primary" name={"group" as MaterialIconName} />
              </View>
              <Text className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                {" 4,821 "}
              </Text>
              <View className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                <MaterialIcons className="text-sm" name={"trending_up" as MaterialIconName} />
                <Text>
                  {"+14.2% from last month"}
                </Text>
              </View>
            </View>
            <View className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
              <View className="flex justify-between items-start">
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {" Average Attendance Rate "}
                </Text>
                <MaterialIcons className="text-primary" name={"how_to_reg" as MaterialIconName} />
              </View>
              <Text className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                {" 87.4% "}
              </Text>
              <View className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                <View className="bg-primary h-full rounded-full w-[87%]" />
              </View>
            </View>
            <View className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
              <View className="flex justify-between items-start">
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {" Active Workshops "}
                </Text>
                <MaterialIcons className="text-primary" name={"handyman" as MaterialIconName} />
              </View>
              <Text className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                {" 24 "}
              </Text>
              <View className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                <Text>
                  {"Across 8 major cities"}
                </Text>
              </View>
            </View>
          </View>
          <View className="rounded-xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
            <View className="flex items-center justify-between mb-6">
              <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                {" Catering Requirements (Weekly) "}
              </Text>
              <TouchableOpacity className="text-primary text-sm font-bold flex items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" View Details "}</Text>
                <MaterialIcons className="text-sm" name={"arrow_forward" as MaterialIconName} />
              </TouchableOpacity>
            </View>
            <View className="space-y-6">
              <View>
                <View className="flex justify-between items-center mb-2">
                  <View className="flex items-center gap-2">
                    <MaterialIcons className="text-orange-500" name={"restaurant" as MaterialIconName} />
                    <Text className="font-semibold text-slate-700 dark:text-slate-200">
                      {"Total Lunch Count"}
                    </Text>
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold">
                    {"1,240 / 1,500"}
                  </Text>
                </View>
                <View className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <View className="bg-primary h-full rounded-full w-[82%]" />
                </View>
              </View>
              <View>
                <View className="flex justify-between items-center mb-2">
                  <View className="flex items-center gap-2">
                    <MaterialIcons className="text-blue-500" name={"dark_mode" as MaterialIconName} />
                    <Text className="font-semibold text-slate-700 dark:text-slate-200">
                      {"Total Dinner Count"}
                    </Text>
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold">
                    {"850 / 1,000"}
                  </Text>
                </View>
                <View className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <View className="bg-blue-500 h-full rounded-full w-[85%]" />
                </View>
              </View>
              <View className="flex gap-4 pt-2 flex-col md:flex-row md:flex-wrap">
                <View className="p-4 bg-primary/5 rounded-lg border border-primary/10 w-full md:w-[48%]">
                  <Text className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {" Vegetarian "}
                  </Text>
                  <Text className="text-xl font-bold text-primary">
                    {"82%"}
                  </Text>
                </View>
                <View className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 w-full md:w-[48%]">
                  <Text className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    {" Non-Vegetarian "}
                  </Text>
                  <Text className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    {" 18% "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
            <View className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {" Recent Events Status "}
              </Text>
              <MaterialIcons className="text-slate-400" name={"filter_list" as MaterialIconName} />
            </View>
            <View className="divide-y divide-slate-100 dark:divide-slate-700">
              <View className="p-4 flex items-center justify-between">
                <View className="flex items-center gap-3">
                  <View className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MaterialIcons className="" name={"foot_bones" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-slate-800 dark:text-slate-100">
                      {" Dharavi Artisan Meet "}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {"Mumbai • Oct 24, 2023"}
                    </Text>
                  </View>
                </View>
                <View className="text-right">
                  <Text className="font-bold text-slate-800 dark:text-slate-100">
                    {" 450 Registrations "}
                  </Text>
                  <Text className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                    {"Completed"}
                  </Text>
                </View>
              </View>
              <View className="p-4 flex items-center justify-between">
                <View className="flex items-center gap-3">
                  <View className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MaterialIcons className="" name={"precision_manufacturing" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="font-bold text-slate-800 dark:text-slate-100">
                      {" Modern Tooling Workshop "}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {"Agra • Oct 28, 2023"}
                    </Text>
                  </View>
                </View>
                <View className="text-right">
                  <Text className="font-bold text-slate-800 dark:text-slate-100">
                    {" 120 Registrations "}
                  </Text>
                  <Text className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                    {"Upcoming"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 z-50">
          <View className="flex gap-2 border-t border-primary/10 bg-white dark:bg-background-dark px-4 pb-4 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="fill-1" name={"dashboard" as MaterialIconName} />
              </View>
              <Text className="text-xs font-bold leading-normal tracking-[0.015em]">
                {" Dashboard "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
              </View>
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Events "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"group" as MaterialIconName} />
              </View>
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Members "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"settings" as MaterialIconName} />
              </View>
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Settings "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
