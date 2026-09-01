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

export default function CreateNewEventAdminScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
      <View>
        <Text>{" {/* Header */} "}</Text>
        <View>
          <View>
            <View />
          </View>
          <View>
            <Text>{"Create New Event"}</Text>
          </View>
        </View>
        <View>
          <Text>{" {/* STEP 1 */} "}</Text>
          <View>
            <View>
              <View>
                <View>
                  <View>
                    <Text>{"1"}</Text>
                  </View>
                </View>
                <View>
                  <Text>{"Basic Info"}</Text>
                </View>
              </View>
              <View>
                <Text>{"Step 1 of 4"}</Text>
              </View>
            </View>
            <View>
              <Text>{"Event Title"}</Text>
            </View>
            <View />
            <View>
              <Text>{"Description"}</Text>
            </View>
            <View />
            <View>
              <Text>{"Event Type"}</Text>
            </View>
            <View />
          </View>
          <Text>{" {/* STEP 2 */} "}</Text>
          <View>
            <View>
              <View>
                <View>
                  <Text>{"2"}</Text>
                </View>
              </View>
              <View>
                <Text>{"Date & Time"}</Text>
              </View>
            </View>
            <View>
              <Text>{"Date"}</Text>
            </View>
            <View />
            <View>
              <Text>{"Start Time"}</Text>
            </View>
            <View />
            <View>
              <Text>{"End Time"}</Text>
            </View>
            <View />
          </View>
          <Text>{" {/* STEP 3 */} "}</Text>
          <View>
            <View>
              <View>
                <View>
                  <Text>{"3"}</Text>
                </View>
              </View>
              <View>
                <Text>{"Location"}</Text>
              </View>
            </View>
            <View>
              <Text>{"Venue Name"}</Text>
            </View>
            <View />
            <View>
              <Text>{"Address"}</Text>
            </View>
            <View />
            <View>
              <View />
              <View>
                <View>
                  <View />
                  <View>
                    <Text>{"Verify on Map"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text>{" {/* STEP 4 */} "}</Text>
          <View>
            <View>
              <View>
                <View>
                  <Text>{"4"}</Text>
                </View>
              </View>
              <View>
                <Text>{"Event Add-ons"}</Text>
              </View>
            </View>
            <Text>{" {/* Card 1 */} "}</Text>
            <View>
              <View>
                <View />
                <View />
              </View>
              <View>
                <View />
                <View />
              </View>
            </View>
            <Text>{" {/* Card 2 */} "}</Text>
            <View>
              <View>
                <View />
                <View />
              </View>
              <View>
                <View />
                <View />
              </View>
            </View>
            <View>
              <View>
                <Text>{" Add Another Option "}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text>{" {/* Bottom Buttons */} "}</Text>
        <View>
          <View>
            <View>
              <Text>{"Cancel"}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text>{"Create Event"}</Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
