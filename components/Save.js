import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  Pressable,
  Image,
  TouchableHighlight,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../DataContext";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

export default function Save({ date, mssg }) {
  const {
    showModal,
    setShowModal,
    chats,
    setChats,
    names,
    data,
    saveDataToFile,
    saveImageFile,
    pickImage,
    reduceImageQuality,
    // direction,
    // setDirection,
  } = useContext(DataContext);
  const [direction, setDirection] = useState(0);
  const [image, setImage] = useState(null);
  const [chatWith, setChatWith] = useState("");
  const [low_res_img, set_low_res_img] = useState(null);
  const [chatFrom, setChatFrom] = useState("");
  //   setShowModal(false);
  return (
    <Modal transparent={false} visible={showModal} animationType="none">
      {/* <Animatable.View animation="slideInDown"> */}
      <View style={s.container}>
        <View style={s.center}>
          <Pressable
            onPress={() => {
              pickImage().then((image) => {
                setImage(image);
                reduceImageQuality(image).then((image) => {
                  set_low_res_img(image);
                });
              });
            }}
          >
            {!image ? (
              <MaterialCommunityIcons
                name="face-man-profile"
                size={128}
                color="#a4a4a4"
              />
            ) : (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </Pressable>
          <Text style={s.contact}>{chatWith}</Text>
        </View>
        <View style={s.body}>
          <TextInput
            style={[s.input, s.input1]}
            placeholder="Chat With"
            placeholderTextColor="#898989"
            value={chatWith}
            autoCapitalize="words"
            onChangeText={setChatWith}
          />
          <TextInput
            style={[s.input, s.input2]}
            placeholder="Chat From"
            placeholderTextColor="#898989"
            value={chatFrom}
            autoCapitalize="words"
            onChangeText={setChatFrom}
          />
          <View style={s.section}>
            <View style={s.row}>
              <Text style={s.directionName}>
                {" "}
                {names[direction == 0 ? 1 : 0]}{" "}
              </Text>
              <Text style={s.text}> {chatWith} </Text>
            </View>
            <View style={s.row}>
              <Text style={s.directionName}> {names[direction]} </Text>
              <Text style={s.text}> {chatFrom} </Text>
            </View>
          </View>

          <Pressable
            style={[s.center, { paddingVertical: 5 }]}
            onPress={() => setDirection((prv) => (prv == 0 ? 1 : 0))}
          >
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={24}
              color="white"
            />
          </Pressable>
          <View
            style={[s.row, { marginTop: 30, justifyContent: "space-around" }]}
          >
            <TouchableHighlight
              onPress={() => {
                setShowModal(false);
              }}
            >
              <Text style={s.btn}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                let x = {
                  chatWith,
                  chatFrom,
                  direction,
                  hasImg: image ? true : false,
                  mssg: data[data.length - 1].mssg,
                  date: data[data.length - 1].date,
                };
                console.log(x);
                setChats((prv) => [...prv, x]);
                saveDataToFile(data, chatWith + "|x|" + chatFrom);
                if (image) {
                  saveImageFile(
                    image,
                    chatWith + "|x|" + chatFrom + ".jpg",
                    "image"
                  );
                  saveImageFile(
                    low_res_img,
                    chatWith + "|x|" + chatFrom + ".jpg",
                    "thumb"
                  );
                }
                setShowModal(false);
              }}
            >
              <Text style={s.btn}>Save</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      {/* </Animatable.View> */}
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#000",
  },
  center: {
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  contact: {
    color: "#a8a8a8",
    fontSize: 28,
    padding: 10,
  },
  test: {
    color: "#fff",
  },
  input: {
    color: "#a4a4a4",
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#0e0f10",
    // paddingLeft: 20,
    marginBottom: 10,
  },
  input1: {
    paddingLeft: 20,
  },
  input2: {
    textAlign: "right",
    paddingRight: 20,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#0e0f10",
    borderRadius: 20,
    gap: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  directionName: {
    flex: 1,
    fontSize: 20,
    color: "#a4a4a4",
  },
  text: {
    color: "#b8b8b8",
    fontSize: 18,
  },
  btn: {
    color: "#a4a4a4",
    paddingHorizontal: 25,
    fontSize: 18,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#0e0f10",
  },
});
