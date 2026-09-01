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

export default function PeopleAnalyticsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
    <View className="absolute top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10 px-4 py-3 flex items-center justify-between">
      <View className="flex items-center gap-3">
        <View className="bg-primary p-2 rounded-lg text-white">
          <MaterialIcons className="" name={"group" as MaterialIconName} />
        </View>
        <View>
          <Text className="text-lg font-bold leading-tight">
            {"ICC Analytics"}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            {" Indian Cobbler Community "}
          </Text>
        </View>
      </View>
      <View className="flex items-center gap-2">
        <TouchableOpacity className="p-2 rounded-full text-slate-600 dark:text-slate-300" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"search" as MaterialIconName} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 rounded-full text-slate-600 dark:text-slate-300 relative" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"notifications" as MaterialIconName} />
          <Text className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" />
        </TouchableOpacity>
        <View className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <Text className="text-primary font-bold text-xs">
            {"AD"}
          </Text>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 border-t border-primary/10 pb-6 pt-2">
      <View className="max-w-md mx-auto flex justify-around items-center px-4">
        <TouchableOpacity className="flex flex-col items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
          <View className="bg-primary/10 p-2 rounded-xl text-primary">
            <MaterialIcons className="block" name={"dashboard" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-bold text-primary">
            {"Dashboard"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
          <View className="p-2 rounded-xl text-slate-400">
            <MaterialIcons className="block" name={"event" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-bold text-slate-400">
            {"Events"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
          <View className="p-2 rounded-xl text-slate-400">
            <MaterialIcons className="block" name={"receipt_long" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-bold text-slate-400">
            {"Transactions"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center gap-1" accessibilityRole="button" activeOpacity={0.85}>
          <View className="p-2 rounded-xl text-slate-400">
            <MaterialIcons className="block" name={"favorite" as MaterialIconName} />
          </View>
          <Text className="text-[10px] font-bold text-slate-400">
            {"Matrimony"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex-1 pb-24">
        <View className="p-4">
          <View className="bg-gradient-to-br from-primary to-orange-600 rounded-xl p-6 text-white shadow-lg shadow-primary/20">
            <Text className="text-primary-100 text-sm font-medium mb-1">
              {" Total Community Strength "}
            </Text>
            <Text className="text-4xl font-extrabold mb-4">
              {"12,500+"}
            </Text>
            <View className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full">
              <MaterialIcons className="text-sm" name={"trending_up" as MaterialIconName} />
              <Text>
                {"12% growth this year"}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex gap-4 px-4 flex-col md:flex-row md:flex-wrap">
          <View className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 w-full md:w-[48%]">
            <View className="flex items-center justify-between mb-2">
              <MaterialIcons className="text-primary" name={"person_add" as MaterialIconName} />
              <Text className="text-xs font-bold text-green-500">
                {"+5%"}
              </Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">
              {" New Registrations "}
            </Text>
            <Text className="text-xl font-bold mt-1">
              {"842"}
            </Text>
          </View>
          <View className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-primary/10 w-full md:w-[48%]">
            <View className="flex items-center justify-between mb-2">
              <MaterialIcons className="text-primary" name={"volunteer_activism" as MaterialIconName} />
              <Text className="text-xs font-bold text-primary">
                {"+8%"}
              </Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">
              {" Active Matrimony "}
            </Text>
            <Text className="text-xl font-bold mt-1">
              {"2,104"}
            </Text>
          </View>
        </View>
        <View className="mt-6 px-4">
          <View className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold">
              {"Members by City"}
            </Text>
            <TouchableOpacity className="text-primary text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"View Map"}</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-primary/10">
            <View className="flex items-end justify-between h-48 gap-2">
              <View className="flex flex-col items-center flex-1 gap-2">
                <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                  <View className="absolute inset-0 bg-primary rounded-t-lg h-[90%] bottom-0 mt-auto" />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 rotate-45 mt-2">
                  {"Mumbai"}
                </Text>
              </View>
              <View className="flex flex-col items-center flex-1 gap-2">
                <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                  <View className="absolute inset-0 bg-primary rounded-t-lg h-[75%] bottom-0 mt-auto" />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 rotate-45 mt-2">
                  {"Delhi"}
                </Text>
              </View>
              <View className="flex flex-col items-center flex-1 gap-2">
                <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                  <View className="absolute inset-0 bg-primary rounded-t-lg h-[60%] bottom-0 mt-auto" />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 rotate-45 mt-2">
                  {"Agra"}
                </Text>
              </View>
              <View className="flex flex-col items-center flex-1 gap-2">
                <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                  <View className="absolute inset-0 bg-primary rounded-t-lg h-[45%] bottom-0 mt-auto" />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 rotate-45 mt-2">
                  {"Kanpur"}
                </Text>
              </View>
              <View className="flex flex-col items-center flex-1 gap-2">
                <View className="w-full bg-primary/20 rounded-t-lg relative h-[100%]">
                  <View className="absolute inset-0 bg-primary rounded-t-lg h-[30%] bottom-0 mt-auto" />
                </View>
                <Text className="text-[10px] font-bold text-slate-500 rotate-45 mt-2">
                  {"Chennai"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mt-8 px-4">
          <Text className="text-lg font-bold mb-4">
            {"Regional Distribution List"}
          </Text>
          <View className="space-y-3">
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <Text>{" M "}</Text>
                </View>
                <View>
                  <Text className="font-bold text-sm">
                    {"Mumbai Metro"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Maharashtra"}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="font-bold text-sm">
                  {"3,420"}
                </Text>
                <Text className="text-[10px] text-green-500 font-medium">
                  {"+2.4%"}
                </Text>
              </View>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <Text>{" D "}</Text>
                </View>
                <View>
                  <Text className="font-bold text-sm">
                    {"Delhi NCR"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"North Region"}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="font-bold text-sm">
                  {"2,890"}
                </Text>
                <Text className="text-[10px] text-green-500 font-medium">
                  {"+1.8%"}
                </Text>
              </View>
            </View>
            <View className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5">
              <View className="flex items-center gap-3">
                <View className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <Text>{" A "}</Text>
                </View>
                <View>
                  <Text className="font-bold text-sm">
                    {"Agra District"}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {"Uttar Pradesh"}
                  </Text>
                </View>
              </View>
              <View className="text-right">
                <Text className="font-bold text-sm">
                  {"1,540"}
                </Text>
                <Text className="text-[10px] text-red-500 font-medium">
                  {"-0.5%"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
