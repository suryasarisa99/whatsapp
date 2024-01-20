import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useState, useContext } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { DataContext } from "../DataContext";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
// import { ScrollView } from "react-native-gesture-handler";
import ChatItem from "../components/ChatItem";
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
  } = useContext(DataContext);
  const [image, setImage] = useState();

  const selectFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
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

  const onSelect = async (chatItem) => {
    const d = await retrieveDataFromFile(
      chatItem.chatWith + "|x|" + chatItem.chatFrom
    );
    setNames(Array.from(new Set(d.slice(0, 8).map((item) => item.name))));
    setData(d);
    navigation.navigate("Chat", { chatItem });
    // navigation.navigate(chatItem.chatWith, { chatItem });
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
      </ScrollView>

      <Pressable onPress={selectFile}>
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
