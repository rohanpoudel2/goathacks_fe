import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';

const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  onForgotPassword?: () => void;
};

export const LoginForm = ({
  onSubmit = () => {},
  onForgotPassword = () => {},
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold text-orange-700"
          >
            CommuteMate
          </Text>

          <Text className="mb-6 max-w-xs text-center text-ride-pale_green-100">
            Your Commute, Made Easy."
          </Text>
        </View>

        <ControlledInput
          testID="name"
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
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          placeholder="***"
          secureTextEntry={true}
        />

        <Button
          testID="login-button"
          label="Sign In"
          onPress={handleSubmit(onSubmit)}
        />

        <Button
          testID="signup-button"
          label="Sign Up!"
          onPress={handleSubmit(onSubmit)}
        />

        <TouchableOpacity onPress={onForgotPassword}>
          <Text className="mt-2 text-right text-blue-500">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
