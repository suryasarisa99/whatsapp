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

export default function DbChatItem({ item, contact, onDbChatSelect, isGroup }) {
  const { getImageFile } = useContext(DataContext);
  const [profilePic, setProfilePic] = useState(null);

  return (
    <Pressable
      onPress={() => onDbChatSelect(item, contact)}
      android_ripple={{ color: "#2e3034ac" }}
    >
      <View style={s.chatItem}>
        <MaterialCommunityIcons
          name="face-man-profile"
          size={50}
          color="#e1e1e1"
        />
        <View style={{ flex: 1 }}>
          <View style={s.chatTop}>
            <Text
              style={[
                s.chatName,
                isGroup && contact.length > 30 ? { fontSize: 14 } : {},
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {contact} {item.id}
            </Text>
            <Text style={s.chatDate}>{formatDate(item.date).date}</Text>
          </View>
          <Text style={[s.chatMssg]} numberOfLines={1} ellipsizeMode="tail">
            {item.mssg?.substring(0, 80).replace(/s+/, " ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatDate(timestamp) {
  // Convert the timestamp to a Date object
  let date = new Date(timestamp);

  // Format the date and time
  let day = String(date.getDate());
  let month = String(date.getMonth() + 1);
  let year = String(date.getFullYear()).slice(2);
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");

  // Return the formatted date and time
  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes}`,
  };
}

const s = StyleSheet.create({
  chatItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 14,
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
    width: "85%",
    // backgroundColor: "red",
    fontWeight: 500,
    color: "#e1e1e1",
    overflow: "hidden",
  },
  chatMssg: {
    fontSize: 13,
    color: "white",
    color: "#888888",
  },
  chatDate: {
    color: "#a4a4a4",
    paddingLeft: 5,
    fontSize: 12,
  },
});
