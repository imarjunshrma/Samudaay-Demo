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

export default function CommunityChatsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-screen max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-hidden border-x border-primary/10">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
          <View className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center">
            <MaterialIcons className="" name={"menu" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
            {" Community Chats "}
          </Text>
          <View className="flex w-12 items-center justify-end">
            <TouchableOpacity className="flex max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-primary gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"group_add" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-3">
          <View className="flex flex-col min-w-40 h-12 w-full">
            <View className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <View className="text-primary/60 flex border-none bg-primary/10 items-center justify-center pl-4 rounded-l-lg border-r-0">
                <MaterialIcons className="" name={"search" as MaterialIconName} />
              </View>
              <TextInput className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-100 border-none bg-primary/10 h-full placeholder:text-primary/60 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search groups..." />
            </View>
          </View>
        </View>
        <View className="pb-3">
          <View className="flex border-b border-primary/10 px-4 gap-8">
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-primary text-slate-900 dark:text-slate-100 pb-[13px] pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold leading-normal tracking-[0.015em]">
                {" All Groups "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-primary/60 pb-[13px] pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold leading-normal tracking-[0.015em]">
                {" Unread "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-primary/60 pb-[13px] pt-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold leading-normal tracking-[0.015em]">
                {" Archived "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 overflow-y-auto">
          <View className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-3 justify-between">
            <View className="flex items-start gap-4">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[60px] w-[60px] shrink-0 border border-primary/20" />
              <View className="flex flex-1 flex-col justify-center">
                <View className="flex justify-between items-center">
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">
                    {" National Meetup Delhi "}
                  </Text>
                  <Text className="text-primary text-xs font-medium">
                    {"10:30 AM"}
                  </Text>
                </View>
                <Text className="text-primary/80 text-sm font-semibold truncate leading-normal">
                  {" Rajesh: Looking forward to seeing everyone! "}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {"24 members active"}
                </Text>
              </View>
            </View>
            <View className="shrink-0 flex items-center">
              <View className="flex size-6 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                <Text>{" 3 "}</Text>
              </View>
            </View>
          </View>
          <View className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-3 justify-between">
            <View className="flex items-start gap-4">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[60px] w-[60px] shrink-0 border border-primary/20" />
              <View className="flex flex-1 flex-col justify-center">
                <View className="flex justify-between items-center">
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">
                    {" Mumbai Local Group "}
                  </Text>
                  <Text className="text-slate-500 text-xs font-normal">
                    {"Yesterday"}
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm truncate leading-normal">
                  {" Amit: Does anyone know a good tanner in Dharavi? "}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {"112 members"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-3 justify-between">
            <View className="flex items-start gap-4">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[60px] w-[60px] shrink-0 border border-primary/20" />
              <View className="flex flex-1 flex-col justify-center">
                <View className="flex justify-between items-center">
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">
                    {" Leather Crafts Workshop "}
                  </Text>
                  <Text className="text-slate-500 text-xs font-normal">
                    {"Monday"}
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm truncate leading-normal">
                  {" Suresh: Shared a video: Pattern Cutting 101 "}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {"85 members"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex gap-4 bg-background-light dark:bg-background-dark px-4 py-3 justify-between">
            <View className="flex items-start gap-4">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[60px] w-[60px] shrink-0 border border-primary/20" />
              <View className="flex flex-1 flex-col justify-center">
                <View className="flex justify-between items-center">
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-medium leading-normal">
                    {" Southern Artisans Guild "}
                  </Text>
                  <Text className="text-slate-500 text-xs font-normal">
                    {"12 Oct"}
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm truncate leading-normal">
                  {" Venkatesh: The new batch of soles has arrived. "}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {"42 members"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity className="absolute bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="text-2xl" name={"chat" as MaterialIconName} />
        </TouchableOpacity>
        <View className="flex gap-2 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-6 pt-2 shrink-0">
          <TouchableOpacity className="just flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"home" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Home "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="just flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"chat_bubble" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Chats "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="just flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"storefront" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Market "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="just flex flex-1 flex-col items-center justify-end gap-1 text-primary/60" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"person" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Profile "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
