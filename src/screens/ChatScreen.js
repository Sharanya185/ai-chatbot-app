import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChatInput from '../components/ChatInput';
import { getAIResponse } from '../services/aiService';
import { loadHistory, saveHistory, clearHistory } from '../services/storageService';
import { colors } from '../theme/colors';

let idCounter = 0;
const nextId = () => `${Date.now()}_${idCounter++}`;

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);
  const listRef = useRef(null);

  // Load saved chat history on first mount
  useEffect(() => {
    (async () => {
      const saved = await loadHistory();
      setMessages(saved);
      setIsBooting(false);
    })();
  }, []);

  // Persist history whenever messages change
  useEffect(() => {
    if (!isBooting) {
      saveHistory(messages);
    }
  }, [messages, isBooting]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = useCallback(
    async (text) => {
      setErrorBanner(null);

      const userMessage = {
        id: nextId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      const updated = [...messages, userMessage];
      setMessages(updated);
      setIsLoading(true);
      scrollToEnd();

      try {
        const reply = await getAIResponse(
          updated
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content }))
        );

        const assistantMessage = {
          id: nextId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setErrorBanner(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
        scrollToEnd();
      }
    },
    [messages, scrollToEnd]
  );

  const handleClear = useCallback(async () => {
    await clearHistory();
    setMessages([]);
    setErrorBanner(null);
  }, []);

  if (isBooting) {
    return (
      <View style={styles.bootContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {errorBanner && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorBanner}</Text>
        </View>
      )}

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Say hello 👋</Text>
          <Text style={styles.emptySubtitle}>
            Ask me anything — your conversation is saved on this device.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
        />
      )}

      {isLoading && <TypingIndicator />}

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  bootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 12,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
