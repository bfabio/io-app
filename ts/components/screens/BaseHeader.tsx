import { Body, Button, Left, Right, Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";

import IconFont from "../../components/ui/IconFont";
import AppHeader from "../ui/AppHeader";

import I18n from "../../i18n";
import variables from "../../theme/variables";
import GoBackButton from "../GoBackButton";
import { InstabugButtons } from "../InstabugButtons";

const styles = StyleSheet.create({
  helpButton: {
    padding: 8
  },

  noLeft: {
    marginLeft: variables.contentPadding - variables.appHeaderPaddingHorizontal
  }
});

interface OwnProps {
  headerTitle?: string;
  goBack?: React.ComponentProps<typeof GoBackButton>["goBack"];
  primary?: boolean;
  appLogo?: boolean;
  onShowHelp?: () => void;
  // A property to set a custom AppHeader body
  body?: React.ReactNode;
}

type Props = OwnProps;

export class BaseHeader extends React.PureComponent<Props> {
  public render() {
    const { appLogo, goBack, headerTitle, onShowHelp, body } = this.props;
    return (
      <AppHeader primary={this.props.primary}>
        {appLogo ? (
          <Left>
            <View>
              <IconFont
                name="io-logo"
                color={this.props.primary ? "white" : variables.brandPrimary}
              />
            </View>
          </Left>
        ) : (
          goBack && (
            <Left>
              <GoBackButton
                testID="back-button"
                onPress={goBack}
                accessible={true}
                accessibilityLabel={I18n.t("global.buttons.back")}
              />
            </Left>
          )
        )}
        <Body style={goBack ? {} : styles.noLeft}>
          {body
            ? body
            : headerTitle && (
                <Text white={this.props.primary} numberOfLines={1}>
                  {headerTitle}
                </Text>
              )}
        </Body>
        <Right>
          <InstabugButtons />
          {onShowHelp && (
            <Button
              onPress={onShowHelp}
              style={styles.helpButton}
              transparent={true}
            >
              <IconFont name="io-question" />
            </Button>
          )}
        </Right>
      </AppHeader>
    );
  }
}
