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

export default function MatrimonyDiscovery2Screen() {
  return (
    <View className="flex-1 bg-background text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed">
    <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 dark:bg-stone-900/80">
      <View className="flex justify-between items-center px-6 py-4 w-full max-w-none">
        <View className="flex items-center gap-4">
          <TouchableOpacity className="text-[#46291e] dark:text-[#d7ccc8] p-2 rounded-full" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"menu" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-[#46291e] dark:text-[#d7ccc8] font-serif font-bold text-xl Newsreader italic text-2xl">
            {" Cobbler Matrimony "}
          </Text>
        </View>
        <View className="flex items-center gap-4">
          <TouchableOpacity className="text-[#603f33] dark:text-stone-400 p-2 rounded-full hidden md:flex" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="" name={"filter_list" as MaterialIconName} />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvwS71q-rDILNLST1cFRWUcj4XuSGyN2iqEGW7_BQvycPQYaJiiV07RR_UewMK9KmwjheyLJvF4Kxcjiy4q1bb45K0zMa_yDHsiTka5PtMxh3Hp1N2-bzd8efxRdr7RuyXMyiF--CngVjIM-q86QtlmwIndLvOidkC7--xSyqen0c0gNHAR2Uibe8IsvwuXI-mNn8Dfq5pMrQGnx5wII5Ee6I62WGGJOfkDkYx6QVH4Jj0qDU5eYBdoefCS4A4qmHM33DVcgzqZ0-p" }} accessibilityLabel="professional headshot of an artisan community member with warm studio lighting" />
          </View>
        </View>
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#f1edea] dark:bg-stone-950 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] border-t-[0.5px] border-[#46291e]/10">
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#964900] dark:text-[#ffb74d] font-bold" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"search" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope mt-1">
          {"Discover"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-stone-500 dark:hover:text-white" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"favorite" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope mt-1">
          {"Requests"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-stone-500 dark:hover:text-white relative" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"mail" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope mt-1">
          {"Messages"}
        </Text>
        <Text className="absolute -top-1 right-2 w-2 h-2 bg-secondary rounded-full" />
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#603f33] dark:text-stone-500 dark:hover:text-white" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"person" as MaterialIconName} />
        <Text className="font-sans text-[11px] uppercase tracking-wider Manrope mt-1">
          {"Account"}
        </Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity className="absolute bottom-28 right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-xl z-40 md:hidden" accessibilityRole="button" activeOpacity={0.85}>
      <MaterialIcons className="" name={"tune" as MaterialIconName} />
    </TouchableOpacity>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <View className="mb-12 md:mb-20">
          <View className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <View className="max-w-2xl">
              <Text className="font-headline text-5xl md:text-6xl text-primary leading-tight">
                {" Hand-picked Matches for Your Family "}
              </Text>
              <Text className="mt-6 text-on-surface-variant text-lg leading-relaxed max-w-lg">
                {" Celebrating heritage and craftsmanship through intentional connections. Find a partner who shares your values and your story. "}
              </Text>
            </View>
            <View className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              <Text className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm whitespace-nowrap">
                {"Newly Joined"}
              </Text>
              <Text className="px-4 py-2 rounded-full bg-surface-container-high text-primary font-label text-sm whitespace-nowrap">
                {"Highly Compatible"}
              </Text>
              <Text className="px-4 py-2 rounded-full bg-surface-container-high text-primary font-label text-sm whitespace-nowrap">
                {"Nearby Masters"}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex md:grid-cols-2 lg:grid-cols-3 gap-8 flex-col">
          <View className="relative bg-surface-container-low overflow-hidden rounded-xl">
            <View className="relative aspect-[4/5] overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZZtAPeAU_ry2pNH5eE1Rbp0R7mpcuVpOivr1ODmUVJcEfflOBTL-n4lPmV3u-nCfJi1HQp5dCXyWjFPSLNoHOxHU3zwUy_qDNes_g2S_YehkcxFrrXwkMhpmkcUKF5cKrmeuVMVrSeQMwFCjwvrsQ1jSazhvNxsJmv99DlipZu26pBv3Kl0wJvcpXmzP_wShom9xXcMuNhYfUqg8UK8AGXIiz57dm20Ml8fSGJfaNJeMVgEuKaCVpoH_yaqchfSgV7jFXEU0T8Fci" }} accessibilityLabel="portrait of a young woman in an artisan workshop setting with soft natural window lighting and warm tones" />
              <View className="absolute top-4 right-4 flex flex-col gap-2">
                <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-bright/80 flex items-center justify-center text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"favorite" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-primary/80 to-transparent">
                <Text className="font-headline text-3xl text-white">
                  {"Ananya Sharma"}
                </Text>
                <Text className="text-on-primary-container text-sm font-label uppercase tracking-widest mt-1">
                  {" Footwear Designer • London "}
                </Text>
              </View>
            </View>
            <View className="p-6">
              <View className="flex gap-y-4 mb-8 flex-col md:flex-row md:flex-wrap">
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Age & Height "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"27 yrs, 5'6\""}
                  </Text>
                </View>
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Education "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" MA Fashion Design "}
                  </Text>
                </View>
                <View className="col-span-2 w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Profession "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" Creative Lead at Artisan Collective "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-full py-4 bg-primary text-on-primary font-label rounded-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>
                  {"Send Connection Request"}
                </Text>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="relative bg-surface-container-low overflow-hidden rounded-xl">
            <View className="relative aspect-[4/5] overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNRjevXKXJ7s9wv5pXU9ejY2Y2jZ2K5EF2pg8clHArVbUxy2av4r2wEn6nmf8k7Q_Lml7PzanqMLRfud5TxM7o3sOhCXtot8WKqGvFkx2UtqA2AnyGUOJYDTC6vgymKys4es4ITzIcXvkZjjRWzOSzJWNemDwEJF-LUURLP0P31sJXgJMa0JG6mp6KgKtqhvaz1uGdDNvDjWwp13E8G1_56N8UOnuFsWFYV3M2diDSnoCJCxKelrCOxAaLcvnMrznr_GteFBBy8IDV" }} accessibilityLabel="handsome man in high-quality wool coat standing in a historic library with soft ambient lighting" />
              <View className="absolute top-4 right-4">
                <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-bright/80 flex items-center justify-center text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"favorite" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-primary/80 to-transparent">
                <Text className="font-headline text-3xl text-white">
                  {"Vikram Mehta"}
                </Text>
                <Text className="text-on-primary-container text-sm font-label uppercase tracking-widest mt-1">
                  {" Master Cordwainer • Milan "}
                </Text>
              </View>
            </View>
            <View className="p-6">
              <View className="flex gap-y-4 mb-8 flex-col md:flex-row md:flex-wrap">
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Age & Height "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"31 yrs, 5'11\""}
                  </Text>
                </View>
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Education "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" B.Tech, Leather Tech "}
                  </Text>
                </View>
                <View className="col-span-2 w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Profession "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" Owner, Bespoke Sole Studio "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-full py-4 bg-primary text-on-primary font-label rounded-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>
                  {"Send Connection Request"}
                </Text>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="relative bg-surface-container-low overflow-hidden rounded-xl">
            <View className="relative aspect-[4/5] overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCN9O1Hg-xvOmQp4Y-VpYjiScJMBl2gU6JWCiTJuo2p4GluMKJau3pCLkwr0Ivk1XFEnVemGG8VsQ24fB1lC4jBblcb61Qj-iiQu5ckQjwnbddCSOiiWFvwfPZ48Dw9uoI6XiNID9i0UcTxwZO4qOqj9swEeG_lB6uHaQYk3VfalSKmC0rH06QeSOWRKA3qGgrNSOTN33Et2QuE1y6i66i7ErvfQGNpAtNQ3cj-6a8PYTqDaj7IS3KeZGopJi1UVM_sI44XLkTvPs7" }} accessibilityLabel="portrait of a smiling woman with classic style in a sun-drenched outdoor courtyard with stone walls" />
              <View className="absolute top-4 right-4">
                <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-bright/80 flex items-center justify-center text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"favorite" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-primary/80 to-transparent">
                <Text className="font-headline text-3xl text-white">
                  {"Sana Khan"}
                </Text>
                <Text className="text-on-primary-container text-sm font-label uppercase tracking-widest mt-1">
                  {" Orthopedic Shoemaker • Dubai "}
                </Text>
              </View>
            </View>
            <View className="p-6">
              <View className="flex gap-y-4 mb-8 flex-col md:flex-row md:flex-wrap">
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Age & Height "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"29 yrs, 5'5\""}
                  </Text>
                </View>
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Education "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" Doctor of Podiatry "}
                  </Text>
                </View>
                <View className="col-span-2 w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Profession "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" Senior Consultant at FootHealth "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-full py-4 bg-primary text-on-primary font-label rounded-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>
                  {"Send Connection Request"}
                </Text>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="relative bg-surface-container-low overflow-hidden rounded-xl">
            <View className="relative aspect-[4/5] overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfhFxNWrpf3L8OVT_ISOJb9uE0Nvj5NyKhvsEshkd3EdZuTCuCeseTFVbvdX3CtE6qlFTUunqUh1LyX7pK92htaZrXgLrLeAhEVDfqIxFa5FhQbQGTXmdjWW0YgK1cOCG3iKa-kTTYaiouQPOAEtQJTytDPGAykXXSkNJLoxdph8koYWAMV5DHtylmxZH7IaR6R5YSwCQ1R8xvdj-Yt-Yo66_6WWw2GB-TplxFnf5CNuzKgHAfgYevyvlSgTWa2vyK41rV_FVa2tl7" }} accessibilityLabel="middle aged man with distinguished look wearing a linen shirt in a high-end leather workshop" />
              <View className="absolute top-4 right-4">
                <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-bright/80 flex items-center justify-center text-primary shadow-sm" accessibilityRole="button" activeOpacity={0.85}>
                  <MaterialIcons className="" name={"favorite" as MaterialIconName} />
                </TouchableOpacity>
              </View>
              <View className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-primary/80 to-transparent">
                <Text className="font-headline text-3xl text-white">
                  {"Rahul Deshmukh"}
                </Text>
                <Text className="text-on-primary-container text-sm font-label uppercase tracking-widest mt-1">
                  {" Tannery Heir • Kanpur "}
                </Text>
              </View>
            </View>
            <View className="p-6">
              <View className="flex gap-y-4 mb-8 flex-col md:flex-row md:flex-wrap">
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Age & Height "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"33 yrs, 6'0\""}
                  </Text>
                </View>
                <View className="w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Education "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {"MBA, INSEAD"}
                  </Text>
                </View>
                <View className="col-span-2 w-full md:w-[48%]">
                  <Text className="text-[10px] uppercase tracking-tighter text-outline font-bold mb-1">
                    {" Profession "}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {" Director, Deshmukh Leathers "}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="w-full py-4 bg-primary text-on-primary font-label rounded-lg flex items-center justify-center gap-2" accessibilityRole="button" activeOpacity={0.85}>
                <Text>
                  {"Send Connection Request"}
                </Text>
                <MaterialIcons className="text-sm" name={"send" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
