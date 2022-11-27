import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { Avatar } from "react-native-elements"
import { auth, db, collection, onSnapshot} from '../firebase'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'

const HomeScreen = ({navigation}) => {

    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    };

    useEffect(() => {
        const colRef = collection(db, 'chats');

        const unsubscribe = onSnapshot(colRef, (querysnapshot) => {
            setChats(querysnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
        });

        return unsubscribe;
    }, [])
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff"},
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 0, marginRight: 10}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20}}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddChat')}>
                        <SimpleLineIcons name='pencil' size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName,
        });
    };

  return (
    <SafeAreaView>
        <ScrollView style={styles.container}>
            {chats.map(({id, data: {chatName} }) => (
                <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
            ))}
        </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
})