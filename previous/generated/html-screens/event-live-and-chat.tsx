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

export default function EventLiveAndChatScreen() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto border-x border-primary/10 bg-background-light dark:bg-background-dark">
        <View className="flex items-center px-4 py-3 justify-between border-b border-primary/10">
          <View className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"arrow_back" as MaterialIconName} />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center px-2 truncate">
            {" National Meetup Delhi - Live "}
          </Text>
          <View className="flex size-10 items-center justify-center rounded-full">
            <MaterialIcons className="" name={"share" as MaterialIconName} />
          </View>
        </View>
        <View className="bg-slate-900 w-full aspect-video relative">
          <View className="absolute inset-0 bg-cover bg-center opacity-80" />
          <View className="absolute top-4 left-4 flex items-center gap-2">
            <View className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Text className="size-1.5 bg-white rounded-full animate-pulse" />
              <Text>{" LIVE "}</Text>
            </View>
            <View className="bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
              <MaterialIcons className="text-xs" name={"visibility" as MaterialIconName} />
              <Text>{" 1.2k "}</Text>
            </View>
          </View>
          <TouchableOpacity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full size-16 bg-primary text-white shadow-xl" accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons className="text-4xl fill-1" name={"play_arrow" as MaterialIconName} />
          </TouchableOpacity>
          <View className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <View className="flex h-1.5 items-center justify-center mb-2 group/progress">
              <View className="h-1 flex-1 rounded-full bg-primary" />
              <View className="size-3 rounded-full bg-primary border-2 border-white shadow" />
              <View className="h-1 w-24 rounded-full bg-white/30" />
            </View>
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <MaterialIcons className="text-white text-xl" name={"pause" as MaterialIconName} />
                <MaterialIcons className="text-white text-xl" name={"volume_up" as MaterialIconName} />
                <Text className="text-white text-xs font-medium">
                  {"12:45 / 45:00"}
                </Text>
              </View>
              <MaterialIcons className="text-white text-xl" name={"fullscreen" as MaterialIconName} />
            </View>
          </View>
        </View>
        <View className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-primary/5">
          <View className="flex items-center gap-2">
            <MaterialIcons className="text-primary text-lg" name={"forum" as MaterialIconName} />
            <Text className="text-primary text-sm font-bold uppercase tracking-wider">
              {" Live Chat "}
            </Text>
          </View>
          <MaterialIcons className="text-slate-400 text-lg" name={"settings" as MaterialIconName} />
        </View>
        <View className="flex-1 overflow-y-auto p-4 space-y-6 bg-background-light dark:bg-background-dark">
          <View className="flex items-start gap-3">
            <View className="size-9 rounded-full bg-primary/20 flex-shrink-0 border border-primary/10 overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzeBXPip04-BdoaU6fVGzd3U4dpHLC-BDLuMmnIXJt_vFc3cdOacseaUzAj63sblhouL9LrmcIRj51VJsQ6GTg5PelDm3zAreHMizfwftehimW3ZQIyipVwozgt8hPmnxpKM-TVFv39bl9qDra-gmBP32QoNfExwrSvvZcAAYVW5V-NSvz0UVFDNc0zDqw2Qpb1VggZlymmR1gXwMsqD0YNqKYSTd8oz50BuZRwG9eMVX405U_5hGet2LGHmhau9C3XjnOtiykxowB" }} accessibilityLabel="Rajesh Kumar avatar" />
            </View>
            <View className="flex flex-col gap-1.5 max-w-[85%]">
              <View className="flex items-center gap-2">
                <Text className="text-primary font-bold text-xs">
                  {"Rajesh Kumar"}
                </Text>
                <Text className="text-[10px] text-slate-400">
                  {"14:02"}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-800 rounded-tr-xl rounded-br-xl rounded-bl-xl px-3 py-2 shadow-sm border border-primary/5">
                <Text className="text-sm leading-relaxed">
                  {" Namaste everyone! Great to see so many cobblers here from all over the country. This session is very informative. "}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex items-start gap-3">
            <View className="size-9 rounded-full bg-primary/20 flex-shrink-0 border border-primary/10 overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0y_IUjHYoOjpfOev5k-2OJVA5UC7SE5pb0YY-9ZU7gpyDFGEJf1uHj2nwHlyiR3MNa9CSE0FTLjEnxHxDyFKog1uD6qFFF9lnsaJYvV1Vyn6rORS4DSMDy5oPly8xMjuygiTfsHV7xk8KFREBUAPPSoEemr6-M6uiJNi5a_RKGq_q8_7PAx0FhQtQUGqphvz0RB-gMW4OOUWLnBRgDDaIrxnB2gE0XQSC9f5p3TXKpZHKEOzeTQVsQ4oEEv3--utH_eC8J8hDJmZ6" }} accessibilityLabel="Sunita Devi avatar" />
            </View>
            <View className="flex flex-col gap-1.5 max-w-[85%]">
              <View className="flex items-center gap-2">
                <Text className="text-primary font-bold text-xs">
                  {"Sunita Devi"}
                </Text>
                <Text className="text-[10px] text-slate-400">
                  {"14:05"}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-800 rounded-tr-xl rounded-br-xl rounded-bl-xl px-3 py-2 shadow-sm border border-primary/5">
                <Text className="text-sm leading-relaxed">
                  {" The new leather stitching technique shown is very helpful. Will this recording be available later? 🙏 "}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex justify-center py-2">
            <Text className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-primary/5">
              {" Amit Sharma joined the stream "}
            </Text>
          </View>
          <View className="flex items-start gap-3">
            <View className="size-9 rounded-full bg-primary/20 flex-shrink-0 border border-primary/10 overflow-hidden">
              <Image className="w-full h-full object-cover" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE3oCajN3fBxmY_q-QIFWJjN5lEPGfFkU2K4u20ieALyayGPdhWVjCsuS5JZip-fh58XI-WzCiyufGrHQx0q_-VL14BmOP74noeDSdtXc_jul-RnusAN0VMNbFzOVMm3HtvdNrLqOyVYCm5oHc-_XQD2t2jFnd4qgUsojRtppn55Gz6zvE_y2PS0-VNkBVn8HBXbq-zjwL8YJTwFFWks4tqzrlwIjXs3g8SiHfIrioDeExySz5JjeV2m7PUspq2FhLBZQL_j0JRQVL" }} accessibilityLabel="Amit Sharma avatar" />
            </View>
            <View className="flex flex-col gap-1.5 max-w-[85%]">
              <View className="flex items-center gap-2">
                <Text className="text-primary font-bold text-xs">
                  {"Amit Sharma"}
                </Text>
                <Text className="text-[10px] text-slate-400">
                  {"14:08"}
                </Text>
              </View>
              <View className="bg-white dark:bg-slate-800 rounded-tr-xl rounded-br-xl rounded-bl-xl px-3 py-2 shadow-sm border border-primary/5">
                <Text className="text-sm leading-relaxed">
                  {" Hello everyone! Watching from Jaipur. Excited to learn about the new government schemes. "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="p-4 border-t border-primary/10 bg-white dark:bg-slate-900/50">
          <View className="flex items-center gap-2">
            <View className="flex-1 relative">
              <TextInput className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-full text-sm outline-none" placeholder="Type your message..." />
              <View className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                <MaterialIcons className="text-xl" name={"mood" as MaterialIconName} />
              </View>
            </View>
            <TouchableOpacity className="size-11 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="fill-1" name={"send" as MaterialIconName} />
            </TouchableOpacity>
          </View>
          <View className="flex items-center gap-4 mt-3 px-2">
            <TouchableOpacity className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-lg" name={"card_giftcard" as MaterialIconName} />
              <Text>{" Support "}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" accessibilityRole="button" activeOpacity={0.85}>
              <MaterialIcons className="text-lg" name={"attachment" as MaterialIconName} />
              <Text>{" Attach "}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
