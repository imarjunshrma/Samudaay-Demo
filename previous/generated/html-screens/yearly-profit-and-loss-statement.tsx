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

export default function YearlyProfitAndLossStatementScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between absolute top-0 z-10 border-b border-primary/10">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1">
            {" Yearly P&L Statement "}
          </Text>
          <View className="flex gap-2 items-center justify-end">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"ios_share" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary text-white" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"download" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
          <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary px-4 text-white" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-semibold">
              {"FY 2023-24"}
            </Text>
            <MaterialIcons className="text-sm" name={"keyboard_arrow_down" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary/10 px-4 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-medium">
              {"FY 2022-23"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary/10 px-4 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-medium">
              {"FY 2021-22"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary/10 px-4 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-medium">
              {"All Time"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="p-4">
          <View className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-slate-800 overflow-hidden border border-primary/5">
            <View className="p-6 bg-gradient-to-br from-primary to-orange-600 text-white">
              <Text className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">
                {" Total Net Profit (FY 23-24) "}
              </Text>
              <View className="flex items-center justify-between">
                <Text className="text-3xl font-extrabold">
                  {"₹12,45,000"}
                </Text>
                <Text className="bg-white/20 px-2 py-1 rounded text-sm font-medium">
                  {"+12.4% vs LY"}
                </Text>
              </View>
            </View>
            <View className="flex items-center justify-around p-4 border-t border-primary/10 bg-orange-50 dark:bg-slate-900/50">
              <View className="text-center">
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Total Income "}
                </Text>
                <Text className="text-base font-bold text-green-600">
                  {"₹45.2L"}
                </Text>
              </View>
              <View className="h-8 w-px bg-primary/10" />
              <View className="text-center">
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Total Expenses "}
                </Text>
                <Text className="text-base font-bold text-red-500">
                  {"₹32.75L"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="px-4 py-2">
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
            <MaterialIcons className="text-primary" name={"trending_up" as MaterialIconName} />
            {" Income Breakdown "}
          </Text>
          <View className="flex gap-3 flex-col md:flex-row md:flex-wrap">
            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 w-full md:w-[48%]">
              <MaterialIcons className="text-primary mb-2" name={"volunteer_activism" as MaterialIconName} />
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                {"Donations"}
              </Text>
              <Text className="text-lg font-bold">
                {"₹18.4L"}
              </Text>
            </View>
            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 w-full md:w-[48%]">
              <MaterialIcons className="text-primary mb-2" name={"event_available" as MaterialIconName} />
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                {" Registrations "}
              </Text>
              <Text className="text-lg font-bold">
                {"₹12.2L"}
              </Text>
            </View>
            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 w-full md:w-[48%]">
              <MaterialIcons className="text-primary mb-2" name={"favorite" as MaterialIconName} />
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                {"Matrimony"}
              </Text>
              <Text className="text-lg font-bold">
                {"₹8.5L"}
              </Text>
            </View>
            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 w-full md:w-[48%]">
              <MaterialIcons className="text-primary mb-2" name={"ad_units" as MaterialIconName} />
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                {" Advertising "}
              </Text>
              <Text className="text-lg font-bold">
                {"₹6.1L"}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 py-6">
          <View className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex items-center justify-between mb-6">
              <Text className="font-bold">
                {"Monthly Profit Trend"}
              </Text>
              <Text className="text-xs text-slate-400">
                {"Apr - Mar"}
              </Text>
            </View>
            <View className="flex items-end justify-between h-32 gap-1">
              <View className="w-full bg-primary/20 rounded-t h-[40%]" />
              <View className="w-full bg-primary/20 rounded-t h-[55%]" />
              <View className="w-full bg-primary/40 rounded-t h-[30%]" />
              <View className="w-full bg-primary/20 rounded-t h-[45%]" />
              <View className="w-full bg-primary/60 rounded-t h-[70%]" />
              <View className="w-full bg-primary rounded-t h-[90%]" />
              <View className="w-full bg-primary/40 rounded-t h-[50%]" />
              <View className="w-full bg-primary/20 rounded-t h-[35%]" />
              <View className="w-full bg-primary/80 rounded-t h-[80%]" />
              <View className="w-full bg-primary/40 rounded-t h-[60%]" />
              <View className="w-full bg-primary/30 rounded-t h-[45%]" />
              <View className="w-full bg-primary/50 rounded-t h-[65%]" />
            </View>
            <View className="flex justify-between mt-2 text-[10px] text-slate-400">
              <Text>
                {"Apr"}
              </Text>
              <Text>
                {"Sep"}
              </Text>
              <Text>
                {"Mar"}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 py-2 mb-20">
          <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight mb-4 flex items-center gap-2">
            <MaterialIcons className="text-red-500" name={"trending_down" as MaterialIconName} />
            {" Expense Breakdown "}
          </Text>
          <View className="space-y-3">
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <MaterialIcons className="" name={"apartment" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-semibold text-sm">
                    {"Venue Rentals"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Hall & Community Center bookings "}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-red-500">
                {"₹9.2L"}
              </Text>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <MaterialIcons className="" name={"restaurant" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-semibold text-sm">
                    {"Catering"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Event meals & refreshments "}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-red-500">
                {"₹7.8L"}
              </Text>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <MaterialIcons className="" name={"campaign" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-semibold text-sm">
                    {"Marketing & Newsletters"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Digital & Print reach"}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-red-500">
                {"₹4.2L"}
              </Text>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <MaterialIcons className="" name={"handshake" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-semibold text-sm">
                    {"Charity & Scholarships"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Community support fund"}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-red-500">
                {"₹8.5L"}
              </Text>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <MaterialIcons className="" name={"settings" as MaterialIconName} />
                </View>
                <View>
                  <Text className="font-semibold text-sm">
                    {"Administrative Costs"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {" Office & Software utilities "}
                  </Text>
                </View>
              </View>
              <Text className="font-bold text-red-500">
                {"₹3.05L"}
              </Text>
            </View>
          </View>
        </View>
        <View className="absolute bottom-16 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 border-t border-primary/10">
          <View className="flex gap-4">
            <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 py-3 rounded-xl font-bold" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"description" as MaterialIconName} />
              <Text>{" Excel "}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"picture_as_pdf" as MaterialIconName} />
              <Text>{" PDF Report "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 flex border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2 z-20">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"home" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"pie_chart" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Finance"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Community"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"account_circle" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
