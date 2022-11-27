import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const CustomListItem = ({ id, chatName, enterChat }) => {

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (querysnapshot) => {
            setChatMessages(querysnapshot.docs.map(doc => ({
                data: doc.data()
            })));
        });

        return unsubscribe;
    });

  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
        <Avatar
            rounded
            source={{
                uri: chatMessages?.[0]?.data.photoURL ||
                "https://w7.pngwing.com/pngs/165/652/png-transparent-businessperson-computer-icons-avatar-avatar-heroes-public-relations-business.png"
            }}
        />
        <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "800" }}>
                {chatName}
            </ListItem.Title>
            <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                {chatMessages?.[0]?.data.displayName}: {chatMessages?.[0]?.data.message}
            </ListItem.Subtitle>
        </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem

const styles = StyleSheet.create({})