import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, BookOpen, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Word {
  id: string;
  word: string;
  length: number;
  starts_with: string;
  ends_with: string;
  usage_count: number;
  is_active: boolean;
}

const WordsManagement = () => {
  const [words, setWords] = useState<Word[]>([
    { id: '1', word: 'kitob', length: 5, starts_with: 'k', ends_with: 'b', usage_count: 45, is_active: true },
    { id: '2', word: 'bola', length: 4, starts_with: 'b', ends_with: 'a', usage_count: 38, is_active: true },
    { id: '3', word: 'ata', length: 3, starts_with: 'a', ends_with: 'a', usage_count: 32, is_active: true },
    { id: '4', word: 'osh', length: 3, starts_with: 'o', ends_with: 'h', usage_count: 28, is_active: true },
    { id: '5', word: 'holat', length: 5, starts_with: 'h', ends_with: 't', usage_count: 25, is_active: true },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newWord, setNewWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredWords = words.filter(word => 
    word.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWord = async () => {
    if (!newWord.trim()) {
      toast({
        title: "Xato",
        description: "So'z kiritilmagan",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const word = newWord.trim().toLowerCase();
    const newWordEntry: Word = {
      id: Date.now().toString(),
      word,
      length: word.length,
      starts_with: word.charAt(0),
      ends_with: word.charAt(word.length - 1),
      usage_count: 0,
      is_active: true
    };

    setWords(prev => [newWordEntry, ...prev]);
    setNewWord("");
    setIsLoading(false);
    
    toast({
      title: "Muvaffaqiyat",
      description: `"${word}" so'zi qo'shildi`,
      variant: "default"
    });
  };

  const handleDeleteWord = async (wordId: string, word: string) => {
    setWords(prev => prev.filter(w => w.id !== wordId));
    toast({
      title: "O'chirildi",
      description: `"${word}" so'zi o'chirildi`,
      variant: "default"
    });
  };

  const handleRefreshDictionary = async () => {
    setIsLoading(true);
    // Simulate API call to refresh dictionary
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Yangilandi",
      description: "So'zlar bazasi yangilandi",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            So'zlar Bazasi Boshqaruvi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new word */}
          <div className="flex gap-2">
            <Input
              placeholder="Yangi so'z qo'shish..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
            />
            <Button 
              onClick={handleAddWord} 
              disabled={isLoading}
              className="bg-gradient-to-r from-success to-success/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Qo'shish
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefreshDictionary}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Yangilash
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="So'z qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Words List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>So'zlar Ro'yxati</CardTitle>
            <Badge variant="secondary">{filteredWords.length} ta so'z</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredWords.map((word) => (
              <div 
                key={word.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-primary">
                    {word.word}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {word.length} harf
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {word.starts_with} → {word.ends_with}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {word.usage_count} marta ishlatilgan
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {word.is_active ? (
                    <Badge variant="default" className="bg-success">Faol</Badge>
                  ) : (
                    <Badge variant="destructive">Nofaol</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWord(word.id, word.word)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredWords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Hech qanday so'z topilmadi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordsManagement;