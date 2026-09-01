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

export default function TrusteesScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-screen w-full flex-col overflow-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 justify-between absolute top-0 z-10">
          <View className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {" Community Trustees "}
          </Text>
          <View className="flex w-10 items-center justify-end">
            <TouchableOpacity className="flex size-10 items-center justify-center rounded-full text-slate-900 dark:text-slate-100" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"search" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto pb-24">
          <View className="px-4 py-6">
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {" Board of Trustees "}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {" Dedicated leaders serving the Indian Cobbler Community since 1985. "}
            </Text>
          </View>
          <View className="flex flex-col gap-1">
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm" />
              <View className="flex flex-1 flex-col">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" Rajesh Kumar "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"President"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
                  {" 25 years exp • Dharavi, Mumbai "}
                </Text>
              </View>
              <View className="shrink-0">
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-md" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>
                    {"Contact"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm" />
              <View className="flex flex-1 flex-col">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" Amit Shah "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"Secretary"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
                  {" 18 years exp • Agra, UP "}
                </Text>
              </View>
              <View className="shrink-0">
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 text-primary text-sm font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>
                    {"Contact"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm" />
              <View className="flex flex-1 flex-col">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" Priya More "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {"Treasurer"}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
                  {" 15 years exp • Kolhapur, MH "}
                </Text>
              </View>
              <View className="shrink-0">
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 text-primary text-sm font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>
                    {"Contact"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 px-4 py-5 border-y border-primary/5">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm" />
              <View className="flex flex-1 flex-col">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" Vikram Singh "}
                </Text>
                <Text className="text-primary text-sm font-semibold mb-1">
                  {" Senior Advisor "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
                  {" 40 years exp • Jodhpur, RJ "}
                </Text>
              </View>
              <View className="shrink-0">
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 text-primary text-sm font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>
                    {"Contact"}
                  </Text>
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
