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

export default function CreateNotificationAdminScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full flex-col max-w-2xl mx-auto border-x border-primary/10 bg-background-light dark:bg-background-dark overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between absolute top-0 z-10 border-b border-primary/10">
          <View className="text-primary flex size-12 shrink-0 items-center">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 ml-2">
            {" Create Notification "}
          </Text>
          <View className="size-12 flex items-center justify-end">
            <MaterialIcons className="text-slate-500" name={"more_vert" as MaterialIconName} />
          </View>
        </View>
        <View className="flex flex-col gap-6 p-4">
          <View className="flex flex-wrap items-end gap-4 w-full">
            <View className="flex flex-col min-w-40 flex-1">
              <Text className="text-slate-800 dark:text-slate-200 text-base font-semibold leading-normal pb-2">
                {" Notification Title "}
              </Text>
              <TextInput className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 border border-primary/20 bg-white dark:bg-slate-800 h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal" placeholder="e.g. Monthly Community Meetup" />
            </View>
          </View>
          <View className="flex flex-wrap items-end gap-4 w-full">
            <View className="flex flex-col min-w-40 flex-1">
              <Text className="text-slate-800 dark:text-slate-200 text-base font-semibold leading-normal pb-2">
                {" Message "}
              </Text>
              <TextInput className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 border border-primary/20 bg-white dark:bg-slate-800 min-h-[160px] placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal" placeholder="Write your announcement for the Indian Cobbler Community..." multiline />
            </View>
          </View>
          <View className="flex justify-start">
            <TouchableOpacity className="flex min-w-[140px] items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary/10 text-primary border border-primary/20 gap-2 font-bold leading-normal tracking-[0.015em]" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"upload" as MaterialIconName} />
              <Text className="truncate">
                {"Upload Image"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="pt-4 border-t border-primary/10">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
              {" Send To "}
            </Text>
            <View className="flex gap-3 mb-6 flex-col md:flex-row md:flex-wrap">
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 w-full md:w-[48%]">
                <TextInput className="w-5 h-5 text-primary border-primary/30" />
                <Text className="ml-3 font-medium text-slate-700 dark:text-slate-200">
                  {"All Users"}
                </Text>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 w-full md:w-[48%]">
                <TextInput className="w-5 h-5 text-primary border-primary/30" />
                <Text className="ml-3 font-medium text-slate-700 dark:text-slate-200">
                  {"Trustees"}
                </Text>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 w-full md:w-[48%]">
                <TextInput className="w-5 h-5 text-primary border-primary/30" />
                <Text className="ml-3 font-medium text-slate-700 dark:text-slate-200">
                  {"Members"}
                </Text>
              </View>
              <View className="relative flex items-center p-4 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 w-full md:w-[48%]">
                <TextInput className="w-5 h-5 text-primary border-primary/30" />
                <Text className="ml-3 font-medium text-slate-700 dark:text-slate-200">
                  {"Specific Group"}
                </Text>
              </View>
            </View>
            <View className="relative w-full">
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-semibold leading-normal pb-2">
                {" Select Group "}
              </Text>
              <View className="relative">
                <MaterialIcons className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" name={"search" as MaterialIconName} />
                <TextInput className="form-input flex w-full pl-12 rounded-lg text-slate-900 dark:text-slate-100 border border-primary/20 bg-white dark:bg-slate-800 h-12 placeholder:text-slate-400 text-sm" placeholder="Search for regional groups (e.g. Dharavi Chapter)..." />
              </View>
            </View>
          </View>
        </View>
        <View className="mt-auto p-4 border-t border-primary/10 bg-background-light dark:bg-background-dark absolute bottom-0">
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"send" as MaterialIconName} />
            <Text>{" Send Notification "}</Text>
          </TouchableOpacity>
          <Text className="text-center text-xs text-slate-500 mt-3 italic">
            {" This notification will be sent instantly to selected recipients. "}
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
