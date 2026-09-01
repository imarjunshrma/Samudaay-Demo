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

export default function ExpenseManagementAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 absolute top-0 z-10">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
            {" Expense Management "}
          </Text>
          <View className="flex gap-2">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"search" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"notifications" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 pb-24">
          <View className="flex flex-wrap gap-4 p-4">
            <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-slate-800 shadow-sm">
              <View className="flex items-center gap-2 text-primary">
                <MaterialIcons className="text-xl" name={"account_balance_wallet" as MaterialIconName} />
                <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {" Total Monthly Expenses "}
                </Text>
              </View>
              <Text className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold">
                {" ₹45,800 "}
              </Text>
              <View className="flex items-center gap-1">
                <MaterialIcons className="text-green-600 text-sm" name={"trending_up" as MaterialIconName} />
                <Text className="text-green-600 text-xs font-semibold">
                  {" +5.2% vs last month "}
                </Text>
              </View>
            </View>
            <View className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 border border-primary/20 bg-white dark:bg-slate-800 shadow-sm">
              <View className="flex items-center gap-2 text-primary">
                <MaterialIcons className="text-xl" name={"pending_actions" as MaterialIconName} />
                <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {" Pending Reconciliations "}
                </Text>
              </View>
              <Text className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold">
                {" 12 "}
              </Text>
              <View className="flex items-center gap-1">
                <MaterialIcons className="text-primary text-sm" name={"priority_high" as MaterialIconName} />
                <Text className="text-primary text-xs font-semibold">
                  {" Requires attention "}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4 py-2">
            <View className="flex items-center justify-between mb-3">
              <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                {" Filters "}
              </Text>
              <TouchableOpacity className="text-primary text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Clear All "}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 px-4" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-primary text-sm" name={"calendar_today" as MaterialIconName} />
                <Text className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                  {" Oct 2023 "}
                </Text>
                <MaterialIcons className="text-slate-400 text-sm" name={"keyboard_arrow_down" as MaterialIconName} />
              </TouchableOpacity>
              <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 px-4" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-primary text-sm" name={"category" as MaterialIconName} />
                <Text className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                  {" Category "}
                </Text>
                <MaterialIcons className="text-slate-400 text-sm" name={"keyboard_arrow_down" as MaterialIconName} />
              </TouchableOpacity>
              <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 px-4" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-primary text-sm" name={"event" as MaterialIconName} />
                <Text className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                  {" Event "}
                </Text>
                <MaterialIcons className="text-slate-400 text-sm" name={"keyboard_arrow_down" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-4 pt-4">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                {" Recent Expenses "}
              </Text>
              <Text className="text-slate-500 text-xs font-medium">
                {"Showing 24 entries"}
              </Text>
            </View>
            <View className="space-y-3">
              <View className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-800/50">
                <View className="flex items-center gap-3">
                  <View className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                    <MaterialIcons className="" name={"campaign" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                      {" Social Media Ads "}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {"Marketing • Oct 24, 2023"}
                    </Text>
                    <Text className="text-primary/70 text-[10px] font-medium mt-1">
                      {" Event: Diwali Artisans Meet "}
                    </Text>
                  </View>
                </View>
                <View className="text-right">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {" ₹2,450 "}
                  </Text>
                  <Text className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    {"Paid"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-800/50">
                <View className="flex items-center gap-3">
                  <View className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <MaterialIcons className="" name={"restaurant" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                      {" Catering Services "}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {"Catering • Oct 22, 2023"}
                    </Text>
                    <Text className="text-slate-400 text-[10px] font-medium mt-1">
                      {" General Operations "}
                    </Text>
                  </View>
                </View>
                <View className="text-right">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {" ₹15,000 "}
                  </Text>
                  <Text className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                    {"Pending"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-800/50">
                <View className="flex items-center gap-3">
                  <View className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                    <MaterialIcons className="" name={"location_on" as MaterialIconName} />
                  </View>
                  <View>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                      {" Hall Rental Deposit "}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {"Venue • Oct 20, 2023"}
                    </Text>
                    <Text className="text-primary/70 text-[10px] font-medium mt-1">
                      {" Event: Annual Workshop "}
                    </Text>
                  </View>
                </View>
                <View className="text-right">
                  <Text className="text-slate-900 dark:text-slate-100 font-bold">
                    {" ₹8,000 "}
                  </Text>
                  <Text className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    {"Paid"}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity className="w-full mt-6 py-3 text-primary font-semibold text-sm bg-primary/5 rounded-xl border border-dashed border-primary/30" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" View All Transaction History "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="absolute right-6 bottom-24 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center z-20" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
        </TouchableOpacity>
        <View className="hidden absolute inset-0 bg-black/50 z-50 flex items-end">
          <View className="bg-background-light dark:bg-background-dark w-full rounded-t-3xl p-6 space-y-4">
            <View className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2" />
            <Text className="text-xl font-bold">
              {"Add New Expense"}
            </Text>
            <View className="flex gap-4 flex-col">
              <View className="space-y-1">
                <View className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <Text>{"Category"}</Text>
                </View>
                <TextInput className="w-full rounded-lg border-primary/20 bg-white dark:bg-slate-800" />
              </View>
              <View className="space-y-1">
                <View className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <Text>{"Amount (₹)"}</Text>
                </View>
                <TextInput className="w-full rounded-lg border-primary/20 bg-white dark:bg-slate-800" placeholder="0.00" />
              </View>
              <View className="space-y-1">
                <View className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <Text>{"Payment Method"}</Text>
                </View>
                <View className="flex gap-2">
                  <TouchableOpacity className="flex-1 py-2 rounded-lg border border-primary bg-primary/10 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" UPI "}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 py-2 rounded-lg border border-primary/20 text-slate-600 text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" Cash "}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 py-2 rounded-lg border border-primary/20 text-slate-600 text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                    <Text>{" Bank Transfer "}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Save Expense "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2 flex items-center justify-around z-30">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Dashboard"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"receipt_long" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Expenses"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"calendar_month" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Events"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-xs font-medium">
              {"Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
