import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <View
      style={[
        styles.row,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser && styles.userBubble,
          !isUser && !isError && styles.assistantBubble,
          isError && styles.errorBubble,
        ]}
      >
        <Text style={[styles.text, isError && styles.errorText]}>
          {message.content}
        </Text>
        {message.timestamp ? (
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.bubbleUser,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.bubbleAssistant,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBubble: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  errorText: {
    color: colors.danger,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
