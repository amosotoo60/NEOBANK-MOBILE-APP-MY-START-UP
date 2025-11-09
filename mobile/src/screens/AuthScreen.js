import React, {useState} from 'react';
import { View, TextInput, Button } from 'react-native';
export default function AuthScreen({ navigation }){
  const [email,setEmail] = useState('');
  return (
    <View style={{flex:1,justifyContent:'center',padding:16}}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{borderWidth:1,padding:8,marginBottom:12}} />
      <Button title="Sign up" onPress={() => navigation.replace('Home')} />
    </View>
  );
}