import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { useState, useEffect, useContext } from "react";
import * as Sharing from "expo-sharing";
import { Video } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import { DataContext } from "../DataContext";
function DbMessg({ item }) {
  const [imageSize, setImageSize] = useState();
  const imagePath = `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/${item.image}`;
  let path = `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/`;
  let content = `content:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/`;
  const [play, setPlay] = useState(false);
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
      <View style={[s.media]}>
        <Pressable
          onPress={async () => {
            // await Linking.openURL(path + item.image);
          }}
        >
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
        </Pressable>
        {item.mssg && (
          <Text
            style={s.mediaTextMssg}
            selectable={true}
            selectionColor={item.me ? colors.mssg_me_lt : colors.mssg_others_lt}
          >
            {item.mssg}
          </Text>
        )}
      </View>
    );
  else if (item.type == 0) {
    //* text message
    return (
      <View>
        <ScrollView scrollEnabled={false} style={s.textOuter}>
          <Text style={[s.textMssg]} selectable={true}>
            {item.mssg}
          </Text>
        </ScrollView>
      </View>
    );
  } else if (item.type == 66) {
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
    // * File
    //  File
    // path += item.file;
    return (
      <Pressable
        onPress={async () => {
          const contentUri = await FileSystem.getContentUriAsync(
            path + item.image
          );

          Linking.openURL(contentUri);
          // IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          //   data: contentUri,
          //   type: "application/pdf",
          // });
        }}
      >
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
          {item.mssg && <Text style={s.mediaTextMssg}>{item.mssg}</Text>}
        </View>
      </Pressable>
    );
  } else if (item.type == 3) {
    // * Video
    console.log(item.image);
    console.log(imageSize?.ratio);
    // uri: `file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/${"Media/WhatsApp Video/VID-20240119-WA0006.mp4"}`,
    return (
      <View style={{ padding: 6, position: "relative" }}>
        {!play && (
          <Pressable
            style={{
              flex: 1,
              position: "absolute",
              left: "50%",
              flex: 1,
              top: "50%",
              zIndex: 1,
              transform: [{ translateX: -5 }, { translateY: -5 }],
            }}
            onPress={() => setPlay(true)}
          >
            <View
              style={{
                // backgroundColor: "#00000091",
                // borderRadius: 50,
                elevation: 4,
                // padding: 5,
              }}
            >
              <Entypo
                name="controller-play"
                style={{
                  padding: 3,
                  elevation: 3,
                }}
                size={40}
                color="white"
              />
            </View>
          </Pressable>
        )}
        {play && (
          <Pressable
            style={{
              flex: 1,
              position: "absolute",
              left: "50%",
              flex: 1,
              top: "50%",
              zIndex: 1,
              transform: [{ translateX: -5 }, { translateY: -5 }],
            }}
            onPress={() => setPlay(false)}
          >
            <View
              style={{
                // backgroundColor: "#00000091",
                // borderRadius: 50,
                width: 50,
                height: 50,
                // padding: 5,
              }}
            ></View>
          </Pressable>
        )}
        <Video
          source={{
            uri: path + item.image,
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={play}
          isLooping
          style={{
            width: imageSize?.ratio * 350 || 250,
            aspectRatio: imageSize?.ratio,
            borderRadius: 10,
          }}
        />
      </View>
    );
  }
}

export default function MessageBlock({
  item,
  prvDate,
  setPrvDate,
  prvDateRef,
}) {
  let X = null;
  let date = formatDate(item.date).date;
  if (!prvDateRef.current || date != prvDateRef.current) {
    // setPrvDate(item.date);
    prvDateRef.current = date;
    X = <D date={date} />;
  }

  return (
    <View>
      {X}
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
    </View>
  );
}

function D({ date }) {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: "white",
          backgroundColor: "#343434",
          borderRadius: 15,
          paddingHorizontal: 16,
          paddingVertical: 6,
        }}
      >
        {date}
      </Text>
    </View>
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
