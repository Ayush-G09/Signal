import { StyleSheet, View } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Text} from 'react-native-elements'
import { auth, createUserWithEmailAndPassword, updateProfile} from '../firebase'

const RegisterScreen = ({navigation}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to login",
        });
    }, [navigation])

    const register = () => {
      if(name === '' || email === '' || password === '' || imageUrl === '')
      {
        alert("Please enter all fields");
      }
      else
      {
        createUserWithEmailAndPassword(auth ,email, password)
        .then(async(res) => {
          const user = res.user;
          await updateProfile(user, {
            displayName: name,
            photoURL: imageUrl,
          });
        })
        .catch((error) => alert(error.message));
      }
    };

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.contaioner}>
      <StatusBar style='light'/>
      <Text h3 style={{marginBottom: 50}}>
        Create a Signal accout
      </Text>
      <View style={styles.inputContainer}>
        <Input placeholder='Full Name' autoFocus type="text" value={name} onChangeText={(text) => setName(text)}/>
        <Input placeholder='Email' type="email" value={email} onChangeText={(text) => setEmail(text)}/>
        <Input placeholder='Password' secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)}/>
        <Input placeholder='Profile Picture URl (Optional)' type="text" value={imageUrl} onChangeText={(text) => setImageUrl(text)} onSubmitEditing={register}/>
      </View>
      <Button containerStyle={styles.button} raised onPress={register} title="Register"/>
      <View style={{height: 100}}/>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    contaioner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    inputContainer: {
        width: 300,
    }
});