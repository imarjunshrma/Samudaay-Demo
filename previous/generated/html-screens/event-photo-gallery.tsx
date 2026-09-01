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

export default function EventPhotoGalleryScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
    <View className="absolute top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
      <View className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
        <View className="flex size-10 shrink-0 items-center justify-center rounded-full">
          <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"arrow_back" as MaterialIconName} />
        </View>
        <View className="flex flex-col items-center">
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
            {" Annual Meetup 2023 "}
          </Text>
          <Text className="text-xs text-primary font-medium">
            {"October 12-14, 2023"}
          </Text>
        </View>
        <View className="flex size-10 items-center justify-center rounded-full">
          <MaterialIcons className="text-slate-900 dark:text-slate-100" name={"share" as MaterialIconName} />
        </View>
      </View>
      <View className="px-4 overflow-x-auto no-scrollbar max-w-2xl mx-auto w-full">
        <View className="flex gap-6 border-b border-primary/10">
          <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-primary py-3 px-1" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-primary text-sm font-bold">
              {"All"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent py-3 px-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-bold">
              {"Community"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent py-3 px-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-bold">
              {"Workshops"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent py-3 px-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-sm font-bold">
              {"Crafts"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 pb-6 pt-2">
      <View className="flex max-w-2xl mx-auto w-full">
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"calendar_today" as MaterialIconName} />
          <Text className="text-xs font-medium">
            {"Events"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"gallery_thumbnail" as MaterialIconName} />
          <Text className="text-xs font-medium">
            {"Gallery"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"search" as MaterialIconName} />
          <Text className="text-xs font-medium">
            {"Search"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"person" as MaterialIconName} />
          <Text className="text-xs font-medium">
            {"Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex-1 max-w-2xl mx-auto w-full p-4">
        <View className="flex md:grid-cols-3 gap-3 flex-col md:flex-row md:flex-wrap">
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
            <View className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent opacity-0 flex items-end p-3">
              <Text className="text-white text-xs font-medium">
                {"Community Dinner"}
              </Text>
            </View>
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
            <View className="absolute top-2 right-2">
              <Text className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {"Workshop"}
              </Text>
            </View>
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
          <View className="relative aspect-square overflow-hidden rounded-xl bg-primary/5 w-full md:w-[48%]">
            <View className="w-full h-full bg-center bg-no-repeat bg-cover" />
          </View>
        </View>
        <View className="absolute bottom-24 right-6 sm:right-1/2 sm:translate-x-64">
          <TouchableOpacity className="flex items-center justify-center rounded-full h-14 w-14 bg-primary text-white shadow-lg" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"photo_camera" as MaterialIconName} />
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
