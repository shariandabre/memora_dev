import * as React from 'react';
import { View, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { GiftedChat, IMessage, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';
import { StatusBar } from 'expo-status-bar';

const BORDER_RADIUS = 8;

// Use your global CSS theme
const getThemeColors = (isDark: boolean) => ({
  background: isDark ? 'hsl(240, 13.73%, 10%)' : 'hsl(0, 0%, 100%)',
  foreground: isDark ? 'hsl(229.76, 31.78%, 74.71%)' : 'hsl(222.2, 84%, 4.9%)',
  muted: isDark ? 'hsl(232.5, 15.44%, 18.32%)' : 'hsl(210, 40%, 96.1%)',
  mutedForeground: isDark ? 'hsl(233.79, 11.37%, 50%)' : 'hsl(215.4, 16.3%, 46.9%)',
  border: isDark ? 'hsl(232.5, 15.38%, 30.59%)' : 'hsl(214.3, 31.8%, 91.4%)',
  input: isDark ? 'hsl(232, 20%, 14.71%)' : 'hsl(214.3, 31.8%, 91.4%)',
  primary: isDark ? 'hsl(0, 0%, 82.75%)' : 'hsl(220.47, 98.26%, 36.08%)',
  primaryForeground: isDark ? 'hsl(0, 0%, 20%)' : 'hsl(210, 40%, 98%)',
});

const genAI = new GoogleGenerativeAI('AIzaSyA4DWs1TQclTKB-prUE_7_WocZ2WET6nQA');

// Updated prompt for an astrologer
const SYSTEM_PROMPT = `You are a knowledgeable and wise astrologer chatbot. Only answer questions related to:
- Zodiac signs
- Horoscopes
- Astrological predictions
- Birth charts
- Planetary influences
- Compatibility between signs
- Astrology tips and advice

If a question is not related to astrology, politely respond that you can only assist with astrology-related questions.

Keep responses clear, insightful, and focused on providing meaningful astrological guidance. When discussing predictions or compatibility, include appropriate disclaimers about the nature of astrology and its limitations.`;

export default function AI() {
  const { isDarkColorScheme } = useColorScheme();
  const isDark = isDarkColorScheme;
  const colors = getThemeColors(isDark);
  const headerHeight = useHeaderHeight();
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! I'm your astrologer AI assistant. I can help you with questions about zodiac signs, horoscopes, birth charts, and more. What would you like to know?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Astrologer AI',
          avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=AI',
        },
      },
    ]);
  }, []);

  const generateAstrologyResponse = async (userMessage: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}\n\nResponse:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.";
    }
  };

  const onSend = React.useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    setIsTyping(true);

    try {
      const userMessage = newMessages[0].text;
      const aiResponse = await generateAstrologyResponse(userMessage);

      const aiMessage: IMessage = {
        _id: Date.now(),
        text: aiResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Astrologer AI',
          avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=AI',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [aiMessage]));
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: IMessage = {
        _id: Date.now(),
        text: 'I apologize, but I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Astrologer AI',
          avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=AI',
        },
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMessage]));
    } finally {
      setIsTyping(false);
    }
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: colors.muted,
            borderRadius: BORDER_RADIUS,
          },
          right: {
            backgroundColor: colors.primary,
            borderRadius: BORDER_RADIUS,
          },
        }}
        textStyle={{
          left: {
            color: colors.foreground,
          },
          right: {
            color: colors.primaryForeground,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          padding: 4,
        }}
        primaryStyle={{
          alignItems: 'center',
        }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{
          backgroundColor: colors.primary,
          borderRadius: BORDER_RADIUS,
          padding: 4,
          marginRight: 4,
          marginBottom: 4,
        }}
        textStyle={{
          color: colors.primaryForeground,
          fontWeight: 'bold',
        }}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View className="items-center justify-center p-3">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <View
        style={{
          marginTop: headerHeight / 2,
          flex: 1,
        }}
        className="bg-background">
        <GiftedChat
          isStatusBarTranslucentAndroid={true}
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          isTyping={isTyping}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderLoading={renderLoading}
          renderAvatar={null}
          placeholder="Ask me about astrology..."
          timeTextStyle={{
            right: { color: colors.mutedForeground },
            left: { color: colors.mutedForeground },
          }}
          textInputStyle={{
            backgroundColor: colors.input,
            borderRadius: BORDER_RADIUS,
            borderColor: colors.border,
            borderWidth: 1,
            color: colors.foreground,
            padding: 12,
            marginLeft: 4,
            marginRight: 4,
            marginBottom: 4,
          }}
          minInputToolbarHeight={60}
          maxComposerHeight={100}
        />
      </View>
    </SafeAreaView>
  );
}
