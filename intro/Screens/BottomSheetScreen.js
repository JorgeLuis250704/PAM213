import React, { useRef, useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  StatusBar,
  Pressable,
  Image,
} from "react-native";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function BottomSheetScreen() {
  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ["45%", "75%", "100%"], []);

  const handleCloseSheet = () => {
    sheetRef.current?.close();
  };

  const handleOpenSheet = () => {
    sheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.headerText}>Pantalla Principal</Text>

      <Button
        title="Abrir BottomSheet"
        onPress={handleOpenSheet}
        color="#311c7cff"
      />

      <Button
        title="Cerrar BottomSheet"
        onPress={handleCloseSheet}
        color="red"
      />

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1} 
        enablePanDownToClose={true}
        handleIndicatorStyle={Styles.handleIndicator}
      >
        <BottomSheetView style={Styles.content}>
          <StatusBar barStyle="dark-content" />

          <Image
            source={require("../assets/OIP2.png")}
            style={Styles.gifStyle}
            resizeMode="contain"
          />

          <Text style={Styles.welcomeText}>Bienvenido</Text>

          <Text style={Styles.bodyText}>BottomSheet</Text>

          <Pressable style={Styles.customButton} onPress={handleCloseSheet}>
            <Text style={Styles.customButtonText}>Entendido</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#311c7cff",
  },

  handleIndicator: {
    backgroundColor: "#311c7cff",
    width: 60,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },

  gifStyle: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },

  bodyText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },

  customButton: {
    marginTop: 15,
    backgroundColor: "#311c7cff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  customButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
