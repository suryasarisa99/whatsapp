import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Button,
  PermissionsAndroid,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../DataContext";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import * as Contacts from "expo-contacts";
// import { ScrollView } from "react-native-gesture-handler";
import ChatItem from "../components/ChatItem";
import DbChatItem from "../DbChat/DbChatItem";
export default function Home({ navigation }) {
  const {
    data,
    setData,
    names,
    setNames,
    chats,
    retrieveDataFromFile,
    pickImage,
    getImageFile,
    dbChat,
    setDbChat,
  } = useContext(DataContext);
  const [dbChatList, setDbChatList] = useState([]);
  const [contacts, setContacts] = useState([]);

  const selectFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    if (result.type == "cancel") return;
    let fileUri = result.assets[0].uri;
    let fileInfo = await FileSystem.getInfoAsync(fileUri);
    let text = await FileSystem.readAsStringAsync(fileUri);

    const d = getMessages2(text);
    setNames(Array.from(new Set(d.slice(0, 8).map((item) => item.name))));
    setData(d);
    navigation.navigate("Chat", {
      chatItem: {
        chatWith: names[0],
        chatFrom: names[1],
        mssg: d[d.lenght - 1]?.mssg,
        date: d[d.lenght - 1]?.date,
      },
      notSaved: true,
    });
  };

  useEffect(() => {
    const id = 18;

    const query_chatlist = `
      SELECT
          message.chat_row_id as id, 
          count(*) as count, 
          jid.user as no, 
          chat.subject as group_name,
          last_message.text_data as mssg,
          last_message.timestamp as date
      FROM
          message
      JOIN
          chat ON chat._id = message.chat_row_id
      JOIN
          jid ON chat.jid_row_id = jid._id
      JOIN
          message as last_message ON chat.last_message_row_id = last_message._id
      WHERE
          message.text_data IS NOT NULL
      GROUP BY
          message.chat_row_id
      HAVING
          count(message.chat_row_id) > 0
      ORDER BY
          date DESC
      LIMIT 100;
      `;
    async function requestStoragePermission() {
      try {
        console.log(">>>>>>>>>   requesting permission");
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message:
              "This app needs access to your storage to download Photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(">>>>>>       You can use the storage");
        } else {
          console.log(">>>>> =   Storage permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
    async function get_sql_chat_list() {
      try {
        const db = SQLite.openDatabase("surya.db");
        await db.transactionAsync(async (tx) => {
          console.log("fetching from db");
          const result = await tx.executeSqlAsync(query_chatlist, []);
          setDbChatList(result.rows);
        }, true);
      } catch (error) {
        console.log("Error:", error);
      }
    }
    async function getContacts() {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          // fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(
            data
              .filter((item) => item?.phoneNumbers?.[0]?.number)
              .map((item) => ({
                no: item?.phoneNumbers?.[0]?.number?.replace(/\s/g, ""),
                name: item?.name,
                key: item?.lookupKey,
              }))
          );
        }
      }
    }
    requestStoragePermission();
    get_sql_chat_list();
    getContacts();
  }, []);

  const onSelect = async (chatItem) => {
    const d = await retrieveDataFromFile(
      chatItem.chatWith + "|x|" + chatItem.chatFrom
    );
    setNames(Array.from(new Set(d.slice(0, 8).map((item) => item.name))));
    setData(d);
    setDbChat([]);
    navigation.navigate("Chat", { chatItem });
    // navigation.navigate(chatItem.chatWith, { chatItem });
  };

  const onDbChatSelect = async (chatItem, contact) => {
    const query_chat = `
    SELECT 
      message._id, 
      message.from_me as me, 
      message.text_data as mssg, 
      message.message_type as type,
      message_media.file_path as image
    FROM message
    LEFT JOIN message_media ON message._id = message_media.message_row_id
    WHERE message.chat_row_id = ${chatItem.id} And type != 7;
    `;
    try {
      const db = SQLite.openDatabase("surya.db");
      await db.transactionAsync(async (tx) => {
        console.log("fetching from db");
        const result = await tx.executeSqlAsync(query_chat, []);
        setDbChat(result.rows);
        setData([]);
        navigation.navigate("DbChatScreen", {
          chatItem: { ...chatItem, contact },
        });
      }, true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View style={s.v}>
      <ScrollView>
        {chats.map((chatItem, index) => (
          <ChatItem
            key={chatItem.chatWith + "xx" + index}
            item={chatItem}
            index={index}
            onSelect={onSelect}
          />
        ))}
        {dbChatList.map((chatItem, index) => {
          return (
            <DbChatItem
              contact={
                chatItem.group_name ||
                contacts.find((item) => item.no.includes(chatItem.no))?.name ||
                chatItem.no
              }
              isGroup={chatItem.group_name ? true : false}
              key={chatItem.no}
              item={chatItem}
              onDbChatSelect={onDbChatSelect}
            />
          );
        })}
      </ScrollView>

      <Pressable
        onPress={selectFile}
        onLongPress={() => {
          console.log("long press");
        }}
        delayLongPress={800}
      >
        <View style={s.fab}>
          <MaterialCommunityIcons name="message" size={24} color="white" />
        </View>
      </Pressable>
    </View>
  );
}

s = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#131315",
    elevation: 5,
  },
  v: {
    position: "relative",
    flex: 1,
  },
});

function getMessages2(text, fileName) {
  const messages = text.split(
    /\n(?=\d\d?\/\d\d?\/\d\d\d?\d?, \d\d?:\d\d\s?(?:pm|am|PM|AM)? - )/
  );
  messages.splice(0, 1);

  return messages
    .map((message, index) => {
      const [timestamp, content] = message.split(" - ");
      const [date, time] = timestamp.split(", ");
      let [name, mssg] = content.split(":");
      let file;

      if (mssg && mssg.includes("(file attached)"))
        [file, mssg] = mssg.split("(file attached)");

      const obj = {
        date: date?.trim(),
        time: time?.trim(),
        name: name?.trim(),
        mssg: mssg?.trim(),
        file: file?.trim(),
      };
      // if (fileName.includes("Bosch Siemens")) {
      //   if (mssg && mssg?.trim()?.length == 16) return obj;
      // } else if (fileName.includes("Artes conference group")) {
      //   if (mssg && mssg?.trim()?.length == 12) return obj;
      // } else

      if (mssg) return obj;
    })
    .filter((item) => item?.mssg);
}
