import { Stack, useLocalSearchParams } from 'expo-router';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Settings() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Container></Container>
    </>
  );
}
