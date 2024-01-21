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
    <Pressable onPress={() => onDbChatSelect(item, contact)}>
      <View style={s.chatItem}>
        <MaterialCommunityIcons
          name="face-man-profile"
          size={50}
          color="#a4a4a4"
        />
        <View style={{ flex: 1 }}>
          <View style={s.chatTop}>
            <Text
              style={[
                s.chatName,
                isGroup && contact.length > 30 ? { fontSize: 14 } : {},
              ]}
            >
              {contact}
            </Text>
            <Text style={s.chatDate}>{formatDate(item.date).date}</Text>
          </View>
          <Text style={[s.chatMssg]}>
            {item.mssg?.substring(0, 50).replace(/s+/, " ")}
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
    // flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 0.3,
    borderColor: "#4f4f4f",
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  chatTop: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "90%",
  },
  chatName: {
    fontSize: 19,
    color: "white",
    color: "#a4a4a4",
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
