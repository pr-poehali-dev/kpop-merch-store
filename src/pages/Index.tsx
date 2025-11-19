import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

const API = {
  products: 'https://functions.poehali.dev/4fa4a8b9-0447-43a1-8d04-823ecc126136',
  auth: 'https://functions.poehali.dev/a8e62537-87aa-49fd-8f86-2340ee960ac7',
  support: 'https://functions.poehali.dev/aea623fc-7012-49fc-9371-38e625ac77df'
};

const Index = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportSession, setSupportSession] = useState<number | null>(null);
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeTab, searchQuery]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeTab !== 'all') params.append('category', activeTab);
      
      const response = await fetch(`${API.products}?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch(API.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name')
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setIsAuthOpen(false);
      } else {
        alert(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch(API.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setIsAuthOpen(false);
      } else {
        alert(data.error || 'Неверные данные');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const openSupportChat = async () => {
    if (!user) {
      alert('Войдите, чтобы связаться с поддержкой');
      return;
    }
    
    setIsSupportOpen(true);
    
    try {
      const response = await fetch(API.support, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          user_id: user.id
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setSupportSession(data.session_id);
        loadSupportMessages(data.session_id);
      }
    } catch (error) {
      console.error('Failed to create support session:', error);
    }
  };

  const loadSupportMessages = async (sessionId: number) => {
    try {
      const response = await fetch(`${API.support}?session_id=${sessionId}`);
      const data = await response.json();
      if (response.ok) {
        setSupportMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendSupportMessage = async () => {
    if (!newMessage.trim() || !supportSession || !user) return;
    
    try {
      const response = await fetch(API.support, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          session_id: supportSession,
          user_id: user.id,
          message: newMessage,
          is_admin: false
        })
      });
      
      if (response.ok) {
        setNewMessage('');
        loadSupportMessages(supportSession);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? {...item, quantity} : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">K</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Kar's Store
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={openSupportChat}>
                <Icon name="MessageCircle" size={20} />
              </Button>

              {user ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Icon name="User" size={20} />
                      {user.name}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Профиль</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Имя</Label>
                        <p className="text-lg">{user.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-lg">{user.email}</p>
                      </div>
                      <div>
                        <Label>Роль</Label>
                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                          {user.role === 'owner' ? 'Владелец' : 'Покупатель'}
                        </Badge>
                      </div>
                      <Button onClick={handleLogout} variant="outline" className="w-full">
                        Выйти
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="User" size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Вход / Регистрация</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="login">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" name="email" placeholder="your@email.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Пароль</Label>
                            <Input type="password" name="password" placeholder="••••••••" required />
                          </div>
                          <Button type="submit" className="w-full">Войти</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Имя</Label>
                            <Input type="text" name="name" placeholder="Ваше имя" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" name="email" placeholder="your@email.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Пароль</Label>
                            <Input type="password" name="password" placeholder="••••••••" required />
                          </div>
                          <Button type="submit" className="w-full">Зарегистрироваться</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full pt-6">
                    <ScrollArea className="flex-1 -mx-6 px-6">
                      {cart.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Корзина пуста</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map(item => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{item.price} ₽</p>
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        size="icon" 
                                        variant="outline" 
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        <Icon name="Minus" size={14} />
                                      </Button>
                                      <span className="w-8 text-center">{item.quantity}</span>
                                      <Button 
                                        size="icon" 
                                        variant="outline" 
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Icon name="Plus" size={14} />
                                      </Button>
                                      <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 ml-auto"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Icon name="Trash2" size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    
                    {cart.length > 0 && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span>{cartTotal} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Чат поддержки</DialogTitle>
            <DialogDescription>Задайте ваш вопрос, и мы поможем вам!</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {supportMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <Card className={msg.is_admin ? 'bg-muted' : 'bg-primary text-primary-foreground'}>
                    <CardContent className="p-3">
                      <p className="text-sm font-semibold mb-1">{msg.user_name}</p>
                      <p className="text-sm">{msg.message}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && sendSupportMessage()}
            />
            <Button onClick={sendSupportMessage}>
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 text-sm">Новая коллекция</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Лучший мерч<br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                твоих айдолов
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Официальные альбомы, фотокарточки и постеры K-pop групп
            </p>
            <div className="max-w-md mx-auto mb-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Icon name="Search" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="albums">Альбомы</TabsTrigger>
              <TabsTrigger value="photocards">Карточки</TabsTrigger>
              <TabsTrigger value="posters">Постеры</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button 
                        className="w-full gap-2"
                        onClick={() => addToCart(product)}
                      >
                        <Icon name="ShoppingCart" size={18} />
                        В корзину
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={14} 
                          className={i < product.rating ? 'fill-primary text-primary' : 'text-muted'}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      <Badge variant="secondary">В наличии: {product.stock}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </div>
      </section>

      <footer className="border-t py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Kar's Store</h3>
              <p className="text-sm text-muted-foreground">
                Официальный K-pop мерч с доставкой по всей России
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Альбомы</li>
                <li>Фотокарточки</li>
                <li>Постеры</li>
                <li>Аксессуары</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Помощь</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Доставка</li>
                <li>Оплата</li>
                <li>Возврат</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+7 (999) 123-45-67</li>
                <li>info@karsstore.com</li>
                <li>Москва, ул. Арбат, 15</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Kar's Store. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
