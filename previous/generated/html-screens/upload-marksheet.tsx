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

export default function UploadMarksheetScreen() {
  return (
    <View className="flex-1 bg-background text-on-surface font-body min-h-screen pb-32">
    <View className="absolute top-0 w-full z-50 bg-[#f1edea]/80 dark:bg-[#1a1a1a]/80 shadow-none flex justify-between items-center px-6 py-4">
      <View className="flex items-center gap-4">
        <TouchableOpacity className="text-[#46291e] dark:text-[#f1edea]" accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
        </TouchableOpacity>
        <Text className="font-serif text-2xl font-medium Newsreader text-[#46291e] dark:text-[#f1edea]">
          {" Upload Marksheet "}
        </Text>
      </View>
      <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20">
        <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRKSH5XU8UPNkK6XIrI-R-9C-aeHYhCQkeFYD8VvT-eAEV7OM2G2vqj1YOuN6n9dFjbfrdKY7tbDsXGUM_L94gOFhk5KsrvBnSYx9pkfmZ_em0cy97PCdaLoy4MZAMNW7yAWrMN8b1gu_nhcAvDPhgeAII85GnoIYOl0gLUGcxXH9j1rDOH2XHe0x29fAagdiT0BQ9vj6uTsIPbkXBXCuQByBrMhuX8ALADVQVWGJO3LoXkpAMtnVp2E-3Xbn_wkj-hAw51xijOrSt" }} accessibilityLabel="Portrait of a middle-aged Indian craftsman with a warm smile, wearing a traditional cotton shirt in a workshop setting" />
      </View>
    </View>
    <View className="absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#f1edea]/90 dark:bg-[#1a1a1a]/90 border-t border-[#46291e]/10 dark:border-[#f1edea]/10 shadow-[0_-4px_24px_rgba(70,41,30,0.06)] z-50">
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 px-4 py-2 dark:hover:text-[#964900]" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"home" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-semibold tracking-wider uppercase Manrope">
          {"Home"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center bg-[#46291e] text-[#f1edea] rounded-xl px-4 py-2" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"school" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-semibold tracking-wider uppercase Manrope">
          {"Education"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 px-4 py-2 dark:hover:text-[#964900]" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"family_restroom" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-semibold tracking-wider uppercase Manrope">
          {"Family"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-col items-center justify-center text-[#46291e]/50 dark:text-[#f1edea]/50 px-4 py-2 dark:hover:text-[#964900]" accessibilityRole="button" activeOpacity={0.85}>
        <MaterialIcons className="" name={"mail" as MaterialIconName} />
        <Text className="font-sans text-[11px] font-semibold tracking-wider uppercase Manrope">
          {"Inbox"}
        </Text>
      </TouchableOpacity>
    </View>
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="pt-24 px-6 max-w-md mx-auto">
        <View className="mb-10">
          <View className="flex items-baseline justify-between mb-4">
            <Text className="font-headline text-xl text-primary font-semibold">
              {" Select Child "}
            </Text>
            <Text className="text-xs font-label uppercase tracking-widest text-secondary font-bold">
              {"Step 1 of 3"}
            </Text>
          </View>
          <View className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            <TouchableOpacity className="flex-shrink-0 flex flex-col items-center gap-3" accessibilityRole="button" activeOpacity={0.85}>
              <View className="relative p-1 rounded-full border-2 border-secondary">
                <View className="w-16 h-16 rounded-full overflow-hidden">
                  <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA45AX4ztfYf8we4GJfJZ5qxyTDDbcWWe2UgagNx1Mf5y3Axir7lkyTr6VNQE82IO1CF7aw9rmnmsZe59dlXgbgzsmW853opv-o8OO5hN0zhnhEDxjnmwyN5mD1UnYdMPbrpiO4fzZLgEi44Bx8VQtbnyrYGLRFjMphOol4vm6oP3X05XbfANjWBXCqpvzinT_YwGP5qAmWl4xiTQJKL81Tp6GZX0OlANtAjG_Iw3CO9dQMOmURR_bGOXdDRU7YYedtDHevzGAR-b0" }} accessibilityLabel="Close-up portrait of a young Indian boy named Arjun, smiling brightly, outdoors in soft daylight" />
                </View>
                <View className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-0.5 flex items-center justify-center">
                  <MaterialIcons className="text-xs" name={"check_circle" as MaterialIconName} />
                </View>
              </View>
              <Text className="text-sm font-semibold text-primary">
                {"Arjun Mehta"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-shrink-0 flex flex-col items-center gap-3 opacity-60" accessibilityRole="button" activeOpacity={0.85}>
              <View className="p-1 rounded-full border-2 border-transparent">
                <View className="w-16 h-16 rounded-full overflow-hidden">
                  <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE56nHoYn-omneX9FcYLonSWxBgJ5QlUluphzvNeKHRmR42LjU37RLbgQp1RrCeTADR-DP8kPzw0bK4lg_yToSLTecF2sAzpXooN4y3VnANO_C0wnBQBP2kCLTK5e4v_fnM8yNqXS6jWX4-ydC3EdcDQpY5KngurlV0oMP9ncf2l4XfJuvYgWUEM4DU7XzmnPiE6FNI4weFNeBkvGe3L11oq5OTmjSWJjSeNXOsjJlMOb5gkRExxExUah5CGdJpD2iVv17y_OFwyHL" }} accessibilityLabel="Close-up portrait of a young Indian girl named Diya, with braided hair, smiling gently in a library" />
                </View>
              </View>
              <Text className="text-sm font-medium text-on-surface-variant">
                {"Diya Patel"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-shrink-0 flex flex-col items-center gap-3" accessibilityRole="button" activeOpacity={0.85}>
              <View className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-outline">
                <MaterialIcons className="" name={"add" as MaterialIconName} />
              </View>
              <Text className="text-sm font-medium text-on-surface-variant">
                {"New"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mb-10">
          <Text className="font-headline text-xl text-primary font-semibold mb-4">
            {" Academic Year "}
          </Text>
          <View className="relative">
            <TextInput className="w-full bg-surface-container-low border-b border-outline-variant/40 py-4 px-1 text-on-surface font-body appearance-none" />
            <View className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
              <MaterialIcons className="" name={"unfold_more" as MaterialIconName} />
            </View>
          </View>
        </View>
        <View className="mb-10">
          <Text className="font-headline text-xl text-primary font-semibold mb-4">
            {" Document Upload "}
          </Text>
          <View className="block">
            <TextInput className="hidden" />
            <View className="border-2 border-dashed border-outline-variant rounded-xl bg-surface-container p-8 text-center">
              <View className="w-16 h-16 bg-secondary-fixed text-on-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                <MaterialIcons className="text-3xl" name={"cloud_upload" as MaterialIconName} />
              </View>
              <Text className="text-primary font-bold mb-1">
                {"Upload Marksheet"}
              </Text>
              <Text className="text-xs text-on-surface-variant font-medium">
                {" PDF, JPG, or PNG (Max 5MB) "}
              </Text>
            </View>
          </View>
          <View className="mt-6 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/10 flex items-center justify-between">
            <View className="flex items-center gap-4">
              <View className="w-10 h-10 bg-tertiary-container/20 text-tertiary rounded-lg flex items-center justify-center">
                <MaterialIcons className="" name={"description" as MaterialIconName} />
              </View>
              <View>
                <Text className="text-sm font-bold text-primary truncate max-w-[180px]">
                  {" Arjun_Grade_8_2024.pdf "}
                </Text>
                <Text className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  {" Ready for submission • 1.2 MB "}
                </Text>
              </View>
            </View>
            <View className="flex gap-2">
              <TouchableOpacity className="w-8 h-8 rounded-full text-error flex items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-xl" name={"delete_outline" as MaterialIconName} />
              </TouchableOpacity>
              <TouchableOpacity className="w-8 h-8 rounded-full text-secondary flex items-center justify-center" accessibilityRole="button" activeOpacity={0.85}>
                <MaterialIcons className="text-xl" name={"visibility" as MaterialIconName} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 w-full p-6 bg-surface/90 z-40">
          <TouchableOpacity className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 shadow-lg" accessibilityRole="button" activeOpacity={0.85}>
            <Text>
              {"Submit Marksheet"}
            </Text>
            <MaterialIcons className="" name={"send" as MaterialIconName} />
          </TouchableOpacity>
          <Text className="text-center text-[11px] text-on-surface-variant mt-3 font-medium uppercase tracking-widest">
            {" Academic Records • Master Artisan Community "}
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
