import React from 'react';
import { View, Text, Button } from 'react-native';
export default function WelcomeScreen({ navigation }){
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:16}}>
      <Text style={{fontSize:24,fontWeight:'700'}}>Welcome to SuperApp</Text>
      <Button title="Get started" onPress={() => navigation.navigate('Auth')} />
    </View>
  );
}