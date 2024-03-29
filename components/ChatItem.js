import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DataContext } from "../DataContext";
export default function ChatItem({ item, onSelect }) {
  const { getImageFile } = useContext(DataContext);
  const [profilePic, setProfilePic] = useState(null);

  return (
    <Pressable onPress={() => onSelect(item)}>
      <View style={s.chatItem}>
        {item.hasImg ? (
          <Image
            style={{ width: 50, height: 50, borderRadius: 50 }}
            source={{
              uri: getImageFile(
                `${item.chatWith}|x|${item.chatFrom}.jpg`,
                "thumb"
              ),
            }}
          />
        ) : (
          <MaterialCommunityIcons
            name="face-man-profile"
            size={50}
            color="#a4a4a4"
          />
        )}
        <View style={{ flex: 1 }}>
          <View style={s.chatTop}>
            <Text style={s.chatName}>{item.chatWith}</Text>
            <Text style={s.chatDate}>{item.date}</Text>
          </View>
          <Text style={s.chatMssg}>{item.mssg}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chatItem: {
    // flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  chatTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "90%",
  },
  chatName: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    color: "#ededed",
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
});
