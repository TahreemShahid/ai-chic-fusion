import React, { useState, useEffect } from 'react';
import { Settings, Key, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  name: string;
  key: string;
  provider: string;
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState({ name: '', key: '', provider: '' });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('aiChat_apiKeys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    }
  }, []);

  // Save API keys to localStorage whenever apiKeys changes
  useEffect(() => {
    localStorage.setItem('aiChat_apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const addApiKey = () => {
    if (!newKey.name || !newKey.key || !newKey.provider) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const keyExists = apiKeys.some(key => key.name === newKey.name);
    if (keyExists) {
      toast({
        title: "Error",
        description: "API key with this name already exists",
        variant: "destructive"
      });
      return;
    }

    setApiKeys([...apiKeys, { ...newKey }]);
    setNewKey({ name: '', key: '', provider: '' });
    toast({
      title: "Success",
      description: "API key added successfully"
    });
  };

  const removeApiKey = (name: string) => {
    setApiKeys(apiKeys.filter(key => key.name !== name));
    toast({
      title: "Success",
      description: "API key removed successfully"
    });
  };

  const toggleKeyVisibility = (name: string) => {
    setShowKeys(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const getApiKey = (name: string): string | null => {
    const key = apiKeys.find(k => k.name === name);
    return key ? key.key : null;
  };

  // Export function for other components to use
  React.useEffect(() => {
    (window as any).getApiKey = getApiKey;
  }, [apiKeys]);

  return (
    <Card className="chat-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          API Key Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New API Key */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Add New API Key</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="keyName">Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., OpenAI"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                placeholder="e.g., OpenAI, Anthropic"
                value={newKey.provider}
                onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={newKey.key}
                onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addApiKey} className="hero-gradient text-white">
            <Save className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>

        {/* Existing API Keys */}
        {apiKeys.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Saved API Keys</h3>
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div key={key.name} className="flex items-center gap-4 p-3 border rounded-lg chat-container">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{key.name}</div>
                    <div className="text-sm text-muted-foreground">{key.provider}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showKeys[key.name] ? 'text' : 'password'}
                      value={key.key}
                      readOnly
                      className="w-40"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility(key.name)}
                    >
                      {showKeys[key.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeApiKey(key.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> API keys are stored locally in your browser and never sent to our servers.</p>
          <p>Supported providers: OpenAI, Anthropic, Cohere, and other compatible APIs.</p>
        </div>
      </CardContent>
    </Card>
  );
}
