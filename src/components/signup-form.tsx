import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  ControlledSelect,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username must be at least 3 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
  first_name: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, 'First name must be at least 1 character'),
  last_name: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, 'Last name must be at least 1 character'),
  user_type: z
    .string({
      required_error: 'User type is required',
    })
    .regex(/^(passenger|driver)$/, 'User type must be passenger or driver'),
  phone_number: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  date_of_birth: z
    .string({
      required_error: 'Date of birth is required',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

export type FormType = z.infer<typeof schema>;

export type SignupFormProps = {
  errorMessage: string;
  onSubmit?: SubmitHandler<FormType>;
};

const userTypeOptions = [
  { label: 'Passenger', value: 'passenger' },
  { label: 'Driver', value: 'driver' },
];

export const SignupForm = ({
  errorMessage,
  onSubmit = () => {},
}: SignupFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Sign Up
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Create an account to get started! 🚀
          </Text>
        </View>

        <ControlledInput control={control} name="username" label="Username" />
        <ControlledInput control={control} name="email" label="Email" />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="********"
          secureTextEntry={true}
        />

        <View className="flex-row gap-5 space-x-4">
          <View style={{ flex: 1 }}>
            <ControlledInput
              control={control}
              name="first_name"
              label="First Name"
            />
          </View>
          <View style={{ flex: 1 }}>
            <ControlledInput
              control={control}
              name="last_name"
              label="Last Name"
            />
          </View>
        </View>

        <ControlledSelect
          control={control}
          name="user_type"
          label="User Type"
          options={userTypeOptions}
        />
        <ControlledInput
          control={control}
          name="phone_number"
          label="Phone Number"
          placeholder="+1234567890"
        />
        <ControlledInput
          control={control}
          name="date_of_birth"
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
        />

        <Button label="Sign Up" onPress={handleSubmit(onSubmit)} />

        {errorMessage && (
          <View className="mt-4">
            <Text className="text-center text-danger-600">{errorMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
