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

export default function EventProfitAndLossStatementScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 absolute top-0 z-10">
          <View className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-lg font-bold leading-tight tracking-tight">
              {" Annual Artisans Meet 2024 "}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              {" Financial Summary • Jan 15-17 "}
            </Text>
          </View>
          <View className="flex items-center gap-2">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"share" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"download" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 pb-24">
          <View className="flex flex-wrap gap-4 p-4">
            <View className="flex min-w-[150px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <View className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <MaterialIcons className="text-sm" name={"account_balance_wallet" as MaterialIconName} />
                <Text className="text-sm font-medium">
                  {"Total Income"}
                </Text>
              </View>
              <Text className="tracking-tight text-2xl font-bold">
                {"₹8,45,000"}
              </Text>
              <View className="flex items-center gap-1 mt-1">
                <MaterialIcons className="text-green-600 text-xs" name={"trending_up" as MaterialIconName} />
                <Text className="text-green-600 text-xs font-semibold">
                  {" +12.5% vs target "}
                </Text>
              </View>
            </View>
            <View className="flex min-w-[150px] flex-1 flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <View className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <MaterialIcons className="text-sm" name={"payments" as MaterialIconName} />
                <Text className="text-sm font-medium">
                  {"Total Expenses"}
                </Text>
              </View>
              <Text className="tracking-tight text-2xl font-bold">
                {"₹5,12,400"}
              </Text>
              <View className="flex items-center gap-1 mt-1">
                <MaterialIcons className="text-amber-600 text-xs" name={"warning" as MaterialIconName} />
                <Text className="text-amber-600 text-xs font-semibold">
                  {"8% over budget"}
                </Text>
              </View>
            </View>
            <View className="flex min-w-[150px] flex-1 flex-col gap-1 rounded-xl p-5 bg-primary/10 dark:bg-primary/20 border border-primary/20">
              <View className="flex items-center gap-2 text-primary mb-1">
                <MaterialIcons className="text-sm" name={"analytics" as MaterialIconName} />
                <Text className="text-sm font-bold">
                  {"Net Profit"}
                </Text>
              </View>
              <Text className="tracking-tight text-2xl font-bold text-primary">
                {" ₹3,32,600 "}
              </Text>
              <View className="flex items-center gap-1 mt-1">
                <MaterialIcons className="text-green-600 text-xs" name={"verified" as MaterialIconName} />
                <Text className="text-green-600 text-xs font-semibold">
                  {"39.3% Margin"}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4 mt-2">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-lg font-bold">
                {"Income Breakdown"}
              </Text>
              <Text className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                {"CREDIT"}
              </Text>
            </View>
            <View className="space-y-3">
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                  <MaterialIcons className="" name={"confirmation_number" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Ticket Sales"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"450 General • 120 VIP"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold">
                    {"₹5,80,000"}
                  </Text>
                  <Text className="text-[10px] text-green-600 font-medium">
                    {"Completed"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                  <MaterialIcons className="" name={"handshake" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Sponsorships"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Bata India, Metro Shoes"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold">
                    {"₹2,25,000"}
                  </Text>
                  <Text className="text-[10px] text-amber-600 font-medium">
                    {" ₹50k Pending "}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                  <MaterialIcons className="" name={"add_shopping_cart" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Add-on Sales"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Workshop Kits & Tools"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold">
                    {"₹40,000"}
                  </Text>
                  <Text className="text-[10px] text-green-600 font-medium">
                    {"Completed"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="px-4 mt-8">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-lg font-bold">
                {"Expense Breakdown"}
              </Text>
              <Text className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                {"DEBIT"}
              </Text>
            </View>
            <View className="space-y-3">
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-slate-400 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0 size-12">
                  <MaterialIcons className="" name={"location_on" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Venue & Logistics"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Dharavi Community Center"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold text-red-500">
                    {"-₹1,20,000"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"Paid in full"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-slate-400 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0 size-12">
                  <MaterialIcons className="" name={"restaurant" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Catering"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Lunch & Tea (3 Days)"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold text-red-500">
                    {"-₹1,85,000"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"Paid in full"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-slate-400 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0 size-12">
                  <MaterialIcons className="" name={"construction" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Materials & Leather"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Live Demo Supplies"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold text-red-500">
                    {"-₹95,000"}
                  </Text>
                  <Text className="text-[10px] text-slate-400">
                    {"Paid in full"}
                  </Text>
                </View>
              </View>
              <View className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <View className="text-slate-400 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0 size-12">
                  <MaterialIcons className="" name={"badge" as MaterialIconName} />
                </View>
                <View className="flex flex-1 flex-col">
                  <Text className="text-sm font-bold">
                    {"Staffing & Security"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"12 Temporary Staff"}
                  </Text>
                </View>
                <View className="text-right">
                  <Text className="text-sm font-bold text-red-500">
                    {"-₹1,12,400"}
                  </Text>
                  <Text className="text-[10px] text-amber-600 font-medium">
                    {" Reconciling "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-6 pt-2 flex items-center justify-around z-20">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal">
              {"Dashboard"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal">
              {"Events"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"account_balance" as MaterialIconName} />
            <Text className="text-[10px] font-bold leading-normal">
              {"Finances"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"person" as MaterialIconName} />
            <Text className="text-[10px] font-medium leading-normal">
              {"Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
