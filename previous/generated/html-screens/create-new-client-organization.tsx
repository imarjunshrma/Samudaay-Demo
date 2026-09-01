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

export default function CreateNewClientOrganizationScreen() {
  return (
    <View className="flex-1 bg-surface text-on-surface antialiased">
    <View className="absolute top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 text-stone-800 dark:text-stone-100 bg-stone-200/20 dark:bg-stone-800/20 border-b border-transparent">
      <View className="flex items-center justify-between px-6 py-4 w-full max-w-screen-2xl mx-auto">
        <View className="flex items-center gap-4">
          <TouchableOpacity className="p-2 dark:hover:bg-stone-800/50 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" arrow_back "}</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-serif">
            {" Client Onboarding "}
          </Text>
        </View>
        <View className="flex items-center gap-2">
          <TouchableOpacity className="p-2 dark:hover:bg-stone-800/50 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <Text>{" help "}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="flex pt-16">
        <View className="absolute left-0 top-0 h-full flex flex-col py-8 bg-stone-100 dark:bg-stone-950 h-screen w-72 border-r-0 mt-16 z-40">
          <View className="px-6 mb-8">
            <Text className="text-lg font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter">
              {" New Organization "}
            </Text>
          </View>
          <View className="flex-1 space-y-1">
            <TouchableOpacity className="flex items-center gap-3 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-bold rounded-r-full px-6 py-3 translate-x-1" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"domain" as MaterialIconName} />
              <Text className="text-sm">
                {"Organization Details"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center gap-3 text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 px-6 py-3 dark:hover:bg-stone-800/30" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"verified_user" as MaterialIconName} />
              <Text className="text-sm">
                {"Licensing & Seats"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center gap-3 text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 px-6 py-3 dark:hover:bg-stone-800/30" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"palette" as MaterialIconName} />
              <Text className="text-sm">
                {"Brand Configuration"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center gap-3 text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 px-6 py-3 dark:hover:bg-stone-800/30" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"rocket_launch" as MaterialIconName} />
              <Text className="text-sm">
                {"Review & Launch"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="ml-72 flex-1 px-12 py-20 max-w-5xl mx-auto">
          <View className="mb-16">
            <Text className="text-secondary font-medium tracking-widest uppercase text-xs mb-2">
              {" Step 1 of 4 "}
            </Text>
            <Text className="text-5xl font-serif text-primary leading-tight">
              {" Crafting a New Legacy "}
            </Text>
            <Text className="text-on-surface-variant text-lg mt-4 max-w-2xl">
              {" Initialize the digital presence for a new artisan partner. Every detail here sets the foundation for their bespoke workshop environment. "}
            </Text>
          </View>
          <View className="space-y-24">
            <View>
              <View className="flex items-baseline justify-between mb-8 border-b-0">
                <Text className="text-2xl font-serif text-primary">
                  {" 1. Organization Details "}
                </Text>
              </View>
              <View className="flex gap-x-12 gap-y-10 flex-col md:flex-row md:flex-wrap">
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"Organization Name"}</Text>
                  </View>
                  <TextInput className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 px-4 py-4 placeholder:text-stone-400" placeholder="e.g. Heirloom Cordwainers" />
                </View>
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"Internal Domain"}</Text>
                  </View>
                  <View className="flex items-center">
                    <TextInput className="flex-1 bg-surface-container-low border-0 border-b border-outline-variant/20 px-4 py-4 placeholder:text-stone-400" placeholder="heirloom" />
                    <Text className="px-4 py-4 bg-surface-container-high text-on-surface-variant text-sm border-b border-outline-variant/20">
                      {".artisan.studio"}
                    </Text>
                  </View>
                </View>
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"Primary Contact Name"}</Text>
                  </View>
                  <TextInput className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 px-4 py-4 placeholder:text-stone-400" placeholder="Full legal name" />
                </View>
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"Administrator Email"}</Text>
                  </View>
                  <TextInput className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 px-4 py-4 placeholder:text-stone-400" placeholder="admin@domain.com" />
                </View>
              </View>
            </View>
            <View className="bg-surface-container p-12 rounded-xl">
              <View className="flex items-baseline justify-between mb-8">
                <Text className="text-2xl font-serif text-primary">
                  {" 2. Licensing & Seats "}
                </Text>
              </View>
              <View className="flex gap-12 flex-col md:flex-row md:flex-wrap">
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"License Type"}</Text>
                  </View>
                  <TextInput className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 px-4 py-4 appearance-none" />
                </View>
                <View className="col-span-2 md:col-span-1 w-full md:w-[48%]">
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    <Text>{"Max User Count"}</Text>
                  </View>
                  <TextInput className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 px-4 py-4" placeholder="25" />
                </View>
              </View>
            </View>
            <View>
              <View className="flex items-baseline justify-between mb-8 border-b-0">
                <Text className="text-2xl font-serif text-primary">
                  {" 3. Feature Configuration "}
                </Text>
              </View>
              <View className="p-8 bg-surface-container-low border border-outline-variant/10 rounded-xl flex items-center justify-between">
                <View className="max-w-md">
                  <Text className="text-sm font-bold text-primary mb-1 block">
                    {"Allow Sub-communities"}
                  </Text>
                  <Text className="text-sm text-on-surface-variant">
                    {" Enables the creation of independent nested guilds within this organization’s workspace. "}
                  </Text>
                </View>
                <View className="relative inline-flex items-center">
                  <TextInput className="sr-only peer" />
                  <View className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                </View>
              </View>
            </View>
            <View>
              <View className="flex items-baseline justify-between mb-8 border-b-0">
                <Text className="text-2xl font-serif text-primary">
                  {" 4. Brand & Identity "}
                </Text>
              </View>
              <View className="flex md:grid-cols-2 gap-16 flex-col">
                <View>
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                    <Text>{"Client Logo Placeholder"}</Text>
                  </View>
                  <View className="aspect-video bg-surface-container-high rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 overflow-hidden relative">
                    <Image className="absolute inset-0 w-full h-full object-cover opacity-10" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0bjrv1TajvMT0xe_W1p11gOqE2F8rlC3rkH947Wb0URbRX-6Nxt2ItxsOa3x9KOAHcYbdXM7b9PpVx3NbG6ScIdhm2cl6hna6s_3Pol8k0wmAOg-kFpYGT8IVsLjTs-XtxDaIH8WwuXmqsFF1RolLh6csBjbkl04H1L9d6tDoF2vp_NYwApVzUxMNneL-oi4tCGkmVLFD50EG1mrNESZ_-o9ywxXhcRD3mMjCS0pG2DoP6gxwXYzFIwpNB1Pbl1x-HRealyXVpp7J" }} accessibilityLabel="Close-up texture of high quality vegetable tanned leather in warm brown tones with visible grain and natural imperfections" />
                    <MaterialIcons className="text-4xl text-primary mb-2" name={"upload_file" as MaterialIconName} />
                    <Text className="text-sm text-primary font-medium">
                      {"Click to upload brand asset"}
                    </Text>
                    <Text className="text-[10px] text-on-surface-variant uppercase mt-1">
                      {"SVG, PNG, JPG (Max 5MB)"}
                    </Text>
                  </View>
                </View>
                <View>
                  <View className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                    <Text>{"Signature Color Palette"}</Text>
                  </View>
                  <View className="flex gap-4 flex-col md:flex-row md:flex-wrap">
                    <TouchableOpacity className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-primary rounded-lg w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                      <View className="w-8 h-8 rounded-full bg-primary shadow-sm" />
                      <Text className="text-xs font-bold uppercase tracking-tighter">
                        {"Artisan Brown"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-transparent rounded-lg w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                      <View className="w-8 h-8 rounded-full bg-secondary shadow-sm" />
                      <Text className="text-xs font-bold uppercase tracking-tighter">
                        {"Flame Tan"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-transparent rounded-lg w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                      <View className="w-8 h-8 rounded-full bg-tertiary shadow-sm" />
                      <Text className="text-xs font-bold uppercase tracking-tighter">
                        {"Iron Patina"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-transparent rounded-lg w-full md:w-[48%]" accessibilityRole="button" activeOpacity={0.85}>
                      <View className="w-8 h-8 rounded-full bg-secondary-container shadow-sm" />
                      <Text className="text-xs font-bold uppercase tracking-tighter">
                        {"Workshop Honey"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View className="pt-12 border-t border-outline-variant/10 flex justify-between items-center">
              <TouchableOpacity className="text-on-surface-variant font-bold uppercase tracking-widest text-xs flex items-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"close" as MaterialIconName} />
                <Text>{" Discard Draft "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary text-on-primary px-10 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-4 shadow-xl shadow-primary/10" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Save & Launch Organization "}</Text>
                <MaterialIcons className="" name={"rocket_launch" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 mt-auto">
        <View className="flex justify-between items-center px-12 py-6 w-full max-w-screen-2xl mx-auto">
          <Text className="text-[10px] uppercase tracking-widest Manrope text-stone-500 dark:text-stone-400">
            {"© 2024 Artisan SaaS Platforms. Confidential Superadmin Console."}
          </Text>
          <View className="flex gap-8">
            <TouchableOpacity className="text-[10px] uppercase tracking-widest Manrope text-stone-400 dark:hover:text-stone-100 underline-offset-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"Documentation"}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="text-[10px] uppercase tracking-widest Manrope text-stone-400 dark:hover:text-stone-100 underline-offset-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"Support"}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="text-[10px] uppercase tracking-widest Manrope text-stone-400 dark:hover:text-stone-100 underline-offset-4" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{"System Status"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
