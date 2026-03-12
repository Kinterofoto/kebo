import React from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/config/supabase";
import { showToast } from "@/components/ui/custom-toast";
import { translate } from "@/i18n";
import { useTranslation } from "react-i18next";
import { useStores } from "@/models/helpers/use-stores";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Text, Button } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { useDeleteUserAccount } from "@/lib/api/hooks";
import logger from "@/utils/logger";

export default function DeleteAccountSheet() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { transactionModel } = useStores();
  const deleteAccount = useDeleteUserAccount();

  const confirmationWord = t("components:deleteAccountModal.confirm");

  const DeleteAccountSchema = Yup.object().shape({
    confirmation: Yup.string()
      .required(translate("components:deleteAccountModal.confirmMessage"))
      .equals(
        [confirmationWord],
        translate("components:deleteAccountModal.deleteCondition")
      ),
  });

  const handleDeleteAccount = async () => {
    try {
      logger.debug("Cleaning transaction data before deleting account");
      transactionModel.resetAllData();

      await deleteAccount.mutateAsync();
      await GoogleSignin.signOut();

      showToast(
        "warning",
        translate("components:deleteAccountModal.deleteAccountSuccess")
      );
      await supabase.auth.signOut();
    } catch (error: any) {
      logger.error("Error deleting account:", error);
      if (error?.data) {
        logger.error("API error details:", JSON.stringify(error.data));
      }
      showToast(
        "error",
        translate("components:deleteAccountModal.deleteAccountError")
      );
    }
  };

  const formik = useFormik({
    initialValues: { confirmation: "" },
    validationSchema: DeleteAccountSchema,
    onSubmit: handleDeleteAccount,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[tw`flex-1`, { backgroundColor: theme.background }]}
      >
        <ScrollView
          contentContainerStyle={tw`p-6 pt-4`}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`items-center mb-2`}>
            <Text type="lg" weight="semibold" color="#EF4444">
              {translate("components:deleteAccountModal.deleteAccount")}
            </Text>
          </View>

          <Text
            weight="light"
            style={tw`text-base text-center mb-6`}
            color={theme.textSecondary}
          >
            {translate("components:deleteAccountModal.deleteAccountBody")}
          </Text>

          <Text
            weight="medium"
            style={tw`text-base text-center mb-4`}
            color={theme.textSecondary}
          >
            {translate("components:deleteAccountModal.deleteAccountBody2")}
          </Text>

          <TextInput
            style={[
              tw`border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-base mb-2`,
              { color: theme.textPrimary, fontFamily: "SFUIDisplayRegular" },
            ]}
            placeholder={confirmationWord}
            placeholderTextColor={theme.textTertiary}
            value={formik.values.confirmation}
            onChangeText={formik.handleChange("confirmation")}
            onBlur={formik.handleBlur("confirmation")}
            autoCapitalize="none"
          />

          {formik.touched.confirmation && formik.errors.confirmation && (
            <Text style={tw`text-red-500 mb-4`}>
              {formik.errors.confirmation}
            </Text>
          )}

          <View style={tw`flex-row justify-end mt-6 gap-4`}>
            <Button
              variant="soft"
              color="secondary"
              onPress={() => router.back()}
              title={translate("components:deleteAccountModal.cancel")}
              radius="lg"
            />
            <Button
              variant="solid"
              color="danger"
              onPress={() => formik.handleSubmit()}
              disabled={deleteAccount.isPending}
              loading={deleteAccount.isPending}
              title={translate("components:deleteAccountModal.deleteAccount")}
              radius="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
