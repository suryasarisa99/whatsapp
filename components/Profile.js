import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import { DataContext } from "../DataContext";
import * as IntentLauncher from "expo-intent-launcher";
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
            onPress={async () => {
              const imageFile = getImageFile(
                `${chatItem.chatWith}|x|${chatItem.chatFrom}.jpg`,
                "image"
              );
              const jsonFile = getImageFile(
                `${chatItem.chatWith}|x|${chatItem.chatFrom}.json`,
                ""
              );
              console.log(jsonFile);

              // const contentUri = await FileSystem.getContentUriAsync(imageFile);

              const jsonUri = await FileSystem.getContentUriAsync(jsonFile);
              // Linking.openURL(contentUri);
              console.log(jsonUri);
              Linking.openURL(jsonUri);
              // IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
              //   data: imageFile,
              //   type: "image/*",
              // });
              // Linking.openURL();
            }}
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
                  `${chatItem.chatWith}|x|${chatItem.chatFrom}.jpg`,
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
