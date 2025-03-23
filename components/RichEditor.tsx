import { KeyboardAvoidingView, Platform } from 'react-native';
import { Container } from '~/components/Container';
import { useColorScheme } from '~/lib/useColorScheme';
import {
  CoreBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { useEffect } from 'react';

export default function RichEditor({ data, mutation }) {
  const { isDarkColorScheme } = useColorScheme();

  const customFont = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Montserrat', sans-serif;
color:${isDarkColorScheme ? 'hsl(229.76 31.78% 74.71%)' : 'hsl(222.2 84% 4.9%)'}
    }

    blockquote {
      border-left: 3px solid ${isDarkColorScheme ? 'hsl(232.5 15.38% 30.59%)' : 'hsl(214.3 31.8% 91.4%)'};
      padding-left: 1rem;
    }
    
    .highlight-background {
      background-color: ${isDarkColorScheme ? 'hsl(232.5 15.44% 18.32%)' : 'hsl(210 40% 96.1%)'};
    }
  `;

  const initial = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'Title',
          },
        ],
      },
      {
        type: 'image',
        attrs: {
          src: 'https://images.pexels.com/photos/16361105/pexels-photo-16361105/free-photo-of-cat-sleeping-by-the-window.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          alt: '',
          title: null,
        },
      },
      {
        type: 'heading',
        attrs: {
          level: 3,
        },
        content: [
          {
            type: 'text',
            text: 'Description',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'code',
              },
            ],
            text: '#tags',
          },
        ],
      },
    ],
  };

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initial,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customFont), // Custom font
    ],
    theme: {
      toolbar: {
        toolbarBody: {
          borderTopColor: isDarkColorScheme ? 'hsl(232.5 15.38% 30.59%)' : 'hsl(214.3 31.8% 91.4%)',
          borderBottomColor: isDarkColorScheme
            ? 'hsl(232.5 15.38% 30.59%)'
            : 'hsl(214.3 31.8% 91.4%)',
          backgroundColor: isDarkColorScheme ? 'hsl(234.55 17.46% 12.35%)' : 'hsl(0 0% 100%)',
        },
        toolbarButton: {
          backgroundColor: isDarkColorScheme ? 'hsl(234.55 17.46% 12.35%)' : 'hsl(0 0% 100%)',
        },
        iconDisabled: {
          tintColor: isDarkColorScheme ? 'hsl(233.79 11.37% 50%)' : 'hsl(215.4 16.3% 46.9%)',
        },
        iconWrapperActive: {
          backgroundColor: isDarkColorScheme ? 'hsl(225.45 71.22% 72.75%)' : 'hsl(210 40% 96.1%)',
        },
        iconWrapper: {
          borderRadius: 4,
          backgroundColor: isDarkColorScheme ? 'hsl(234.55 17.46% 12.35%)' : 'hsl(0 0% 100%)',
        },
        hidden: {
          display: 'none',
        },
        icon: {
          tintColor: isDarkColorScheme ? 'hsl(229.76 31.78% 74.71%)' : 'hsl(222.2 84% 4.9%)',
        },
        linkBarTheme: {
          addLinkContainer: {
            backgroundColor: isDarkColorScheme ? 'hsl(234.55 17.46% 12.35%)' : 'hsl(0 0% 100%)',
            borderTopColor: isDarkColorScheme
              ? 'hsl(232.5 15.38% 30.59%)'
              : 'hsl(214.3 31.8% 91.4%)',
            borderBottomColor: isDarkColorScheme
              ? 'hsl(232.5 15.38% 30.59%)'
              : 'hsl(214.3 31.8% 91.4%)',
          },
          linkInput: {
            backgroundColor: isDarkColorScheme ? 'hsl(234.55 17.46% 12.35%)' : 'hsl(0 0% 100%)',
            color: isDarkColorScheme ? 'hsl(229.76 31.78% 74.71%)' : 'hsl(222.2 84% 4.9%)',
          },
          placeholderTextColor: isDarkColorScheme
            ? 'hsl(233.79 11.37% 50%)'
            : 'hsl(215.4 16.3% 46.9%)',
          doneButton: {
            backgroundColor: isDarkColorScheme ? 'hsl(0 0% 82.75%)' : 'hsl(220.47 98.26% 36.08%)',
          },
          doneButtonText: {
            color: isDarkColorScheme ? 'hsl(0 0% 20%)' : 'hsl(210 40% 98%)',
          },
          linkToolbarButton: {},
        },
      },
      colorKeyboard: {
        keyboardRootColor: isDarkColorScheme ? 'hsl(240 13.73% 10%)' : 'hsl(0 0% 100%)',
        colorSelection: [
          {
            name: 'Primary',
            value: isDarkColorScheme ? 'hsl(0 0% 82.75%)' : 'hsl(220.47 98.26% 36.08%)',
          },
          {
            name: 'Secondary',
            value: isDarkColorScheme ? 'hsl(225.45 71.22% 72.75%)' : 'hsl(210 40% 96.1%)',
          },
          {
            name: 'Accent',
            value: isDarkColorScheme ? 'hsl(234.55 17.83% 9.47%)' : 'hsl(210 40% 96.1%)',
          },
          {
            name: 'Destructive',
            value: isDarkColorScheme ? 'hsl(1.58 47.5% 52.94%)' : 'hsl(0 92.99% 56.11%)',
          },
        ],
      },
      webview: {
        backgroundColor: isDarkColorScheme ? 'hsl(240 13.73% 10%)' : 'hsl(0 0% 100%)',
      },
    },
  });

  const content = useEditorContent(editor, {
    type: 'json',
    debounceInterval: 1000,
  });

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <>
      <Container>
        <RichText editor={editor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
          }}>
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}
