import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
export default function DbMessg({ item }) {
  const [imageSize, setImageSize] = useState();
  const imagePath = `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/${item.image}`;

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
    // return <Text style={{ color: "white" }}>This Message was Deleted</Text>
    return null;
  if (item.type == 1 && imageSize)
    return (
      <View style={[s.messageBlock, item.me ? s.rightMssg : s.leftMssg]}>
        <View style={[s.media, item.me ? { backgroundColor: "#1e1920" } : {}]}>
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
      </View>
    );
  else if (item.type == 0)
    return (
      <View style={[s.messageBlock, item.me ? s.rightMssg : s.leftMssg]}>
        <View style={s.textOuter}>
          <Text style={[s.textMssg, item.me ? s.textMssgA : s.textMssgB]}>
            {item.mssg}
          </Text>
        </View>
      </View>
    );
  // else return <Text style={{ color: "white" }}>{item.type}</Text>;
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
    // backgroundColor: "green",
  },
  leftMssg: {
    justifyContent: "flex-start",
    paddingLeft: 16,
    // backgroundColor: "red",
  },
  media: {
    maxWidth: "82%",
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#1b2023",
    borderRadius: 15,
  },
  mediaTextMssg: {
    marginTop: 12,
    color: "white",
    fontSize: 16,
    borderRadius: 15,
    padding: 0,
  },
  textOuter: {
    minWidth: 80,
    maxWidth: "82%",
    // backgroundColor: "#009cfc",
  },
  textMssg: {
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 15,
  },
  textMssgA: {
    backgroundColor: "#005c4b",
    backgroundColor: "#1e1920",
  },
  textMssgB: {
    backgroundColor: "#202c33",
    backgroundColor: "#1b2023",
  },
});
