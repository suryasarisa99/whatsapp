import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function WaInput({ sendMessge }) {
  const [focus, setFocus] = useState(false);
  const [mssg, setMssg] = useState("");
  return (
    <View style={s.v}>
      <TextInput
        style={s.input}
        placeholder="Type a message"
        placeholderTextColor="#757575"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={mssg}
        onChangeText={setMssg}
      />
      {focus ? (
        <TouchableOpacity
          onPress={() => {
            sendMessge(mssg);
            setMssg("");
          }}
        >
          <MaterialCommunityIcons
            name="send"
            size={24}
            color="white"
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <MaterialCommunityIcons name="microphone" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
s = StyleSheet.create({
  v: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    paddingRight: 20,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 15,
    margin: 10,
    color: "#b5b5b5",
    fontSize: 16,
  },
});
