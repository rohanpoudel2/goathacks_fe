import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { z } from 'zod';

import { queryClient, useAddRequest } from '@/api';
import {
  ControlledInput,
  Pressable,
  SafeAreaView,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib';
import { useAppState } from '@/lib/hooks/open-first-time';
import { useThemeConfig } from '@/lib/use-theme-config';

const GOOGLE_API_KEY = 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs';

const schema = z.object({
  start_location: z.string().min(10, 'Please enter a valid "from" location'),
  end_location: z.string().min(10, 'Please enter a valid "to" location'),
  start_time: z.string().min(1, 'Leaving time is required'),
  creator_type: z.string().optional(),
  note: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

export default function AddRequest() {
  const [startDate, setStartDate] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const theme = useThemeConfig();

  useEffect(() => {
    const currentTime = new Date().toISOString();
    setValue('start_time', currentTime, { shouldValidate: true });
  }, [setValue]);

  const { sessionType } = useAppState();
  const { mutate: addRequest, isPending } = useAddRequest();

  const handleStartDateConfirm = (selectedDate: Date) => {
    setStartDate(selectedDate);
    setValue('start_time', selectedDate.toISOString(), {
      shouldValidate: true,
    });
    setStartPickerVisible(false);
  };

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_API_KEY}`
      );
      const result = await response.json();

      if (result.status === 'OK' && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        console.error('Failed to fetch coordinates:', result.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const onSubmit = async (data: FormType) => {
    showMessage({ message: 'Fetching location data...', type: 'info' });
    const startCoords = await getCoordinates(data.start_location);
    const endCoords = await getCoordinates(data.end_location);

    if (!startCoords || !endCoords) {
      showErrorMessage('Failed to get location coordinates.');
      return;
    }

    const endTime = dayjs(data.start_time).add(1, 'hour').toISOString();

    const requestData = {
      ...data,
      destination_location: data.end_location,
      end_time: endTime,
      start_latitude: startCoords.latitude,
      start_longitude: startCoords.longitude,
      destination_latitude: endCoords.latitude,
      destination_longitude: endCoords.longitude,
      creator_type: sessionType,
    };

    addRequest(requestData, {
      onSuccess: () => {
        showMessage({ message: 'Post added successfully', type: 'success' });
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        router.replace('/');
      },
      onError: () => {
        showErrorMessage('Error adding request');
      },
    });
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme.dark ? 'bg-dark' : 'bg-gray-50'} p-4`}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View className="mb-8 flex-row items-center justify-between">
        <Link href="../">
          <Entypo
            name="circle-with-cross"
            size={32}
            color={theme.dark ? 'white' : 'black'}
          />
        </Link>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="rounded-md bg-orange-500 px-2 py-1"
        >
          <Text className="text-xl font-semibold">
            {translate('request.post')}
          </Text>
        </Pressable>
      </View>

      <View>
        <Text className="mb-4 text-4xl font-bold text-gray-900">
          {translate('request.add_new_request')}
        </Text>

        <View className="mb-20">
          <Text className="mb-2 font-medium text-gray-700">
            {translate('request.from')}
          </Text>
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
              key: GOOGLE_API_KEY,
              components: 'country:us',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={{
              textInput: {
                backgroundColor: theme.dark ? '#474747' : '#FFF',
                color: theme.dark ? '#FFF' : '#000',
              },
              listView: {
                position: 'absolute',
                top: 50,
                backgroundColor: theme.dark ? '#474747' : '#FFF',
                zIndex: 10,
              },
            }}
          />
          {errors.start_location && (
            <Text className="absolute bottom-[-65px] text-sm text-red-500">
              {errors.start_location.message}
            </Text>
          )}
        </View>

        <View className="mb-20">
          <Text className="mb-2 font-medium text-gray-700">
            {translate('request.to')}
          </Text>
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
              key: GOOGLE_API_KEY,
              components: 'country:us',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={{
              textInput: {
                backgroundColor: theme.dark ? '#474747' : '#FFF',
                color: theme.dark ? '#FFF' : '#000',
              },
              listView: {
                position: 'absolute',
                top: 50,
                backgroundColor: '#FFF',
                zIndex: 10,
              },
            }}
          />
          {errors.end_location && (
            <Text className="absolute bottom-[-65px] text-sm text-red-500">
              {errors.end_location.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="font-medium text-gray-700">
            {translate('request.leaving_time')}:
          </Text>
          <Text
            className={`mr-auto mt-2 ${theme.dark ? 'bg-gray-800' : 'bg-white'} p-4 text-gray-700 underline`}
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

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">
            {translate('request.note')}
          </Text>
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
