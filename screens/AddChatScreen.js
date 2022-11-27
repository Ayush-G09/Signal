import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { db, collection, addDoc } from '../firebase'

const AddChatScreen = ({navigation}) => {

    const [input, setInput] = useState("");

    const createChat = async () => {
        if(input === '')
        {
            alert("Please enter chat name");
        }
        else
        {
            await addDoc(collection(db, "chats"), {
                chatName: input,
            })
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => alert(error));
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new chat",
            headerBackTitle: "Chats",
        })
    }, [navigation])

  return (
    <View style={styles.container}>
      <Input 
        placeholder='Enter a chat name' 
        value={input} 
        onChangeText={(text) => setInput(text)} 
        onSubmitEditing={createChat}
        leftIcon={<Icon name='wechat' type='antdesign' size={24} color="black"/>}
       />
       <Button disabled={!input} title='Create new Chat' onPress={createChat}/>
    </View>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%",
    },
})