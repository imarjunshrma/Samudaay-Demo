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

export default function MyTransactionsMemberScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
        <View className="flex items-center p-4 pb-2 justify-between absolute top-0 z-10 bg-background-light/80 dark:bg-background-dark/80">
          <View className="flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight flex-1 text-center pr-10">
            {" My Transactions "}
          </Text>
        </View>
        <View className="p-4">
          <View className="flex flex-col gap-2 rounded-xl p-6 bg-primary/10 border border-primary/20">
            <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              {" Total Contribution "}
            </Text>
            <Text className="text-primary text-3xl font-bold leading-tight">
              {"$1,250.00"}
            </Text>
            <View className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <MaterialIcons className="text-sm" name={"verified" as MaterialIconName} />
              <Text>
                {"Last updated: Oct 24, 2023"}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-4 absolute top-[60px] z-10 bg-background-light dark:bg-background-dark">
          <View className="flex border-b border-primary/10 gap-4 overflow-x-auto no-scrollbar">
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-4 px-2 whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"All Activities"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 px-2 whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Donations"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 px-2 whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Events"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 px-2 whitespace-nowrap" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold tracking-wide">
                {"Subscriptions"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-col gap-1 p-4 pb-24">
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest pb-3">
            {" Recent Transactions "}
          </Text>
          <View className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex items-center gap-4">
              <View className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View className="flex flex-col">
                <Text className="text-slate-900 dark:text-slate-100 font-bold">
                  {" Annual Charity Fund "}
                </Text>
                <Text className="text-slate-500 text-xs font-medium">
                  {" Oct 22, 2023 • Donation "}
                </Text>
              </View>
            </View>
            <View className="flex flex-col items-end gap-2">
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {"-$500.00"}
              </Text>
              <TouchableOpacity className="flex items-center gap-1 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"picture_as_pdf" as MaterialIconName} />
                <Text>{" Receipt "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex items-center gap-4">
              <View className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <MaterialIcons className="" name={"event_available" as MaterialIconName} />
              </View>
              <View className="flex flex-col">
                <Text className="text-slate-900 dark:text-slate-100 font-bold">
                  {" Gala Night 2023 "}
                </Text>
                <Text className="text-slate-500 text-xs font-medium">
                  {" Oct 15, 2023 • Event Registration "}
                </Text>
              </View>
            </View>
            <View className="flex flex-col items-end gap-2">
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {"-$150.00"}
              </Text>
              <TouchableOpacity className="flex items-center gap-1 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"picture_as_pdf" as MaterialIconName} />
                <Text>{" Receipt "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex items-center gap-4">
              <View className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialIcons className="" name={"favorite" as MaterialIconName} />
              </View>
              <View className="flex flex-col">
                <Text className="text-slate-900 dark:text-slate-100 font-bold">
                  {" Premium Membership "}
                </Text>
                <Text className="text-slate-500 text-xs font-medium">
                  {" Oct 01, 2023 • Matrimony Sub. "}
                </Text>
              </View>
            </View>
            <View className="flex flex-col items-end gap-2">
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {"-$299.00"}
              </Text>
              <TouchableOpacity className="flex items-center gap-1 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"picture_as_pdf" as MaterialIconName} />
                <Text>{" Receipt "}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex items-center gap-4">
              <View className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                <MaterialIcons className="" name={"volunteer_activism" as MaterialIconName} />
              </View>
              <View className="flex flex-col">
                <Text className="text-slate-900 dark:text-slate-100 font-bold">
                  {" Community Kitchen "}
                </Text>
                <Text className="text-slate-500 text-xs font-medium">
                  {" Sep 28, 2023 • Donation "}
                </Text>
              </View>
            </View>
            <View className="flex flex-col items-end gap-2">
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {"-$301.00"}
              </Text>
              <TouchableOpacity className="flex items-center gap-1 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"picture_as_pdf" as MaterialIconName} />
                <Text>{" Receipt "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-4 pt-2 flex justify-around">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"home" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"account_balance_wallet" as MaterialIconName} />
            <Text className="text-[10px] font-bold">
              {"Transactions"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"person" as MaterialIconName} />
            <Text className="text-[10px] font-medium">
              {"Profile"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
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
