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

export default function NotificationsScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl overflow-x-hidden">
        <View className="absolute top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 border-b border-primary/10">
          <View className="flex items-center p-4 justify-between">
            <View className="flex items-center gap-3">
              <View className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full">
                <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
              </View>
              <Text className="text-xl font-bold leading-tight tracking-tight">
                {" Notifications "}
              </Text>
            </View>
            <TouchableOpacity className="text-primary text-sm font-bold" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Mark all as read "}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex px-4 gap-8">
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-primary text-slate-900 dark:text-slate-100 pb-3 pt-2" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold">
                {"All"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2" accessibilityRole="button" activeOpacity={0.85}>
              <Text className="text-sm font-bold">
                {"Unread"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-col pb-24">
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-4 pb-2 pt-6">
            {" Today "}
          </Text>
          <View className="flex gap-4 bg-white dark:bg-white/5 mx-4 my-1 p-4 rounded-xl border border-primary/5 shadow-sm">
            <View className="relative flex-shrink-0">
              <View className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                <MaterialIcons className="" name={"shopping_bag" as MaterialIconName} />
              </View>
              <View className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white dark:border-background-dark" />
            </View>
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex justify-between items-start">
                <Text className="text-slate-900 dark:text-slate-100 text-sm font-bold">
                  {" New Order Received "}
                </Text>
                <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase">
                  {" 2m ago "}
                </Text>
              </View>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {" Order ID: #IN-9082. You have a new custom order for formal oxfords. "}
              </Text>
            </View>
          </View>
          <View className="flex gap-4 bg-white dark:bg-white/5 mx-4 my-1 p-4 rounded-xl border border-primary/5 shadow-sm">
            <View className="flex-shrink-0">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12 border border-primary/10" />
            </View>
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex justify-between items-start">
                <Text className="text-slate-900 dark:text-slate-100 text-sm font-bold">
                  {" New Tip in Community "}
                </Text>
                <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase">
                  {" 1h ago "}
                </Text>
              </View>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {" Ramesh shared: \"How to maintain leather shine in humid weather.\" "}
              </Text>
            </View>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-4 pb-2 pt-6">
            {" Yesterday "}
          </Text>
          <View className="flex gap-4 bg-slate-100/50 dark:bg-white/5 mx-4 my-1 p-4 rounded-xl opacity-80">
            <View className="flex-shrink-0">
              <View className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex size-12 items-center justify-center rounded-full">
                <MaterialIcons className="" name={"event" as MaterialIconName} />
              </View>
            </View>
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex justify-between items-start">
                <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">
                  {" Workshop Tomorrow "}
                </Text>
                <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase">
                  {" 1d ago "}
                </Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {" Reminder: \"Advanced Stitching Techniques\" starts at 10 AM. "}
              </Text>
            </View>
          </View>
          <View className="flex gap-4 bg-slate-100/50 dark:bg-white/5 mx-4 my-1 p-4 rounded-xl opacity-80">
            <View className="flex-shrink-0">
              <View className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12 border border-primary/10" />
            </View>
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex justify-between items-start">
                <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">
                  {" Payout Successful "}
                </Text>
                <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase">
                  {" 1d ago "}
                </Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {" ₹4,500 has been transferred to your linked bank account. "}
              </Text>
            </View>
          </View>
          <View className="flex gap-4 bg-slate-100/50 dark:bg-white/5 mx-4 my-1 p-4 rounded-xl opacity-80">
            <View className="flex-shrink-0">
              <View className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex size-12 items-center justify-center rounded-full">
                <MaterialIcons className="" name={"star" as MaterialIconName} />
              </View>
            </View>
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex justify-between items-start">
                <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">
                  {" New 5-Star Review "}
                </Text>
                <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase">
                  {" 2d ago "}
                </Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {" \"Excellent craftsmanship! The repairs were perfect and timely.\" - Amit S. "}
              </Text>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-light dark:bg-background-dark border-t border-primary/10 px-4 pb-6 pt-2 z-20">
          <View className="flex gap-2">
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"home" as MaterialIconName} />
              </View>
              <Text className="text-[10px] font-medium leading-normal">
                {"Home"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"shopping_bag" as MaterialIconName} />
              </View>
              <Text className="text-[10px] font-medium leading-normal">
                {"Orders"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"notifications" as MaterialIconName} />
              </View>
              <Text className="text-[10px] font-bold leading-normal">
                {"Notifications"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <View className="flex h-8 items-center justify-center">
                <MaterialIcons className="" name={"person" as MaterialIconName} />
              </View>
              <Text className="text-[10px] font-medium leading-normal">
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
