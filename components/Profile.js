import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

export default function Profile({
  route,
  navigation,
  //   showProfile,
  //   setShowProfile,
  //   chatItem,
}) {
  const { getImageFile } = useContext(DataContext);
  const [longPress, setLongPress] = useState(false);
  const { chatItem } = route.params;
  return (
    // <Modal animationType="slide" visible={showProfile}>
    <View style={s.container}>
      <View style={s.topbar}>
        <TouchableOpacity
          onPress={() => {
            console.log("close profile");
            navigation.goBack();
            //   setShowProfile(false);
          }}
        >
          <MaterialIcons
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              marginRight: 8,
            }}
            name="chevron-left"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View style={s.center}>
        {chatItem.hasImg ? (
          <Pressable
            onLongPress={() => {
              console.log("long pressed");
              setLongPress((prv) => !prv);
            }}
          >
            <Image
              resizeMode="cover"
              //   style={(long)}
              style={[
                longPress
                  ? {
                      height: 300,
                      aspectRatio: 1,
                      //   height: 300,
                      borderRadius: 20,
                      resizeMode: "contain",
                    }
                  : { width: 300, height: 300, borderRadius: 150 },
              ]}
              source={{
                uri: getImageFile(
                  `${chatItem.chatWith}|x|${chatItem.chatFrom}`,
                  "image"
                ),
              }}
            />
          </Pressable>
        ) : (
          <MaterialCommunityIcons
            name="face-man-profile"
            size={180}
            color="white"
          />
        )}
        <Text style={s.contact}>{chatItem.chatWith || chatItem.contact}</Text>
      </View>
    </View>
    // </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: StatusBar.currentHeight,
  },
  center: {
    paddingTop: 22,
    alignItems: "center",
  },
  contact: {
    color: "#d5d5d5",
    fontSize: 28,
    padding: 10,
  },
  topbar: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
