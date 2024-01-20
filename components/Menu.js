import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";

export default function Menu({
  navigation,
  showMenu,
  setShowMenu,
  setInverted,
  setDirection,
  setChats,
  name,
  inverted,
}) {
  return (
    <Modal transparent={true} visible={showMenu} animationType="none">
      <View style={s.menuContainer}>
        <Pressable style={{ flex: 1 }} onPress={() => setShowMenu(false)}>
          <View style={s.b}>
            <Pressable onPress={() => {}}>
              <View style={s.menuContent}>
                <MenuItem
                  title={inverted ? "Go Top" : "Go Bottom"}
                  onPress={() => {
                    setInverted((prev) => !prev);
                    setShowMenu(false);
                  }}
                />
                <MenuItem
                  title="swap"
                  onPress={() => {
                    setDirection((prev) => (prev === 0 ? 1 : 0));
                    setShowMenu(false);
                  }}
                />
                <MenuItem
                  title="Delete Chat"
                  onPress={() => {
                    setChats((chats) =>
                      chats.filter((item) => {
                        console.log(item.chatWith, name);
                        return item.chatWith !== name;
                      })
                    );
                    navigation.navigate("Home");
                    setShowMenu(false);
                  }}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

function MenuItem({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={s.menuItem}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  menuContainer: {
    flex: 1,
  },
  b: {
    flex: 1,
  },
  menuContent: {
    position: "absolute",
    right: 10,
    top: 50,
    minWidth: 150,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#0e0f10",
    // backgroundColor: "blue",
    borderRadius: 10,
    color: "#fff",
    textColor: "#fff",
  },
  menuItem: {
    color: "#a4a4a4",
    // backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 17,
  },
});
