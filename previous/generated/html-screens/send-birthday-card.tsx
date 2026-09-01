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

export default function SendBirthdayCardScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-x-hidden border-x border-primary/10">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 absolute top-0 z-10 border-b border-primary/10">
          <TouchableOpacity className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
            {" Send Birthday Card "}
          </Text>
        </View>
        <View className="flex-1 overflow-y-auto">
          <View className="px-4 pt-6 pb-2 flex justify-between items-end">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
              {" Select a Template "}
            </Text>
            <Text className="text-primary text-sm font-medium">
              {"View All"}
            </Text>
          </View>
          <View className="flex gap-4 p-4 flex-col md:flex-row md:flex-wrap">
            <View className="relative w-full md:w-[48%]">
              <View className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-[3/4] border-2 border-primary ring-offset-2 ring-primary overflow-hidden">
                <View className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <MaterialIcons className="text-sm" name={"check" as MaterialIconName} />
                </View>
                <Text className="text-white text-sm font-bold leading-tight line-clamp-2">
                  {" Traditional Indian Patterns "}
                </Text>
              </View>
            </View>
            <View className="relative w-full md:w-[48%]">
              <View className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-[3/4] border-2 border-transparent overflow-hidden">
                <Text className="text-white text-sm font-bold leading-tight line-clamp-2">
                  {" Leather Craft "}
                </Text>
              </View>
            </View>
            <View className="relative w-full md:w-[48%]">
              <View className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-[3/4] border-2 border-transparent overflow-hidden">
                <Text className="text-white text-sm font-bold leading-tight line-clamp-2">
                  {" Floral Designs "}
                </Text>
              </View>
            </View>
            <View className="relative w-full md:w-[48%]">
              <View className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-[3/4] border-2 border-transparent overflow-hidden">
                <Text className="text-white text-sm font-bold leading-tight line-clamp-2">
                  {" Minimalist Abstract "}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4 py-6">
            <View className="block text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight mb-4">
              <Text>{"Your Message"}</Text>
            </View>
            <View className="relative">
              <TextInput className="w-full rounded-xl border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 p-4 text-base placeholder:text-slate-400" placeholder="Write a heartfelt birthday message..." multiline />
              <View className="absolute bottom-3 right-3 text-slate-400 text-xs">
                <Text>{" 0/250 "}</Text>
              </View>
            </View>
          </View>
          <View className="px-4 pb-8">
            <View className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <View className="size-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/30">
                <MaterialIcons className="text-primary" name={"person" as MaterialIconName} />
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {" Sending to "}
                </Text>
                <Text className="text-slate-900 dark:text-slate-100 font-bold">
                  {" Arjun Sharma "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="p-4 bg-background-light dark:bg-background-dark border-t border-primary/10">
          <TouchableOpacity className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text>
              {"Send Birthday Card"}
            </Text>
            <MaterialIcons className="" name={"send" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="flex gap-2 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-6 pt-2">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"home" as MaterialIconName} />
            </View>
            <Text className="text-[10px] font-medium leading-normal tracking-wide uppercase">
              {" Home "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"group" as MaterialIconName} />
            </View>
            <Text className="text-[10px] font-medium leading-normal tracking-wide uppercase">
              {" Community "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"featured_seasonal_and_gifts" as MaterialIconName} />
            </View>
            <Text className="text-[10px] font-bold leading-normal tracking-wide uppercase">
              {" Cards "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"person" as MaterialIconName} />
            </View>
            <Text className="text-[10px] font-medium leading-normal tracking-wide uppercase">
              {" Profile "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
