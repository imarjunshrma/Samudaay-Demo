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

export default function TransactionManagementAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 absolute top-0 z-10 border-b border-slate-200 dark:border-slate-800">
          <View className="flex size-10 shrink-0 items-center justify-center rounded-lg dark:hover:bg-slate-800">
            <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
            {" All Transactions "}
          </Text>
          <View className="flex gap-2">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg dark:hover:bg-slate-800" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"search" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-lg dark:hover:bg-slate-800" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"download" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-4 @container">
          <View className="flex w-full flex-col gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <View className="flex gap-4 items-center">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary" />
              <View className="flex flex-col justify-center">
                <View className="flex items-center gap-2">
                  <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                    {" Alex Johnson "}
                  </Text>
                  <Text className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {"National Admin"}
                  </Text>
                </View>
                <Text className="text-slate-500 dark:text-slate-400 text-sm">
                  {" Full Platform Visibility • Global Access "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="px-4 pb-2">
          <Text className="text-slate-900 dark:text-slate-100 text-base font-bold mb-3 flex items-center gap-2">
            <MaterialIcons className="text-sm" name={"filter_list" as MaterialIconName} />
            {" Filters "}
          </Text>
          <View className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-primary text-xl" name={"location_on" as MaterialIconName} />
              <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {" All Cities "}
              </Text>
              <MaterialIcons className="text-slate-400 text-lg" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-primary text-xl" name={"category" as MaterialIconName} />
              <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {" All Types "}
              </Text>
              <MaterialIcons className="text-slate-400 text-lg" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
            <TouchableOpacity className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-primary text-xl" name={"calendar_today" as MaterialIconName} />
              <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {" Last 30 Days "}
              </Text>
              <MaterialIcons className="text-slate-400 text-lg" name={"expand_more" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 px-4 py-2 flex flex-col gap-3">
          <View className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <View className="flex items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {" Sarah Williams "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" New York, 10001 • Donation "}
                </Text>
              </View>
            </View>
            <View className="text-right">
              <Text className="font-bold text-slate-900 dark:text-slate-100">
                {"$250.00"}
              </Text>
              <Text className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded uppercase">
                {"Completed"}
              </Text>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <View className="flex items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <MaterialIcons className="" name={"event" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {" Michael Chen "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" San Francisco, 94105 • Event Ticket "}
                </Text>
              </View>
            </View>
            <View className="text-right">
              <Text className="font-bold text-slate-900 dark:text-slate-100">
                {"$45.00"}
              </Text>
              <Text className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded uppercase">
                {"Completed"}
              </Text>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <View className="flex items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {" Jessica Smith "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Chicago, 60601 • Donation "}
                </Text>
              </View>
            </View>
            <View className="text-right">
              <Text className="font-bold text-slate-900 dark:text-slate-100">
                {" $1,200.00 "}
              </Text>
              <Text className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded uppercase">
                {"Pending"}
              </Text>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <View className="flex items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <MaterialIcons className="" name={"card_membership" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {" David Miller "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Austin, 73301 • Membership "}
                </Text>
              </View>
            </View>
            <View className="text-right">
              <Text className="font-bold text-slate-900 dark:text-slate-100">
                {"$150.00"}
              </Text>
              <Text className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded uppercase">
                {"Completed"}
              </Text>
            </View>
          </View>
          <View className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm opacity-60">
            <View className="flex items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <MaterialIcons className="" name={"error" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {" Robert Brown "}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {" Seattle, 98101 • Donation "}
                </Text>
              </View>
            </View>
            <View className="text-right">
              <Text className="font-bold text-slate-900 dark:text-slate-100">
                {"$50.00"}
              </Text>
              <Text className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded uppercase">
                {"Failed"}
              </Text>
            </View>
          </View>
        </View>
        <View className="h-20" />
        <View className="absolute bottom-0 w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-4 pt-2 flex items-center justify-between z-20">
          <TouchableOpacity className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"dashboard" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Dashboard"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"list_alt" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Transactions"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"group" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Members"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"settings" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
