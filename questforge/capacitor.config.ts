import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kiawen.questforge',
  appName: 'QuestForge',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
