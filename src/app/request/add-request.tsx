import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Location from 'expo-location';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { z } from 'zod';

import { queryClient, useAddRequest } from '@/api';
import {
  Button,
  ControlledInput,
  SafeAreaView,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  start_location: z.string().min(10, 'Please enter a valid "from" location'),
  end_location: z.string().min(10, 'Please enter a valid "to" location'),
  start_time: z.string().min(1, 'Leaving time is required'),
  end_time: z.string().min(1, 'End time is required'),
  note: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

export default function AddRequest() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('THE STATUS', status);
    })();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { mutate: addRequest, isPending } = useAddRequest();

  const handleStartDateConfirm = (selectedDate: Date) => {
    setStartDate(selectedDate);
    setValue('start_time', selectedDate.toISOString(), {
      shouldValidate: true,
    });
    setStartPickerVisible(false);
  };

  const handleEndDateConfirm = (selectedDate: Date) => {
    setEndDate(selectedDate);
    setValue('end_time', selectedDate.toISOString(), { shouldValidate: true });
    setEndPickerVisible(false);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Allow the app to use the location services'
      );
      return null;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const address = response
      .map(
        (item) =>
          `${item.name || ''} ${item.city || ''} ${item.postalCode || ''}`
      )
      .join(', ');

    return { latitude, longitude, address };
  };

  const onSubmit = async (data: FormType) => {
    const location = await getCurrentLocation();

    if (!location) {
      showErrorMessage('Unable to fetch your location.');
      return;
    }

    const { latitude, longitude, address } = location;

    const requestData = {
      ...data,
      creator_type: 'passenger',
      user_latitude: latitude,
      user_longitude: longitude,
      user_address: address,
    };

    addRequest(requestData, {
      onSuccess: () => {
        showMessage({
          message: 'Post added successfully',
          type: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['requests'] });
      },
      onError: () => {
        showErrorMessage('Error adding request');
      },
    });
  };

  console.log('LADO: ', getCurrentLocation());

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
            placeholder="Where from?"
            minLength={4}
            fetchDetails={true}
            onPress={(data) =>
              setValue('start_location', data.description, {
                shouldValidate: true,
              })
            }
            query={{
              key: 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={{
              listView: {
                position: 'absolute',
                backgroundColor: '#FFF',
                zIndex: 10,
              },
            }}
          />
          {errors.start_location && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.start_location.message}
            </Text>
          )}
        </View>

        <View className="mb-20">
          <Text className="mb-2 font-medium text-gray-700">To</Text>
          <GooglePlacesAutocomplete
            placeholder="Where to?"
            minLength={4}
            fetchDetails={true}
            onPress={(data) =>
              setValue('end_location', data.description, {
                shouldValidate: true,
              })
            }
            query={{
              key: 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={{
              listView: {
                position: 'absolute',
                backgroundColor: '#FFF',
                zIndex: 10,
              },
            }}
          />
          {errors.end_location && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.end_location.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="font-medium text-gray-700">Leaving Time:</Text>
          <Text
            className="text-gray-700 underline"
            onPress={() => setStartPickerVisible(true)}
          >
            {startDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {errors.start_time && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.start_time.message}
            </Text>
          )}
        </View>
        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="time"
          date={startDate}
          onConfirm={handleStartDateConfirm}
          onCancel={() => setStartPickerVisible(false)}
        />

        <View className="mb-6">
          <Text className="font-medium text-gray-700">End Time:</Text>
          <Text
            className="text-gray-700 underline"
            onPress={() => setEndPickerVisible(true)}
          >
            {endDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {errors.end_time && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.end_time.message}
            </Text>
          )}
        </View>
        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="time"
          date={endDate}
          onConfirm={handleEndDateConfirm}
          onCancel={() => setEndPickerVisible(false)}
        />

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Note</Text>
          <ControlledInput
            name="note"
            control={control}
            placeholder="Add any additional information (optional)"
            multiline
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
