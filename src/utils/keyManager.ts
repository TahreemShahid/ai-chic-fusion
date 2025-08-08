// Utility to read API keys from keys.txt file
export class KeyManager {
  private static keys: Record<string, string> = {};
  private static isLoaded = false;

  static async loadKeys(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/keys.txt');
      if (!response.ok) {
        throw new Error('keys.txt file not found');
      }
      
      const content = await response.text();
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const [key, value] = trimmed.split('=');
        if (key && value) {
          this.keys[key.trim()] = value.trim();
        }
      }
      
      this.isLoaded = true;
      console.log('API keys loaded successfully');
    } catch (error) {
      console.error('Failed to load keys.txt:', error);
      throw new Error('Could not load API keys from keys.txt file');
    }
  }

  static async getKey(keyName: string): Promise<string | null> {
    await this.loadKeys();
    return this.keys[keyName] || null;
  }

  static async getOpenAIKey(): Promise<string | null> {
    return this.getKey('OPENAI_API_KEY');
  }

  static async getAnthropicKey(): Promise<string | null> {
    return this.getKey('ANTHROPIC_API_KEY');
  }

  static async getCohereKey(): Promise<string | null> {
    return this.getKey('COHERE_API_KEY');
  }

  static async getGoogleKey(): Promise<string | null> {
    return this.getKey('GOOGLE_API_KEY');
  }

  static getAllLoadedKeys(): Record<string, string> {
    return { ...this.keys };
  }
}