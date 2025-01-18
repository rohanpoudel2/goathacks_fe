import { Entypo } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  ControlledSelect,
  Image,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  profilePicture: z.string().optional(),
  gender: z.enum(['Male', 'Female'], {
    required_error: 'Gender is required',
  }),
});

export type FormType = z.infer<typeof schema>;

export type ProfileFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

const ProfileForm = ({ onSubmit = () => {} }: ProfileFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="p-4">
        <Link href="../">
          <Entypo name="circle-with-cross" size={32} color="black" />
        </Link>
        <Text
          testID="form-title"
          className="pb-6 text-center text-4xl font-bold"
        >
          Profile Info
        </Text>
        <View className="items-center justify-center">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1708364171715-16eaf0b2d8dc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            className="mx-auto mt-8 size-44 rounded-full"
          />
          <Button
            label="Edit Picture"
            variant="outline"
            className="mx-auto mt-4"
          />
        </View>

        <ControlledInput
          testID="name-input"
          control={control}
          name="name"
          label="Name"
        />

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
        />

        <ControlledSelect
          testID="gender-select"
          control={control}
          name="gender"
          label="Gender"
          options={genderOptions}
        />

        <Text>{`Joined: ${new Date().getDate().toString()}`}</Text>

        <Button
          testID="save-button"
          label="Save"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileForm;
