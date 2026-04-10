import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}