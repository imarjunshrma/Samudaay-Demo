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

export default function MonthlyPublicationsArchiveScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between absolute top-0 z-10 border-b border-primary/10">
          <View className="text-primary flex size-10 shrink-0 items-center justify-center">
            <MaterialIcons className="text-2xl" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {" Community Publications "}
          </Text>
          <View className="size-10" />
        </View>
        <View className="px-4 py-4">
          <View className="flex flex-col min-w-40 h-12 w-full">
            <View className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <View className="text-primary flex border-none bg-primary/10 items-center justify-center pl-4 rounded-l-xl">
                <MaterialIcons className="text-xl" name={"search" as MaterialIconName} />
              </View>
              <TextInput className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 dark:text-slate-100 border-none bg-primary/10 h-full placeholder:text-primary/60 px-4 pl-2 text-base font-normal leading-normal" placeholder="Search months or topics" />
            </View>
          </View>
        </View>
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          {" Archive 2024 "}
        </Text>
        <View className="space-y-4 p-4">
          <View className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/40 p-4 shadow-sm border border-primary/5">
            <View className="flex items-start justify-between gap-4">
              <View className="flex flex-col gap-1 flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" January 2024 Edition "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  {" New Year resolutions and community projects. "}
                </Text>
              </View>
              <View className="w-24 h-32 bg-center bg-no-repeat bg-cover rounded-lg shadow-md shrink-0" />
            </View>
            <View className="flex gap-2">
              <TouchableOpacity className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"book_2" as MaterialIconName} />
                <Text>
                  {"Read Online"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"download" as MaterialIconName} />
                <Text>
                  {"PDF"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/40 p-4 shadow-sm border border-primary/5">
            <View className="flex items-start justify-between gap-4">
              <View className="flex flex-col gap-1 flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" February 2024 Edition "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  {" Valentines special and local market features. "}
                </Text>
              </View>
              <View className="w-24 h-32 bg-center bg-no-repeat bg-cover rounded-lg shadow-md shrink-0" />
            </View>
            <View className="flex gap-2">
              <TouchableOpacity className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"book_2" as MaterialIconName} />
                <Text>
                  {"Read Online"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"download" as MaterialIconName} />
                <Text>
                  {"PDF"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">
          {" Archive 2023 "}
        </Text>
        <View className="space-y-4 p-4 pb-24">
          <View className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/40 p-4 shadow-sm border border-primary/5">
            <View className="flex items-start justify-between gap-4">
              <View className="flex flex-col gap-1 flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" December 2023 Edition "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  {" Year in review and holiday celebrations. "}
                </Text>
              </View>
              <View className="w-24 h-32 bg-center bg-no-repeat bg-cover rounded-lg shadow-md shrink-0" />
            </View>
            <View className="flex gap-2">
              <TouchableOpacity className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"book_2" as MaterialIconName} />
                <Text>
                  {"Read Online"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"download" as MaterialIconName} />
                <Text>
                  {"PDF"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-800/40 p-4 shadow-sm border border-primary/5">
            <View className="flex items-start justify-between gap-4">
              <View className="flex flex-col gap-1 flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                  {" November 2023 Edition "}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                  {" Autumn harvest and volunteer spotlight. "}
                </Text>
              </View>
              <View className="w-24 h-32 bg-center bg-no-repeat bg-cover rounded-lg shadow-md shrink-0" />
            </View>
            <View className="flex gap-2">
              <TouchableOpacity className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"book_2" as MaterialIconName} />
                <Text>
                  {"Read Online"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary gap-2 text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-lg" name={"download" as MaterialIconName} />
                <Text>
                  {"PDF"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 w-full max-w-md bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 pb-3 pt-2">
          <View className="flex gap-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"home" as MaterialIconName} />
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Home "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"newspaper" as MaterialIconName} />
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" News "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"book_2" as MaterialIconName} />
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Pubs "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"person" as MaterialIconName} />
              <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
                {" Profile "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
