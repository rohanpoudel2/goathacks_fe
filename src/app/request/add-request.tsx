import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { z } from 'zod';

import {
  Button,
  ControlledInput,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  from: z.string().min(10, 'Please enter a valid "from" location'),
  to: z.string().min(10, 'Please enter a valid "to" location'),
  leaving: z.string().min(1, 'Leaving time is required'),
  wait_time: z.string().min(1, 'Wait time is required'),
  note: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

export default function AddRequest() {
  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);

  const { control, handleSubmit, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setValue(
      'leaving',
      selectedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    setPickerVisible(false);
  };

  const handleDateCancel = () => {
    setPickerVisible(false);
  };

  const onSubmit = (data: FormType) => {
    console.log('Form Data:', data);
  };

  return (
    <SafeAreaView className="flex-1 bg-red-50 p-4">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="mb-8 flex-row items-center justify-between">
        <Link href="../">
          <Entypo name="circle-with-cross" size={32} color="black" />
        </Link>
        <Button label="POST" onPress={handleSubmit(onSubmit)} />
      </View>

      <View>
        <Text className="mb-4 text-xl font-bold text-gray-900">
          Add New Request
        </Text>

        <View className="mb-20">
          <Text className="mb-2 font-medium text-gray-700">From</Text>
          <GooglePlacesAutocomplete
            placeholder="Where To ?"
            minLength={4}
            listViewDisplayed="auto"
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(details?.geometry.location, data);
            }}
            query={{
              key: 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            renderRow={(rowData) => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View>
                  <Text style={{ fontSize: 14 }}>{title}</Text>
                  <Text style={{ fontSize: 14 }}>{address}</Text>
                </View>
              );
            }}
            styles={{
              listView: {
                position: 'absolute',
                backgroundColor: '#FFF',
                zIndex: 10,
              },
            }}
          />
        </View>

        <View className="mb-20">
          <Text className="mb-2 font-medium text-gray-700">To</Text>
          <GooglePlacesAutocomplete
            placeholder="Where To ?"
            minLength={4}
            listViewDisplayed="auto"
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(details?.geometry.location, data);
            }}
            query={{
              key: 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            renderRow={(rowData) => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View>
                  <Text style={{ fontSize: 14 }}>{title}</Text>
                  <Text style={{ fontSize: 14 }}>{address}</Text>
                </View>
              );
            }}
            styles={{
              listView: {
                position: 'absolute',
                backgroundColor: '#FFF',
                zIndex: 10,
              },
            }}
          />
        </View>

        <View className="mb-4 flex-row items-center gap-5">
          <Text className="font-medium text-gray-700">Leaving Time:</Text>
          <Text
            className="text-gray-700"
            onPress={() => setPickerVisible(true)}
          >
            {date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="time"
          date={date}
          onConfirm={handleDateConfirm}
          onCancel={handleDateCancel}
        />

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Wait Time</Text>
          <ControlledInput
            name="wait_time"
            control={control}
            placeholder="Enter wait time (e.g., 10 mins)"
            className="w-full rounded border border-gray-300 p-3"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Note</Text>
          <ControlledInput
            name="note"
            control={control}
            placeholder="Add any additional information (optional)"
            className="w-full rounded border border-gray-300 p-3"
            multiline
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
