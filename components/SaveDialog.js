import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../DataContext";

export default function SaveDialog() {
  const { setChats, data, chats, showModal, setShowModal, saveDataToFile } =
    useContext(DataContext);
  const [newChatName, setNewChatName] = useState("");

  return (
    <Modal transparent={true} visible={showModal} animationType="slide">
      <View style={s.modalContainer}>
        <View style={s.modalContent}>
          <Text style={s.popupTextHead}>Save File As</Text>
          <TextInput
            value={newChatName}
            onChangeText={setNewChatName}
            style={s.input}
          />
          <View style={s.buttons}>
            <Btn title="Cancel" onPress={() => setShowModal(false)} />
            <Btn
              title="Save"
              onPress={() => {
                if (chats.find((item) => item.name === newChatName))
                  alert("Chat name already exists");
                else {
                  setShowModal(false);
                  setChats([
                    ...chats,
                    {
                      name: newChatName,
                      date: data[data.length - 1].date,
                      mssg: data[data.length - 1].mssg,
                    },
                  ]);
                  saveDataToFile(data, newChatName);
                }
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Btn({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={s.btn}>
        <Text style={s.btnText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#0e0f10",
    borderRadius: 10,
    alignItems: "center",
    color: "#fff",
    textColor: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    color: "#fff",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 8,
  },
  popupTextHead: {
    color: "#d3d3d3",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    margin: 0,
  },
  btn: {
    // backgroundColor: "#171616",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnText: {
    color: "#dedede",
    fontSize: 16,
  },
});
