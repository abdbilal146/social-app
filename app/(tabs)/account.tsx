import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { SettingsIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Switch } from "@/components/ui/switch";

import { VStack } from "@/components/ui/vstack";
import { useActionSheet } from "@/contexts/ActionSheetContext";
import { useDrawer } from "@/contexts/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import { Dimensions, StyleSheet, Text, View } from "react-native";


const { width, height } = Dimensions.get("window");

export default function Account() {
  const { openActionSheet, setBodyContent, closeActionSheet } = useActionSheet();
  const { openDrawer, setDrawerContent } = useDrawer();

  return (
    <>
      <View
        style={styles.accountViewStyle}
      >
        <VStack
          style={styles.accountContainerVStackStyle}

        >
          {/* header */}
          <Box style={styles.settingsIconContainerStyle}>

            <Button onPress={() => {
              console.log("settings");
              setDrawerContent(
                <SettingsBody />
              )
              openDrawer()
            }} variant="outline" size="xl">
              <ButtonIcon as={SettingsIcon}></ButtonIcon>
            </Button>
          </Box>
          {/* Avatar */}
          <Box style={{ marginTop: 30 }}>
            <Avatar size="xl">
              <AvatarFallbackText>Icon</AvatarFallbackText>
              <AvatarImage
                source={require("../../assets/photo.jpg")}
              ></AvatarImage>
              <AvatarBadge />
            </Avatar>
          </Box>

          <Text
            style={styles.accountText}
          >
            Mancer Abd-ElFetah
          </Text>
          <Box style={{ marginTop: 100 }}>
            <VStack style={styles.vStackStyle}>
              {/* Mon Compte */}
              <Pressable onPress={() => {
                openActionSheet()
                setBodyContent(
                  <AccountBody onSubmit={() => {
                    setTimeout(() => {
                      closeActionSheet()
                    }, 1000)
                  }} />
                )
              }} style={styles.pressableStyle}>
                <Text style={styles.accountText}>
                  Mon Compte
                </Text>
                <Ionicons name="pencil" color={"white"} size={24}></Ionicons>
              </Pressable>
              {/* Mes Informations personelles */}
              <Pressable
                onPress={() => {
                  openActionSheet()
                  setBodyContent(
                    <PersonaInfoBody />
                  )
                }}
                style={styles.pressableStyle}
              >
                <Text style={styles.accountText}>
                  Mes Informations personelles
                </Text>
                <Ionicons name="pencil" color={"white"} size={24}></Ionicons>
              </Pressable>
              {/* Se deconnecter */}
              <Pressable
                onPress={() => {

                }}
                style={styles.pressableStyle}
              >
                <Text style={styles.accountText}>
                  Se deconnecter
                </Text>
                <Ionicons name="log-out" color={"white"} size={24}></Ionicons>
              </Pressable>

            </VStack>
          </Box>
        </VStack>

      </View>
    </>
  );
}


function PersonaInfoBody() {
  return (
    <View>

    </View>
  )
}


function AccountBody({ onSubmit }: { onSubmit: () => void }) {
  const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
  const handleSubmit = () => {
    setSpinnerIsVisible(true);
    onSubmit();
  }
  const emailPlaceholder: string = "Entrer votre email"
  const emailLabel: string = "Email"
  const emailExemple: string = "mancer@abdel.com"

  const passwordPlaceholder: string = "Entrer votre mot de passe"
  const passwordLabel: string = "Mot de passe"
  const passwordExemple: string = "mancer@abdel.com"

  const buttonLable: string = "Modifier"
  return (
    <View style={styles.actionbSheetBodyContainerStyle}>
      <VStack style={styles.vStackStyle}>
        <FormControl style={styles.formControlStyle} >
          <FormControlLabel>
            <FormControlLabelText>{emailLabel}</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField placeholder={emailPlaceholder} defaultValue={emailExemple}></InputField>
          </Input>
        </FormControl>

        <FormControl style={styles.formControlStyle} >
          <FormControlLabel>
            <FormControlLabelText>{passwordLabel}</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="password" placeholder={passwordPlaceholder} defaultValue={passwordExemple}></InputField>
          </Input>
        </FormControl>
        <Button style={styles.submitButtonStyle} onPress={handleSubmit}>
          {spinnerIsVisible ? <ButtonSpinner /> : <ButtonText>{buttonLable}</ButtonText>}
        </Button>
      </VStack>
    </View>
  )
}


function SettingsBody() {
  return (
    <View>
      <VStack style={styles.settingsBodyHeaderContainerStyle}>
        <Text style={styles.settingsBodyHeaderTextStyle}>Settings</Text>
        <Divider style={styles.settingsBodyHeaderDividerStyle} />
      </VStack>
      <VStack style={styles.settingsBodyHeaderContainerStyle} >
        <HStack style={styles.switchContainerStyle}>
          <Text style={styles.switchText}>clair</Text>
          <Switch size="lg"></Switch>
          <Text style={styles.switchText}>obscur</Text>
        </HStack>
      </VStack>
    </View>
  )
}

function LoginScreen() {
  <View>
    <Text>Connexion</Text>
    <FormControl></FormControl>
    <FormControl></FormControl>
    <Button></Button>
  </View>
}

function RegisterScreen() {
  <View>
    <Text>Inscription</Text>
    <FormControl></FormControl>
    <FormControl></FormControl>
    <Button></Button>
  </View>
}



const styles = StyleSheet.create({
  accountViewStyle: {
    backgroundColor: "#1c2b21",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  accountContainerVStackStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "20%",
    width: "100%",
  },
  accountText: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  },
  settingsIconContainerStyle: {
    marginTop: 20,
    marginRight: 30,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  pressableStyle: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vStackStyle: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  actionbSheetBodyContainerStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",

  },
  formControlStyle: {
    width: "80%",
  },
  submitButtonStyle: {
    marginTop: 20,
    width: "80%",
  },

  settingsBodyHeaderContainerStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 20,
    marginTop: height * 0.08,
  },
  settingsBodyHeaderTextStyle: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  },
  settingsBodyHeaderDividerStyle: {
    backgroundColor: "white",
    width: "85%",
  },
  switchContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 20,
  },
  switchText: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  }


})