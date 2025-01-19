import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib';

const schema = z.object({
  username: z.string().optional(),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  errorMessage: string;
  onSubmit?: SubmitHandler<FormType>;
  onForgotPassword?: () => void;
};

export const LoginForm = ({
  errorMessage,
  onSubmit = () => {},
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold text-orange-700"
          >
            CommuteMate
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            {translate('onboarding.welcome')}! 👋
          </Text>
        </View>

        <ControlledInput control={control} name="username" label="Username" />

        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="********"
          secureTextEntry={true}
        />

        <Button label="Login" onPress={handleSubmit(onSubmit)} />

        {errorMessage && (
          <View className="mt-4">
            <Text className="text-center text-danger-600">{errorMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
