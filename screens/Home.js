import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState, useContext } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { DataContext } from "../DataContext";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
// import { ScrollView } from "react-native-gesture-handler";

export default function Home({ navigation }) {
  const { data, setData, names, setNames, chats, retrieveDataFromFile } =
    useContext(DataContext);
  const selectFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    let fileUri = result.assets[0].uri;
    let fileInfo = await FileSystem.getInfoAsync(fileUri);
    let text = await FileSystem.readAsStringAsync(fileUri);

    const d = getMessages2(text);
    setNames(Array.from(new Set(d.slice(0, 8).map((item) => item.name))));
    setData(d);
    navigation.navigate("Chat", { name: "none" });
  };

  const onSelect = async (item) => {
    const d = await retrieveDataFromFile(item);
    setNames(Array.from(new Set(d.slice(0, 8).map((item) => item.name))));
    setData(d);
    navigation.navigate(item, { name: item.name });
  };

  function ChatItem({ item }) {
    return (
      <Pressable onPress={() => onSelect(item.name)}>
        <View style={s.chatItem}>
          <MaterialCommunityIcons
            name="face-man-profile"
            size={32}
            color="#a4a4a4"
          />
          <View>
            <View style={s.chatTop}>
              <Text style={s.chatName}>{item.name}</Text>
              <Text style={s.chatDate}>{item.date}</Text>
            </View>
            <Text style={s.chatMssg}>{item.mssg}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={s.v}>
      <ScrollView style={s.sv}>
        {chats.map((chatName, index) => {
          return <ChatItem key={chatName + index} item={chatName} />;
        })}
      </ScrollView>

      <TouchableOpacity onPress={selectFile}>
        <View style={s.fab}>
          {/* <Entypo name="plus" size={32} color="#444444" /> */}
          {/* <Entypo name="message" size={28} col#cacaca4444" /> */}
          <Entypo name="message" size={28} color="#a4a4a4" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

s = StyleSheet.create({
  sv: {
    // minHeight: Dimensions.get("window").height,
    // flex: 1,
  },
  chatItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.3,
    borderColor: "#4f4f4f",
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  chatTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  chatName: {
    fontSize: 19,
    color: "white",
    color: "#a4a4a4",
  },
  chatMssg: {
    fontSize: 14,
    color: "white",
    color: "#a4a4a4",
  },
  chatDate: {
    color: "#a4a4a4",
    paddingLeft: 5,
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#131315",
    // backgroundColor: "#000000",
    // borderColor: "#636363",
    // borderWidth: 0.3,
    elevation: 5,
  },
  v: {
    flex: 1,
    minHeight: "100",
    height: Dimensions.get("window").height,
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
