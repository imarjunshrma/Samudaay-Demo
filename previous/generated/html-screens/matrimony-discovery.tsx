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

export default function MatrimonyDiscoveryScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <View className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 absolute top-0 z-10">
          <View className="text-primary flex size-10 shrink-0 items-center justify-center">
            <MaterialIcons className="text-3xl" name={"menu" as MaterialIconName} />
          </View>
          <View className="flex-1 px-4">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
              {" Cobbler Matrimony "}
            </Text>
            <Text className="text-primary text-xs font-medium">
              {"Community Discovery"}
            </Text>
          </View>
          <View className="flex w-10 items-center justify-end">
            <TouchableOpacity className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="" name={"notifications" as MaterialIconName} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-3 bg-background-light dark:bg-background-dark">
          <View className="flex flex-col w-full">
            <View className="flex w-full items-stretch rounded-xl h-12 bg-primary/5 border border-primary/10 overflow-hidden">
              <View className="text-primary flex items-center justify-center px-4">
                <MaterialIcons className="" name={"search" as MaterialIconName} />
              </View>
              <TextInput className="form-input flex-1 border-none bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 text-base font-normal" placeholder="Search by name or ID" />
            </View>
          </View>
        </View>
        <View className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4 border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-slate-900 dark:text-slate-100 text-sm font-medium">
              {"Age"}
            </Text>
            <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4 border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-slate-900 dark:text-slate-100 text-sm font-medium">
              {"Education"}
            </Text>
            <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4 border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-slate-900 dark:text-slate-100 text-sm font-medium">
              {"Profession"}
            </Text>
            <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
          </TouchableOpacity>
          <TouchableOpacity className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4 border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
            <Text className="text-slate-900 dark:text-slate-100 text-sm font-medium">
              {"City"}
            </Text>
            <MaterialIcons className="text-sm" name={"expand_more" as MaterialIconName} />
          </TouchableOpacity>
        </View>
        <View className="px-4 py-2 @container">
          <View className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 @[480px]:flex-row @[480px]:items-center @[480px]:justify-between">
            <View className="flex flex-col gap-1">
              <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">
                {" Direct Family Connect "}
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm">
                {" Upgrade to view contact details of verified profiles. "}
              </Text>
            </View>
            <TouchableOpacity className="flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
              <Text>{" Upgrade Now "}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 px-4 py-4 space-y-4">
          <View className="flex flex-col bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
            <View className="relative h-64 w-full">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzqAidFFGRery8GMg2NSI5pSAKbnBdq0_1ufz-5pE6r9u5z-VYSjY-kozk_faG2e10Adb7YrNG6nUro8LZHP3jpdwCNJCP5QHhOL6akfLAoALxBEaGt6NUcGyWO2YVKimX1OmoetEB3H0pLhyYB74FmDQHyVI_KWDn7cW3IR9I3HMXEFmQLERxL5TiZdJ-jAyf-eHcz5M5YXjQu8H928XMQLC1CzlNCMBgyq97FOdggd1LPW7ZWHG5ZzRa5jqMYDfWbmCF_GQzoy00" }} accessibilityLabel="Portrait of a young Indian woman smiling" />
              <View className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-primary">
                <MaterialIcons className="fill-1" name={"favorite" as MaterialIconName} />
              </View>
              <View className="absolute bottom-3 left-3 bg-black/40 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <MaterialIcons className="text-xs" name={"verified" as MaterialIconName} />
                <Text>{" Verified Profile "}</Text>
              </View>
            </View>
            <View className="p-4 space-y-3">
              <View className="flex justify-between items-start">
                <View>
                  <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {" Ananya Verma, 24 "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"ID: CM-88291"}
                  </Text>
                </View>
                <Text className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {"Online Now"}
                </Text>
              </View>
              <View className="flex gap-y-2 text-sm flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"height" as MaterialIconName} />
                  <Text>
                    {"5' 4\" (162 cm)"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"school" as MaterialIconName} />
                  <Text>
                    {"M.Sc IT"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"work" as MaterialIconName} />
                  <Text>
                    {"Software Engineer"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"location_on" as MaterialIconName} />
                  <Text>
                    {"Pune, MH"}
                  </Text>
                </View>
              </View>
              <View className="pt-2 flex gap-2">
                <TouchableOpacity className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg text-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Connect Now "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex items-center justify-center w-12 bg-primary/10 text-primary rounded-lg border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"chat" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex flex-col bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
            <View className="relative h-64 w-full">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoNlN_eYNnyMLNtAVlV7a8w9X3NnXccV1f5SV-2srPezXSUJ7w8V0OW29RvABdG0s4f1HkAW8R2J7ghebAwSNF-IN_gDUm6vqjpxetVwdXEqeIfRD7FnJ2RGCxXOJqotZBhk0b916TjBNvaW8Oxb80qjArobgEhikaiMCd8nuYfTZC8yHcThpKo94qRJY1pAW6SEGWoYfqQM66Ds6AV1HHCPnuLXcc45p8oRl0hkl6VoiQa2LckVOCX1dURP1K0gHenK1gwdWa_vl7" }} accessibilityLabel="Portrait of a young Indian man in business casual" />
              <View className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-slate-400">
                <MaterialIcons className="" name={"favorite" as MaterialIconName} />
              </View>
            </View>
            <View className="p-4 space-y-3">
              <View className="flex justify-between items-start">
                <View>
                  <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {" Rahul Jadhav, 28 "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"ID: CM-77102"}
                  </Text>
                </View>
              </View>
              <View className="flex gap-y-2 text-sm flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"height" as MaterialIconName} />
                  <Text>
                    {"5' 9\" (175 cm)"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"school" as MaterialIconName} />
                  <Text>
                    {"MBA Finance"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"work" as MaterialIconName} />
                  <Text>
                    {"Bank Manager"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 text-slate-600 dark:text-slate-400 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"location_on" as MaterialIconName} />
                  <Text>
                    {"Mumbai, MH"}
                  </Text>
                </View>
              </View>
              <View className="pt-2 flex gap-2">
                <TouchableOpacity className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg text-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <Text>{" Connect Now "}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex items-center justify-center w-12 bg-primary/10 text-primary rounded-lg border border-primary/20" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"chat" as MaterialIconName} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex flex-col bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden border border-primary/10 shadow-sm opacity-90">
            <View className="relative h-64 w-full">
              <Image className="w-full h-full object-cover grayscale-[20%]" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-YWtqr-MsvTGl7VbjhK0wU9nKJWN9FZ9XV87F4D05n1gBxS7NcZtvRMxtvldGdmy_21A4RUZ8ILVk2e8JwcPO7Dd5amml8c98AoTK4ZlKz02uevAOAIkPry6tpAV_YIK0xXWZz4KOcdHOjTffvvEAwkKdQtZgpEjhbEym9jr93F0DZH9wCSgfSByDlsqkYYsIll0xTHXM-dlVg8BNXkQn3kx_P0gOqVbwIRiNBTRbLdTZbpoPLih1imznLSesB32jCXngjelfabwj" }} accessibilityLabel="Portrait of a traditional Indian woman in saree" />
              <View className="absolute inset-0 bg-background-dark/20 flex items-center justify-center">
                <View className="bg-white/90 dark:bg-background-dark/90 px-4 py-2 rounded-lg text-primary text-sm font-bold shadow-lg">
                  <Text>{" Premium Member Only "}</Text>
                </View>
              </View>
            </View>
            <View className="p-4 space-y-3">
              <View className="flex justify-between items-start">
                <View>
                  <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {" Priya K., 26 "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"ID: CM-90211"}
                  </Text>
                </View>
              </View>
              <View className="flex gap-y-2 text-sm blur-[1.5px] flex-col md:flex-row md:flex-wrap">
                <View className="flex items-center gap-2 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"height" as MaterialIconName} />
                  <Text>
                    {"5' 2\" (157 cm)"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"school" as MaterialIconName} />
                  <Text>
                    {"Bachelor of Arts"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"work" as MaterialIconName} />
                  <Text>
                    {"Teacher"}
                  </Text>
                </View>
                <View className="flex items-center gap-2 w-full md:w-[48%]">
                  <MaterialIcons className="text-lg" name={"location_on" as MaterialIconName} />
                  <Text>
                    {"Ahmedabad, GJ"}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-center text-slate-500 italic">
                {" Details hidden for your privacy level "}
              </Text>
            </View>
          </View>
        </View>
        <View className="h-20 bg-background-light dark:bg-background-dark" />
        <View className="absolute bottom-0 w-full flex gap-2 border-t border-primary/10 bg-white dark:bg-background-dark px-4 pb-4 pt-2 z-20">
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="fill-1" name={"explore" as MaterialIconName} />
            </View>
            <Text className="text-xs font-bold leading-normal tracking-[0.015em]">
              {" Discover "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"favorite" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Matches "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
            <View className="flex h-8 items-center justify-center">
              <MaterialIcons className="" name={"forum" as MaterialIconName} />
            </View>
            <Text className="text-xs font-medium leading-normal tracking-[0.015em]">
              {" Messages "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" accessibilityRole="button" activeOpacity={0.85}>
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
