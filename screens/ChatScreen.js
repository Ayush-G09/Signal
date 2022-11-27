import { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { auth, db, addDoc, collection, onSnapshot} from '../firebase';
import {doc, getDocs, query, serverTimestamp, orderBy} from 'firebase/firestore';
import { async } from '@firebase/util';

const ChatScreen = ({ navigation, route}) => {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Avatar rounded source={{ uri: messages[0]?.data.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLC7KvQOPBoZ184yhWimF3iOy8yS2nNZToFA&usqp=CAU"}}/>
                    <Text style={{ color: "white", marginLeft: 10, fontWeight: "7000" }}>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", width: 80, justifyContent: "flex-end"}}>
                    <TouchableOpacity style={{ marginRight: 30}}>
                        <FontAwesome name='video-camera' size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='call' size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();

        addDoc(collection(db, `chats/${route.params.id}`, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });

        setInput('');
    };

    /*useEffect(() => {
        const getData = async () => {
            const q = query(collection(db, `chats/${route.params.id}/messages`));
            const sanpShot = await getDocs(q);
            const data = sanpShot.docs.map((doc) => ({
                ...doc.data(), id: doc.id
            }))
            var arr = data;
            setMessages(arr);
            console.log(messages)
        }
        getData();
    }, [route])*/

    useLayoutEffect(() => {
        const q = query(collection(db, `chats/${route.params.id}/messages`), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (querysnapshot) => {
            setMessages(querysnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
        });

        return unsubscribe;
    }, [route])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light"/>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
            <ScrollView contentContainerStyle={{ paddingTop: 15}}>
                {messages.map(({id, data}) => (
                    data.email === auth.currentUser.email ? (
                        <View key={id} style={styles.reciever}>
                            <Avatar position="absolute" bottom={-15} right={-5} rounded size={30} source={{ uri: data.photoURL}}/>
                            <Text style={styles.recieverText}>{data.message}</Text>
                        </View>
                    ) : (
                        <View key={id} style={styles.sender}>
                            <Avatar position="absolute" bottom={-15} right={-5} rounded size={30} source={{ uri: data.photoURL}}/>
                            <Text style={styles.senderText}>{data.message}</Text>
                            <Text style={styles.senderName}>{data.displayName}</Text>
                        </View>
                    )
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <TextInput value={input} onChangeText={(text) => setInput(text)} onSubmitEditing={sendMessage} placeholder='Signal Message' style={styles.testInput}/>
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                    <Ionicons name='send' size={24} color='#2B68E6'/>
                </TouchableOpacity>
            </View>
        </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    reciever: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    recieverText:{
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",
    },
    senderText:{
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    testInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
});