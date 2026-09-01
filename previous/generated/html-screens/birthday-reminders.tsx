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

export default function BirthdayRemindersScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto border-x border-primary/10 shadow-xl bg-background-light dark:bg-background-dark">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-primary/10 absolute top-0 z-10">
          <View className="text-primary flex size-10 shrink-0 items-center justify-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {" Birthday Reminders "}
          </Text>
          <View className="flex w-10 items-center justify-end">
            <TouchableOpacity className="flex items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"notifications" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto">
          <View className="px-4 py-6 bg-gradient-to-br from-primary/10 to-transparent">
            <View className="flex items-center gap-2 mb-2">
              <MaterialIcons className="text-primary" name={"celebration" as MaterialIconName} />
              <Text className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-[-0.015em]">
                {" Today's Birthdays "}
              </Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-sm">
              {" Don't forget to wish your fellow community members! "}
            </Text>
          </View>
          <View className="px-4 space-y-3 mt-4">
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 p-4 rounded-xl border border-primary/5 shadow-sm">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shrink-0 border-2 border-primary/20" />
              <View className="flex flex-col flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1">
                  {" Rajesh Kumar "}
                </Text>
                <Text className="text-primary text-sm font-medium leading-normal">
                  {" Turning 45 today "}
                </Text>
              </View>
              <TouchableOpacity className="flex items-center justify-center gap-1 rounded-lg h-9 px-4 bg-primary text-white text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
                <Text>
                  {"Wish"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex items-center gap-4 bg-white dark:bg-primary/5 p-4 rounded-xl border border-primary/5 shadow-sm">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 shrink-0 border-2 border-primary/20" />
              <View className="flex flex-col flex-1">
                <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1">
                  {" Amit Prajapati "}
                </Text>
                <Text className="text-primary text-sm font-medium leading-normal">
                  {" Turning 32 today "}
                </Text>
              </View>
              <TouchableOpacity className="flex items-center justify-center gap-1 rounded-lg h-9 px-4 bg-primary text-white text-sm font-semibold" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
                <Text>
                  {"Wish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-4 pb-3 pt-8">
            <View className="flex items-center gap-2 mb-4">
              <MaterialIcons className="text-slate-500" name={"calendar_month" as MaterialIconName} />
              <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-[-0.015em]">
                {" Upcoming this week "}
              </Text>
            </View>
            <View className="space-y-2">
              <View className="flex items-center gap-4 bg-transparent border-b border-primary/5 px-2 py-3">
                <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 opacity-80" />
                <View className="flex flex-col flex-1">
                  <Text className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                    {" Sunil Varma "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">
                    {" Tomorrow, Oct 24 "}
                  </Text>
                </View>
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary/10 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Set Alert "}</Text>
                </TouchableOpacity>
              </View>
              <View className="flex items-center gap-4 bg-transparent border-b border-primary/5 px-2 py-3">
                <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 opacity-80" />
                <View className="flex flex-col flex-1">
                  <Text className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                    {" Deepak Chauhan "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">
                    {" Friday, Oct 26 "}
                  </Text>
                </View>
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary/10 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Set Alert "}</Text>
                </TouchableOpacity>
              </View>
              <View className="flex items-center gap-4 bg-transparent border-b border-primary/5 px-2 py-3">
                <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0 opacity-80" />
                <View className="flex flex-col flex-1">
                  <Text className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                    {" Meena Solanki "}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">
                    {" Saturday, Oct 27 "}
                  </Text>
                </View>
                <TouchableOpacity className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary/10 text-primary text-xs font-bold" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Set Alert "}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="h-20 bg-transparent" />
        </View>
        <View className="absolute bottom-0 w-full max-w-md border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2">
          <View className="flex justify-between items-center">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"home" as MaterialIconName} />
              <Text className="text-[10px] font-medium">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group" as MaterialIconName} />
              <Text className="text-[10px] font-medium">
                {"Members"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"cake" as MaterialIconName} />
              <Text className="text-[10px] font-bold">
                {"Birthdays"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"person" as MaterialIconName} />
              <Text className="text-[10px] font-medium">
                {"Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
