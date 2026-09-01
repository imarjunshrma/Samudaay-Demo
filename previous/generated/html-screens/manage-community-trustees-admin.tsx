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

export default function ManageCommunityTrusteesAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-screen w-full flex-col overflow-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 justify-between absolute top-0 z-10">
          <View className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {" Manage Trustees "}
          </Text>
          <View className="flex w-10 items-center justify-end">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-full text-slate-900 dark:text-slate-100" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"search" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto pb-32">
          <View className="px-4 py-6 flex justify-between items-end">
            <View>
              <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {" Board of Trustees "}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {" Admin Dashboard • Managing 4 Trustees "}
              </Text>
            </View>
            <View className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Text>{" Admin View "}</Text>
            </View>
          </View>
          <View className="flex flex-col gap-1">
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm shrink-0" />
              <View className="flex flex-1 flex-col min-w-0">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight truncate">
                  {" Rajesh Kumar "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"President"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal truncate">
                  {" 25 years exp • Dharavi, Mumbai "}
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm shrink-0" />
              <View className="flex flex-1 flex-col min-w-0">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight truncate">
                  {" Amit Shah "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"Secretary"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal truncate">
                  {" 18 years exp • Agra, UP "}
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm shrink-0" />
              <View className="flex flex-1 flex-col min-w-0">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight truncate">
                  {" Priya More "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"Treasurer"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal truncate">
                  {" 15 years exp • Kolhapur, MH "}
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm shrink-0" />
              <View className="flex flex-1 flex-col min-w-0">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight truncate">
                  {" Vikram Singh "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {" Senior Advisor "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal truncate">
                  {" 40 years exp • Jodhpur, RJ "}
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"edit" as MaterialIconName} />
                </TouchableOpacity>
                <TouchableOpacity className="flex size-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="text-[20px]" name={"delete" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="mx-4 my-8 p-5 rounded-xl bg-primary text-white shadow-lg">
            <Text className="font-bold text-lg mb-2">
              {"Our Reach"}
            </Text>
            <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
              <View className="w-full md:w-[48%]">
                <Text className="text-primary-100 text-xs uppercase tracking-wider opacity-80">
                  {" Members "}
                </Text>
                <Text className="text-2xl font-bold">
                  {"12,500+"}
                </Text>
              </View>
              <View className="w-full md:w-[48%]">
                <Text className="text-primary-100 text-xs uppercase tracking-wider opacity-80">
                  {" Districts "}
                </Text>
                <Text className="text-2xl font-bold">
                  {"48"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity className="absolute right-6 bottom-28 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl z-30" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-3xl" name={"add" as MaterialIconName} />
          <Text className="sr-only">
            {"Add Trustee"}
          </Text>
        </TouchableOpacity>
        <View className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-primary/10 bg-white/90 dark:bg-background-dark/90 px-6 pb-6 pt-3 z-20">
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-[26px]" name={"home" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Home"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-[26px] fill-1" name={"groups" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {" Community "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center gap-1 text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-[26px]" name={"person" as MaterialIconName} />
            <Text className="text-[10px] font-bold uppercase tracking-wider">
              {"Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
