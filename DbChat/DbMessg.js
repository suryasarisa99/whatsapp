import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Pressable,
} from "react-native";
import React from "react";
import { useState, useEffect, useContext } from "react";
import * as Sharing from "expo-sharing";
import colors from "../colors";
function DbMessg({ item }) {
  const [imageSize, setImageSize] = useState();
  const imagePath = `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/${item.image}`;
  let path = `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/`;

  useEffect(() => {
    if (!item.image) return;
    try {
      Image.getSize(
        imagePath,
        (width, height) => {
          setImageSize({ width, height, ratio: width / height });
        },
        (error) => console.log(error)
      );
    } catch (e) {
      console.log(e);
    }
  }, [imagePath]);

  if (item.type == 15)
    //*  Deleted message
    // return <Text style={{ color: "white" }}>This Message was Deleted</Text>
    return null;
  if (item.type == 1 && imageSize)
    //* image message
    return (
      <Pressable onPress={() => Sharing.shareAsync(imagePath)}>
        <View style={[s.media]}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              style={{
                width: "100%",
                // aspectRatio: imageSize.ratio,
                aspectRatio: 1 / 1,
                borderRadius: 9,
                resizeMode: "cover",
              }}
              source={{ uri: imagePath }}
            />
          </View>
          {item.mssg && <Text style={s.mediaTextMssg}> {item.mssg} </Text>}
        </View>
      </Pressable>
    );
  else if (item.type == 0)
    //* text message
    return (
      <View style={s.textOuter}>
        <Text style={[s.textMssg]}>{item.mssg}</Text>
      </View>
    );
  else if (item.type == 66) {
    return null;
    //* POLLS
    const options = item.options.split(",");
    return (
      <View style={s.poll}>
        <Text style={{ color: "white" }}>{item.mssg}</Text>
        {options.map((option, index) => {
          return (
            <View key={index}>
              <Text style={{ color: "white" }}>{option}</Text>
            </View>
          );
        })}
      </View>
    );
  } else if (item.type == 9 && item.image) {
    //  File
    // path += item.file;
    return (
      <Pressable onPress={() => Sharing.shareAsync(path + item.image)}>
        <View
          style={[
            s.file,
            {
              backgroundColor: item.me
                ? colors.mssg_me_lt
                : colors.mssg_others_lt,
            },
          ]}
        >
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              s.fileText,
              {
                color: item.me ? "#95a59d" : "#808288",
              },
            ]}
          >
            {item.image.split("/").at(-1)}
          </Text>
        </View>
      </Pressable>
    );
  }
}

export default function MessageBlock({ item }) {
  return (
    <View style={[s.messageBlock, item.me ? s.rightMssg : s.leftMssg]}>
      {item.type != 9 ? (
        <View
          style={{
            maxWidth: "82%",
            borderRadius: 15,
            backgroundColor: item.me ? colors.mssg_me : colors.mssg_others,
          }}
        >
          <DbMessg item={item} />
        </View>
      ) : (
        <View
          style={{
            width: "82%",
            borderRadius: 15,
            backgroundColor: item.me ? colors.mssg_me : colors.mssg_others,
          }}
        >
          <DbMessg item={item} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  messageBlock: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    // backgroundColor: "#86007f",
  },
  rightMssg: {
    justifyContent: "flex-end",
    paddingRight: 16,
  },
  leftMssg: {
    justifyContent: "flex-start",
    paddingLeft: 16,
  },
  media: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 15,
  },
  mediaTextMssg: {
    marginTop: 12,
    color: "white",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderRadius: 15,
    padding: 0,
  },
  textOuter: {
    minWidth: 80,
  },
  textMssg: {
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 15,
  },
  file: {
    margin: 6,
    borderRadius: 9,
    flex: 1,
    padding: 14,
    paddingVertical: 25,
  },
  fileText: {
    fontSize: 20,
    textAlign: "center",
  },
});
