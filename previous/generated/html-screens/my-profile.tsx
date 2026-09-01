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

export default function MyProfileScreen() {
  return (
    <View className="flex-1 bg-surface text-on-surface mb-24">
    <View className="absolute top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between px-6 py-4">
      <View className="flex items-center gap-4">
        <TouchableOpacity className="text-orange-900 dark:text-orange-200 dark:hover:bg-stone-800/50 p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
        </TouchableOpacity>
        <Text className="font-serif italic text-xl text-orange-900 dark:text-orange-200">
          {" Profile "}
        </Text>
      </View>
      <View className="font-serif font-bold text-orange-950 dark:text-orange-50">
        <Text>{" IC Community "}</Text>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-stone-50 dark:bg-stone-950 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] z-50 border-t border-stone-200/30 dark:border-stone-800/30">
      <View className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-4 py-1 dark:hover:text-orange-200">
        <MaterialIcons className="" name={"newspaper" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">
          {"Feed"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-4 py-1 dark:hover:text-orange-200">
        <MaterialIcons className="" name={"group" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">
          {"Community"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center bg-orange-100/50 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 rounded-xl px-4 py-1">
        <MaterialIcons className="" name={"person" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">
          {"Profile"}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-4 py-1 dark:hover:text-orange-200">
        <MaterialIcons className="" name={"settings" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">
          {"Settings"}
        </Text>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
        <View className="flex flex-col items-center space-y-4">
          <View className="relative">
            <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container shadow-sm">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYoc9Ev32jOQfSa8Sg5ayqCCa0Kwb-2Tinp9fnoeQV-YO2Ow2TyvCnlhfRV0d3qrhCG5Vsx8WmveM2LEqAHKGsoehWA_70FaYGbNLDDESfVpBp9S7VoOfrK8NWh1fLd6E0VTYI9mf0LoLNlpfEJdmEvq5ZWNloVGly-7ycdfGGiQrY-9PZE9usJxog2xZ1SkPTCJXzoa86BXiGHDshlDiu49buCZvjlUpRO0R02CJoazf7OrILTLvLQkpRqQ1a6w5XlOKSUl2BcacV" }} accessibilityLabel="Rajesh Kumar" />
            </View>
            <View className="absolute bottom-1 right-1 bg-tertiary text-white rounded-full p-1.5 border-2 border-surface flex items-center justify-center">
              <MaterialIcons className="text-sm" name={"verified" as MaterialIconName} />
            </View>
          </View>
          <View className="text-center">
            <Text className="text-3xl font-bold text-primary tracking-tight">
              {" Rajesh Kumar "}
            </Text>
            <Text className="text-on-surface-variant font-medium tracking-wider text-sm font-label mt-1">
              {" MEMBER ID: IC-2024-8839 "}
            </Text>
            <Text className="inline-flex items-center px-3 py-1 mt-3 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest">
              {" Verified Artisan "}
            </Text>
          </View>
        </View>
        <View className="space-y-6">
          <View className="flex items-baseline justify-between">
            <Text className="text-2xl italic text-primary">
              {"Personal Details"}
            </Text>
            <View className="h-px flex-1 ml-4 bg-outline-variant/30" />
          </View>
          <View className="bg-surface-container-low p-6 rounded-xl space-y-6">
            <View className="flex md:grid-cols-2 gap-6 border-b border-outline-variant/20 pb-6 flex-col">
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Full Name (English)"}</Text>
                </View>
                <Text className="text-on-surface font-medium">
                  {"Rajesh Kumar"}
                </Text>
              </View>
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Full Name (Gujarati) / પૂરું નામ (ગુજરાતી)"}</Text>
                </View>
                <Text className="text-on-surface font-medium text-lg">
                  {"રાજેશ કુમાર"}
                </Text>
              </View>
            </View>
            <View className="flex md:grid-cols-2 gap-x-8 gap-y-6 flex-col">
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Father Name"}</Text>
                </View>
                <Text className="text-on-surface font-medium">
                  {"Suresh Kumar"}
                </Text>
              </View>
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Gender"}</Text>
                </View>
                <Text className="text-on-surface font-medium">
                  {"Male"}
                </Text>
              </View>
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Date of Birth"}</Text>
                </View>
                <Text className="text-on-surface font-medium">
                  {"12th August 1985"}
                </Text>
              </View>
              <View className="space-y-1">
                <View className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <Text>{"Occupation"}</Text>
                </View>
                <Text className="text-on-surface font-medium">
                  {"Master Cordwainer"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="space-y-6">
          <View className="flex items-baseline justify-between">
            <Text className="text-2xl italic text-primary">
              {"Contact & Location"}
            </Text>
            <View className="h-px flex-1 ml-4 bg-outline-variant/30" />
          </View>
          <View className="space-y-4">
            <View className="flex md:grid-cols-2 gap-4 flex-col">
              <View className="bg-surface-container p-5 rounded-xl flex items-center gap-4">
                <MaterialIcons className="text-secondary" name={"call" as MaterialIconName} />
                <View>
                  <View className="block text-[10px] font-bold uppercase text-on-surface-variant/60 tracking-tighter">
                    <Text>{"Mobile Number"}</Text>
                  </View>
                  <Text className="text-on-surface font-semibold">
                    {"+91 98765 43210"}
                  </Text>
                </View>
              </View>
              <View className="bg-surface-container p-5 rounded-xl flex items-center gap-4">
                <MaterialIcons className="text-secondary" name={"mail" as MaterialIconName} />
                <View>
                  <View className="block text-[10px] font-bold uppercase text-on-surface-variant/60 tracking-tighter">
                    <Text>{"Email Address"}</Text>
                  </View>
                  <Text className="text-on-surface font-semibold">
                    {" rajesh.kumar@artisan.in "}
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <View className="flex gap-4">
                <MaterialIcons className="text-secondary mt-1" name={"location_on" as MaterialIconName} />
                <View className="space-y-6 w-full">
                  <View className="space-y-4 border-b border-outline-variant/20 pb-4">
                    <View>
                      <View className="block text-xs font-bold uppercase text-on-surface-variant/60 mb-1">
                        <Text>{"Address (English)"}</Text>
                      </View>
                      <Text className="text-on-surface font-medium leading-relaxed">
                        {" 42, Leather Artisan Row, Dharavi Market "}
                      </Text>
                    </View>
                    <View>
                      <View className="block text-xs font-bold uppercase text-on-surface-variant/60 mb-1">
                        <Text>{"Address (Gujarati) / સરનામું (ગુજરાતી)"}</Text>
                      </View>
                      <Text className="text-on-surface font-medium leading-relaxed text-lg">
                        {" ૪૨, લેધર આર્ટિસન રો, ધારાવી માર્કેટ "}
                      </Text>
                    </View>
                  </View>
                  <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
                    <View className="w-full md:w-[48%]">
                      <View className="block text-xs font-bold uppercase text-on-surface-variant/60 mb-1">
                        <Text>{"City"}</Text>
                      </View>
                      <Text className="text-on-surface font-medium">
                        {"Mumbai"}
                      </Text>
                    </View>
                    <View className="w-full md:w-[48%]">
                      <View className="block text-xs font-bold uppercase text-on-surface-variant/60 mb-1">
                        <Text>{"Pincode"}</Text>
                      </View>
                      <Text className="text-on-surface font-medium">
                        {"400017"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="space-y-4">
          <Text className="text-2xl italic text-primary mb-6">
            {"Management"}
          </Text>
          <TouchableOpacity className="w-full flex items-center justify-between p-6 bg-surface-container-highest/40 rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex items-center gap-5">
              <View className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <MaterialIcons className="" name={"family_history" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-on-surface">
                  {"Manage Family Members"}
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  {" 4 Registered Members "}
                </Text>
              </View>
            </View>
            <MaterialIcons className="text-primary" name={"chevron_right" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="w-full flex items-center justify-between p-6 bg-surface-container-highest/40 rounded-xl text-left" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex items-center gap-5">
              <View className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <MaterialIcons className="" name={"folder_shared" as MaterialIconName} />
              </View>
              <View>
                <Text className="font-bold text-on-surface">
                  {"Document Management"}
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  {" View uploaded KYC documents "}
                </Text>
              </View>
            </View>
            <MaterialIcons className="text-primary" name={"chevron_right" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="pt-8 pb-12 flex flex-col items-center gap-6">
          <TouchableOpacity className="px-8 py-3 rounded-full border border-error text-error font-bold" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" Sign Out "}</Text>
          </TouchableOpacity>
          <Text className="text-xs text-on-surface-variant/40 text-center font-medium">
            {" Version 2.4.1 (Artisan Cordwain Edition)"}
            <View />
            {" Crafted with pride in India "}
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
