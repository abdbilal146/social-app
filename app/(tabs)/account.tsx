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
import React, { useEffect, useState } from "react";

import { Dimensions, StyleSheet, Text, View } from "react-native";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, User } from "firebase/auth"
import { auth, db } from "../../firebaseConfig"
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function Account() {
  const { openActionSheet, setBodyContent, closeActionSheet } = useActionSheet();
  const { openDrawer, setDrawerContent } = useDrawer();
  const [user, setUser] = useState<User | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>("")


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAccountEmail(currentUser.email)
        setUser(currentUser)
      }
      else {
        setUser(null)
      }
    });
    return () => unsubscribe()
  }, [])


  const signOutFromAccount = () => {
    signOut(auth).then(() => {
      console.log("user sign Out succes!")
    }).catch((e) => {
      console.log(e)
    })
  }



  return (

    <>
      {user ? <View
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
            {accountEmail}
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
                  signOutFromAccount()
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

      </View> : <LoginScreen></LoginScreen>}
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
  const [accountEmail, setAccountEmail] = useState<string | null>(auth.currentUser?.email!)
  const [accountPassword, setAccountPassword] = useState<string | null>("")

  const updateUserAccountInfo = async () => {
    try {
      setSpinnerIsVisible(true);
      if (auth.currentUser?.email !== accountEmail) {
        await updateEmail(auth.currentUser!, accountEmail!)
      }

      if (accountPassword?.length! > 0) {
        await updatePassword(auth.currentUser!, accountPassword!)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setSpinnerIsVisible(false);
      onSubmit();
    }
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
            <InputField onChangeText={setAccountEmail} placeholder={emailPlaceholder} defaultValue={accountEmail!}></InputField>
          </Input>
        </FormControl>

        <FormControl style={styles.formControlStyle} >
          <FormControlLabel>
            <FormControlLabelText>{passwordLabel}</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField onChangeText={setAccountPassword} type="password" placeholder={passwordPlaceholder} defaultValue={passwordExemple}></InputField>
          </Input>
        </FormControl>
        <Button style={styles.submitButtonStyle} onPress={updateUserAccountInfo}>
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
  const registerLabel: string = "S'Inscrire"
  const emailPlaceholder: string = "Entrer votre email"
  const passwordPlaceholder: string = "Entrer votre mot de passe"
  const emailLabel: string = "Email"
  const passwordLabel: string = 'Mot De Passe'

  const [registerSectionVisibility, setRegisterSectionVisibility] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loader, setLoader] = useState<boolean>(false)

  const handleLogin = async () => {
    try {
      setLoader(true)
      await signInWithEmailAndPassword(auth, email, password);

    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      {
        registerSectionVisibility === false ? <View style={styles.loginViewContainerStyle}>
          <View style={styles.loginScreenTitleContainer}><Text style={styles.authScreenTitle}>Connexion</Text></View>

          <Divider style={styles.settingsBodyHeaderDividerStyle}></Divider>
          <FormControl style={styles.formControlStyle}>
            <FormControlLabel>
              <FormControlLabelText>{emailLabel}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField onChangeText={setEmail} value={email} type="text" placeholder={emailPlaceholder}></InputField>
            </Input>
          </FormControl>

          <FormControl style={styles.formControlStyle}>
            <FormControlLabel>
              <FormControlLabelText>{passwordLabel}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField onChangeText={setPassword} value={password} type="password" placeholder={passwordPlaceholder}>
              </InputField>
            </Input>
          </FormControl>
          <Button onPress={handleLogin} style={styles.submitButtonStyle}>
            <ButtonText>Se Connecter</ButtonText>
            {loader && <ButtonSpinner></ButtonSpinner>}
          </Button>
          <Pressable onPress={() => {
            setRegisterSectionVisibility(true)
          }}>
            <Text>{registerLabel}</Text>
          </Pressable>
        </View> : <RegisterScreen setRegisterVisibility={() => setRegisterSectionVisibility(false)} />
      }
    </>
  )
}

function RegisterScreen({ setRegisterVisibility }: { setRegisterVisibility: () => void }) {

  const loginLabel: string = "Se Connecter"
  const emailPlaceholder: string = "Entrer votre email"
  const passwordPlaceholder: string = "Entrer votre mot de passe"
  const passwordConfirmPlaceholder: string = "Confirmer votre Mot de passe"

  const emailLabel: string = "Email"
  const passwordLabel: string = 'Mot De Passe'
  const passwordConfirmLabel: string = 'Confimer Mot De Passe'

  const [loader, setLoader] = useState<boolean>(false)
  const [password, setPassword] = useState<string>()
  const [passwordConfirm, setPasswordConfirm] = useState<string>()
  const [email, setEmail] = useState<string>()



  const handleRegister = async () => {
    try {
      setLoader(true)
      if (password === passwordConfirm && email?.length! > 0) {
        const userCredentials = await createUserWithEmailAndPassword(auth, email!, password!)

        const user = userCredentials.user

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }).then(() => console.log("document is created")).
          catch(e => console.log(e))
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }

  }
  return (
    <View style={styles.loginViewContainerStyle}>
      <View style={styles.loginScreenTitleContainer}><Text style={styles.authScreenTitle}>S'inscrire</Text></View>

      <Divider style={styles.settingsBodyHeaderDividerStyle}></Divider>
      <FormControl style={styles.formControlStyle}>
        <FormControlLabel>
          <FormControlLabelText>{emailLabel}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField onChangeText={setEmail} value={email} type="text" placeholder={emailPlaceholder}></InputField>
        </Input>
      </FormControl>

      <FormControl style={styles.formControlStyle}>
        <FormControlLabel>
          <FormControlLabelText>{passwordLabel}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField onChangeText={setPassword} defaultValue={password} type="password" placeholder={passwordPlaceholder}>
          </InputField>
        </Input>
      </FormControl>

      <FormControl style={styles.formControlStyle}>
        <FormControlLabel>
          <FormControlLabelText>{passwordConfirmLabel}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField onChangeText={setPasswordConfirm} defaultValue={passwordConfirm} type="password" placeholder={passwordConfirmPlaceholder}>
          </InputField>
        </Input>
      </FormControl>

      <Button onPress={handleRegister} style={styles.submitButtonStyle}>
        <ButtonText>Se Connecter</ButtonText>
        {loader && <ButtonSpinner></ButtonSpinner>}
      </Button>
      <Pressable onPress={() => {
        setRegisterVisibility()
      }}>
        <Text>{loginLabel}</Text>
      </Pressable>
    </View>
  )
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
  },

  //Login Style
  loginViewContainerStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: height,
    gap: 20,
    backgroundColor: "#1c2b21",
  },
  loginScreenTitleContainer: {
    display: "flex",
    marginTop: height * 0.1
  },
  authScreenTitle: {
    fontSize: 29,
    color: "white",
    fontWeight: 600
  }


})