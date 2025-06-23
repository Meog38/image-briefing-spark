
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PromptGenerator = () => {
  const [briefing, setBriefing] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!briefing.trim()) {
      toast.error('Por favor, insira um briefing para gerar o prompt');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-visual-prompt', {
        body: { briefing }
      });

      if (error) {
        throw error;
      }

      setGeneratedPrompt(data.prompt);
      toast.success('Prompt visual gerado com sucesso!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Erro ao gerar prompt. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success('Prompt copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gerador de Prompt Visual
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforme seu briefing de anúncio em um prompt visual estruturado e criativo para gerar imagens incríveis com IA
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Entrada
                </Badge>
                Briefing do Anúncio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Descreva seu briefing de anúncio aqui... Seja específico sobre o produto, público-alvo, tom da campanha, cores, estilo visual e outros detalhes relevantes para a criação da imagem."
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  className="min-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Dica: Quanto mais detalhado o briefing, melhor será o prompt gerado
                </p>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isLoading || !briefing.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Gerando Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Gerar Prompt Criativo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Saída
                </Badge>
                Prompt Visual Gerado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPrompt ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {generatedPrompt}
                      </p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      ✨ <strong>Prompt pronto!</strong> Você pode usar este prompt em ferramentas como DALL-E, Midjourney, Stable Diffusion ou qualquer outro gerador de imagens IA.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
                  <Sparkles className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-center">
                    Insira seu briefing e clique em "Gerar" para ver o prompt visual aqui
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Separator className="mb-6" />
          <p className="text-sm text-gray-500">
            Powered by OpenAI GPT-4 • Criado para transformar ideias em imagens incríveis
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;
