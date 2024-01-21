import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StatusBar as Sb,
  StyleSheet,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

import React from "react";
export default function DbChatTopBar({
  navigation,
  chatItem,
  notSaved,
  setShowModal,
  setShowMenu,
}) {
  return (
    <View style={s.topbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <MaterialIcons
          style={{
            paddingHorizontal: 8,
            paddingVertical: 5,
            marginRight: 2,
          }}
          name="chevron-left"
          size={28}
          color="white"
        />
      </TouchableOpacity>
      <Pressable
        onPress={() => {
          console.log("clicked");
          // setShowProfile(true);
          navigation.navigate("Profile", { chatItem });
        }}
      >
        <View style={s.head}>
          <MaterialCommunityIcons
            name="face-man-profile"
            size={38}
            color="white"
          />
          <Text style={s.title}>{chatItem.contact}</Text>
        </View>
      </Pressable>

      <View style={s.headerItems}>
        {notSaved && (
          <Pressable
            onPress={() => {
              setShowModal(true);
            }}
          >
            <MaterialIcons
              name="save-alt"
              size={24}
              color="white"
              style={{ paddingVertical: 4, paddingHorizontal: 6 }}
            />
          </Pressable>
        )}
        <TouchableOpacity
          onPress={() => {
            setShowMenu(true);
          }}
        >
          <Ionicons
            style={{ paddingVertical: 4, paddingHorizontal: 6 }}
            name="ellipsis-vertical-sharp"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  topbar: {
    paddingLeft: 7,
    paddingVertical: 4,
    paddingBottom: 8,
    backgroundColor: "#000",
    marginTop: Sb.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.3,
    borderColor: "#4f4f4f",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    gap: 12,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
  headerItems: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingRight: 20,
  },
});
