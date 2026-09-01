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

export default function ChildrenSEducationDirectoryScreen() {
  return (
    <View className="flex-1 bg-background text-on-surface selection:bg-secondary/30">
    <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 dark:bg-[#1a1614]/80">
      <View className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <View className="flex items-center gap-3">
          <MaterialIcons className="text-[#46291e] dark:text-[#d7ccc8]" name={"school" as MaterialIconName} />
          <Text className="text-2xl font-serif italic text-[#46291e] dark:text-[#f1edea]">
            {" Student Directory "}
          </Text>
        </View>
        <View className="flex items-center gap-4">
          <TouchableOpacity className="p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-[#46291e] dark:text-[#d7ccc8]" name={"search" as MaterialIconName} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#46291e]/10 to-transparent" />
    </View>
    <View className="absolute bottom-0 left-0 w-full z-50 bg-[#f1edea]/90 dark:bg-[#1a1614]/90 rounded-t-[2rem] border-t border-[#46291e]/10 shadow-[0_-4px_20px_rgba(70,41,30,0.08)]">
      <View className="max-w-7xl mx-auto flex justify-around items-center px-4 pt-3 pb-6">
        <TouchableOpacity className="flex flex-col items-center justify-center text-[#964900] dark:text-[#ffb74d] relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-[#964900] after:rounded-full" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="mb-1" name={"badge" as MaterialIconName} />
          <Text className="font-sans text-[11px] uppercase tracking-widest font-semibold">
            {"Students"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 dark:hover:text-[#f1edea]" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="mb-1" name={"analytics" as MaterialIconName} />
          <Text className="font-sans text-[11px] uppercase tracking-widest font-semibold">
            {"Reports"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 dark:hover:text-[#f1edea]" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="mb-1" name={"tune" as MaterialIconName} />
          <Text className="font-sans text-[11px] uppercase tracking-widest font-semibold">
            {"Filters"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 dark:hover:text-[#f1edea]" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="mb-1" name={"account_circle" as MaterialIconName} />
          <Text className="font-sans text-[11px] uppercase tracking-widest font-semibold">
            {"Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <View className="mb-12">
          <View className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <View className="max-w-xl w-full">
              <Text className="text-4xl font-serif mb-6 text-primary leading-tight">
                {" Registry of the "}
                <View />
                <Text className="italic">
                  {"Rising Generation"}
                </Text>
              </Text>
              <View className="relative">
                <TextInput className="w-full bg-surface-container-low border-b border-outline-variant/40 py-4 px-2 font-body text-lg" placeholder="Search by name (English or Gujarati)..." />
                <View className="absolute right-2 bottom-4">
                  <MaterialIcons className="text-outline" name={"person_search" as MaterialIconName} />
                </View>
              </View>
            </View>
            <View className="flex flex-wrap gap-3">
              <TouchableOpacity className="px-5 py-2 rounded-full bg-surface-container-highest text-primary font-label text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Class 1 "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-5 py-2 rounded-full bg-primary text-on-primary font-label text-sm shadow-lg shadow-primary/10" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Class 2 "}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-5 py-2 rounded-full bg-surface-container-highest text-primary font-label text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <Text>{" Class 3 "}</Text>
              </TouchableOpacity>
              <View className="w-[1px] h-8 bg-outline-variant/30 mx-2 hidden md:block" />
              <TouchableOpacity className="flex items-center gap-2 px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label text-sm" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-sm" name={"tune" as MaterialIconName} />
                <Text>{" Filters "}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 flex-col">
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFLP7g0ufaOAOMHs6_NsVMLe-1WH91s1PhbwEkJab9GrDOI0Le-F3EMNSTy9drWNg3cJ2kzLwYJhxM4AYAnbRGnLh3LL0BHSuhe0Bvfx-VrLLH9ip7jDfl-b2CM3NyF8Rbw6-BwWyrC-yNrKg9XFAjrQoawRjX4PBeMCPP-yDN7hOqhwLxnyluvkyoZQjVTzWq7RQmrXExXfx_A3XOrSEWRjb_KgPv4Gw0Y01nK1grY48eSsYuQbaf1gTQBAvr6Y-gsrvf1YgsmjrM" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 2"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Arjun Mehta"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" અર્જુન મહેતા "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Rajesh Mehta"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"St. Xavier's Academy"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden lg:mt-12">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXKczLHSdKLIsaA1eQBahYm0pnuvJa17EHx5uuOG6SupfM-TKg6kTeUlaGZqvWF3UzMHJFHZfuk3MS0J7LhrOa4Yc_5ezVVeWNP_8Ec-pCc7Cpb9-qmzRMbTWvtPQYYlRoVPltlcpZlUwgEsc8dnn3CRCc9E3IPkIT9ypxtKyH5b2WkybgH19fZ5X9MzXXwuJA-XTuYQPjIuyvGyyDmu4x8ruGoHtLhVo5BlbRUeIdbpcdFkwzUDDJp4UMVVGam0Y6D6Sm2CqpU5SX" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 2"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Diya Patel"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" દિયા પટેલ "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Sanjay Patel"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"Greenwood International"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtajG4GRIl5vZH9vmjnAICk-q169uFeR-ipQNESBdRJeY9FgUABtEymyyzYMcan6p54E5TUJvvFMVCQ8bYgYUoR3D7pCIVNGhsPr-YiWkoiFCrzmjou7t40eIyoBbvep48g5dSrMgKU3J0eWlb4LQEbLHmBu18T5o5Djz0m7QyVbUY5Ft8WVRUY6rfg3nTtqPi-j8-cyBwquAG56NE6R3LYPGkAZu6Rg9lb__9FID51tDI0eqoScIAZqarN9wirVgB_G-mtVq6hlfL" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 1"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Ishaan Shah"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" ઈશાન શાહ "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Amit Shah"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"Bright Future School"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden lg:-mt-12">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzYPz9UfPKtb4i1c_GqtnEIvdrNoak_5r1W35lEqFBoUb0EVRurEOXAcswSnMvZpP3S3T28Y97dX56AUSkBptLWPfoZt3tUbnaQhY27Z-UhBPWOfVCivqvtR8tLknu5ooQ-zrwznB31rjZKkHws6vxK17TrSQ2HMBv3uPOyYmZGTz9vUN_i9qjiABHhdhkK9vO6WImplBzuW4yYsPXAZmBDlIZgUY1JdjMMwPD2n6_2ldOZl38Ii1uxocaKAJzXgFbjTLSKIX3A8TW" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 3"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Ananya Joshi"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" અનન્યા જોશી "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Vikram Joshi"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"Hillcrest Primary"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzDwHZFJNDs7ysw5Ji7HXJOcicxqCJLV3yug32ENZYa3sCU24PNru-7Ml3T8o3pCz89-8p4lT1XFWPhyTA34Lmc4fH6_pt9sUuFpRKYrysq2BH1Bk3u0n6XVQ9i9ILcBnDRFXf5h1YMkQoxSkAsBUOFU-xct5Xdv51HiV8pdnSufc3RWXdF-uttNboikplc5Ofk_iOQJzQ6eJI51TRp_v24JJEbhn14qUjHVRrBwX8K46AyFFSER7ukL-1ee6gAdvFqugoelk23LcW" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 2"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Kavya Desai"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" કાવ્યા દેસાઈ "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Pranav Desai"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"Lotus Valley School"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden lg:mt-6">
            <View className="aspect-[4/3] overflow-hidden relative">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyoe_nszvxUUE0VC7syc3wEhntZwzQuPaonpQ07QstkDU512Z_ypWkeJGlW3lQPTXHmh-igTrhAdOFPU0XSX6_wLhi_W-uR10xdIk06uHFrZarYX85Ju8-Hy7NeSffexw6TUXWaxglB4R_PPZGhX5nCqNBp3BwRe73jtZKckO6KVNUBEU89eCroRVseNj2AtbjO_ELHmOes9Gvdu3Cw7UKMGa74jdfy-aPbmhGYUGGa9enbqe6N9U_NPUVlnjqF0Z7tOGZrkmzQX2h" }} accessibilityLabel="Child portrait" />
              <View className="absolute top-4 left-4">
                <Text className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] uppercase tracking-widest rounded-full">
                  {"Class 1"}
                </Text>
              </View>
            </View>
            <View className="p-8 flex flex-col flex-grow">
              <View className="flex justify-between items-start mb-4">
                <View>
                  <Text className="text-2xl font-serif text-primary">
                    {"Rohan Vyas"}
                  </Text>
                  <Text className="text-secondary font-serif italic text-lg opacity-80">
                    {" રોહન વ્યાસ "}
                  </Text>
                </View>
                <TouchableOpacity className="p-3 bg-white rounded-full text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"download" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="space-y-3 pt-4 border-t border-outline-variant/20">
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"Parent"}
                  </Text>
                  <Text className="text-primary font-body font-semibold">
                    {"Meera Vyas"}
                  </Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-on-surface-variant text-xs font-label uppercase tracking-tighter">
                    {"School"}
                  </Text>
                  <Text className="text-primary font-body text-sm">
                    {"Riverdale Public School"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
