import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import type { SignupFormProps } from '@/components/signup-form';
import { SignupForm } from '@/components/signup-form';
import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Auth() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

  // Login form submission
  const onLoginSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      setErrorMessage('');
      const response = await axios.post('https://54.83.125.17/users/login/', {
        username: data.username,
        password: data.password,
      });

      const tokens = response.data;
      if (!tokens.token) {
        setErrorMessage('Failed to log in. Please check your credentials.');
        return;
      }

      signIn({ access: tokens.token, refresh: tokens.token });
      router.push('/');
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || 'Login failed'
          : 'An unexpected error occurred.'
      );
    }
  };

  // Signup form submission
  const onSignupSubmit: SignupFormProps['onSubmit'] = async (data) => {
    try {
      setErrorMessage('');
      const response = await axios.post(
        'https://54.83.125.17/users/signup/',
        data
      );

      if (response.status === 201) {
        setIsLogin(true); // Switch to login after successful signup
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || 'Signup failed'
          : 'An unexpected error occurred.'
      );
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 justify-center p-4">
        {isLogin ? (
          <LoginForm
            errorMessage={errorMessage || ''}
            onSubmit={onLoginSubmit}
          />
        ) : (
          <SignupForm
            errorMessage={errorMessage || ''}
            onSubmit={onSignupSubmit}
          />
        )}
        <View className="mt-6 items-center">
          <Text className="text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <Button
            label={isLogin ? 'Sign Up' : 'Log In'}
            onPress={() => setIsLogin(!isLogin)}
          />
        </View>
      </View>
    </>
  );
}
