import dayjs from 'dayjs';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Linking, Pressable } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { useRequest } from '@/api';
import {
  ActivityIndicator,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';

const GOOGLE_API_KEY = 'AIzaSyCU4WcQn2EeerueIzjtHydTypx4Uw4g3qs';

export default function Request() {
  const local = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useRequest({
    //@ts-ignore
    variables: { id: local.id },
  });

  const [startCoords, setStartCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [endCoords, setEndCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    if (data?.start_location) {
      fetchCoordinates(data.start_location, setStartCoords);
    }
    if (data?.destination_location) {
      fetchCoordinates(data.destination_location, setEndCoords);
    }
  }, [data?.start_location, data?.destination_location]);

  useEffect(() => {
    if (startCoords && endCoords) {
      fetchRoute();
    }
  }, [startCoords, endCoords]);

  // Function to fetch coordinates from Google Maps API
  const fetchCoordinates = async (
    address: string,
    setCoords: (coords: { latitude: number; longitude: number }) => void
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_API_KEY}`
      );
      const result = await response.json();

      if (result.status === 'OK' && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        setCoords({
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        console.error('Failed to fetch coordinates:', result.status);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // Function to fetch route between start and end locations
  const [estimatedEndTime, setEstimatedEndTime] = useState<string | null>(null);
  const theme = useThemeConfig();
  const fetchRoute = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords?.latitude},${startCoords?.longitude}&destination=${endCoords?.latitude},${endCoords?.longitude}&key=${GOOGLE_API_KEY}`
      );
      const result = await response.json();

      if (result.status === 'OK') {
        const points = result.routes[0].overview_polyline.points;
        setRouteCoordinates(decodePolyline(points));

        // Extracting duration in seconds from the first route
        const durationInSeconds = result.routes[0].legs[0].duration.value;

        // Calculate estimated arrival time
        const startTime = dayjs(data.start_time);
        const endTime = startTime.add(durationInSeconds, 'second');
        setEstimatedEndTime(endTime.format('h:mm A'));
      } else {
        console.error('Failed to fetch route:', result.status);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Function to decode polyline
  const decodePolyline = (encoded: string) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading request</Text>
      </View>
    );
  }

  return (
    <>
      <MapView
        style={{ width: '100%', height: '30%' }}
        initialRegion={{
          latitude: startCoords?.latitude || 41.599998,
          longitude: startCoords?.longitude || -72.699997,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={
          startCoords
            ? {
                latitude: startCoords.latitude,
                longitude: startCoords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {startCoords && (
          <Marker
            coordinate={startCoords}
            title="Start Location"
            pinColor="green"
          />
        )}
        {endCoords && (
          <Marker coordinate={endCoords} title="End Location" pinColor="red" />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        )}
      </MapView>
      <View className={`flex-1 ${theme.dark ? 'bg-black' : 'bg-gray-50'}  p-4`}>
        <Stack.Screen options={{ title: 'Request', headerBackTitle: 'Home' }} />
        <Text className="mb-4 text-2xl font-bold text-gray-900">
          {translate('request.request_creator')}:{' '}
          <Text className="text-2xl">
            {data.creator_type.charAt(0).toUpperCase() +
              data.creator_type.slice(1)}
          </Text>
        </Text>
        <View className="gap-5 space-y-4">
          <View
            className={`gap-10 rounded-lg border border-gray-300 ${theme.dark ? 'bg-gray-800' : 'bg-white'}  p-4 shadow-sm`}
          >
            <View>
              <Text className="text-lg font-semibold text-gray-800">From:</Text>
              <Text className="">{data.start_location}</Text>
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-800">To:</Text>
              <Text className="">{data.destination_location}</Text>
            </View>
          </View>
          <View
            className={`flex-row justify-between rounded-lg border border-gray-300 ${theme.dark ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm`}
          >
            <View>
              <Text className="text-sm font-medium text-gray-600">
                {translate('request.depart')}
              </Text>
              <Text className="text-lg font-bold text-gray-800">
                {dayjs(data.start_time).format('h:mm A')}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-600">
                {translate('request.estimated_arrival')}
              </Text>
              <Text className="text-lg font-bold text-gray-800">
                {estimatedEndTime ? estimatedEndTime : 'Calculating...'}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className={`mt-5 h-10 w-full  items-center justify-center bg-orange-500`}
          onPress={() =>
            Linking.openURL(
              `https://api.whatsapp.com/send?phone=1${data?.creator_phone_number}&text=Hey!, I'm interested to ride with you from ${data.start_location} to ${data.destination_location}.`
            )
          }
        >
          <Text className="font-bold text-white">I'm Interested</Text>
        </Pressable>
      </View>
    </>
  );
}
