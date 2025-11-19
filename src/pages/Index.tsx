import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      id: 1,
      name: 'DREAM Album Special Edition',
      category: 'albums',
      price: 2500,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/922a3da0-021b-4f7b-8266-421e0c72e41b.jpg',
      rating: 5,
      reviews: 127,
    },
    {
      id: 2,
      name: 'Photocard Set Limited',
      category: 'photocards',
      price: 800,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/1f1aac20-dd3a-4731-aa87-f2046c04b150.jpg',
      rating: 5,
      reviews: 89,
    },
    {
      id: 3,
      name: 'Concert Poster A3',
      category: 'posters',
      price: 500,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/0bca37fd-3425-4135-9d26-1b19b777c415.jpg',
      rating: 4,
      reviews: 56,
    },
    {
      id: 4,
      name: 'Mini Album Vol.2',
      category: 'albums',
      price: 1800,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/922a3da0-021b-4f7b-8266-421e0c72e41b.jpg',
      rating: 5,
      reviews: 203,
    },
    {
      id: 5,
      name: 'Photocard Random Pack',
      category: 'photocards',
      price: 400,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/1f1aac20-dd3a-4731-aa87-f2046c04b150.jpg',
      rating: 4,
      reviews: 142,
    },
    {
      id: 6,
      name: 'Tour Poster Collection',
      category: 'posters',
      price: 1200,
      image: 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/0bca37fd-3425-4135-9d26-1b19b777c415.jpg',
      rating: 5,
      reviews: 78,
    },
  ];

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="MessageCircle" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Служба поддержки</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Ваше имя</Label>
                      <Input placeholder="Введите имя" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Сообщение</Label>
                      <Textarea placeholder="Опишите вашу проблему" rows={4} />
                    </div>
                    <Button className="w-full">Отправить</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="User" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Вход для владельца</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="admin@karsstore.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Пароль</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button className="w-full">Войти</Button>
                  </div>
                </DialogContent>
              </Dialog>

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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" size="lg">
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Оформление заказа</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[70vh]">
                              <div className="space-y-4 pr-4">
                                <div className="space-y-2">
                                  <Label>Имя</Label>
                                  <Input placeholder="Ваше имя" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Телефон</Label>
                                  <Input placeholder="+7 (___) ___-__-__" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input type="email" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Способ доставки</Label>
                                  <Tabs defaultValue="courier" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="courier">Курьер</TabsTrigger>
                                      <TabsTrigger value="pickup">Самовывоз</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="courier" className="space-y-2 mt-4">
                                      <Label>Адрес доставки</Label>
                                      <Input placeholder="Улица, дом, квартира" />
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="Город" />
                                        <Input placeholder="Индекс" />
                                      </div>
                                      <p className="text-sm text-muted-foreground">Доставка: 500 ₽</p>
                                    </TabsContent>
                                    <TabsContent value="pickup" className="mt-4">
                                      <p className="text-sm text-muted-foreground">
                                        📍 Москва, ул. Арбат, 15<br/>
                                        Пн-Пт: 10:00-20:00<br/>
                                        Сб-Вс: 11:00-19:00
                                      </p>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                                <div className="space-y-2">
                                  <Label>Способ оплаты</Label>
                                  <Tabs defaultValue="card" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                      <TabsTrigger value="card">Карта</TabsTrigger>
                                      <TabsTrigger value="cash">Наличные</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="card" className="space-y-2 mt-4">
                                      <Input placeholder="Номер карты" />
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="ММ/ГГ" />
                                        <Input placeholder="CVV" />
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="cash" className="mt-4">
                                      <p className="text-sm text-muted-foreground">
                                        Оплата при получении
                                      </p>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                                <div className="pt-4 border-t">
                                  <div className="flex justify-between mb-4">
                                    <span className="text-lg font-semibold">Итого:</span>
                                    <span className="text-lg font-semibold">{cartTotal + 500} ₽</span>
                                  </div>
                                  <Button className="w-full" size="lg">
                                    Подтвердить заказ
                                  </Button>
                                </div>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

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
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="gap-2">
                Смотреть каталог
                <Icon name="ArrowRight" size={18} />
              </Button>
              <Button size="lg" variant="outline">
                Акции
              </Button>
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
              {filteredProducts.map((product) => (
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Icon name="MessageSquare" size={16} />
                            Отзывы
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Отзывы о {product.name}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-4 pr-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Icon key={i} name="Star" size={14} className="fill-primary text-primary" />
                                      ))}
                                    </div>
                                    <span className="font-semibold">Анна К.</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Отличное качество! Альбом пришёл в идеальном состоянии, все фотокарточки на месте.
                                  </p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex gap-1">
                                      {[...Array(4)].map((_, i) => (
                                        <Icon key={i} name="Star" size={14} className="fill-primary text-primary" />
                                      ))}
                                      <Icon name="Star" size={14} className="text-muted" />
                                    </div>
                                    <span className="font-semibold">Мария Л.</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Очень красивый дизайн, быстрая доставка. Рекомендую!
                                  </p>
                                </CardContent>
                              </Card>
                              <div className="space-y-2 pt-4 border-t">
                                <Label>Оставить отзыв</Label>
                                <Textarea placeholder="Поделитесь впечатлениями о товаре" rows={3} />
                                <Button className="w-full">Отправить</Button>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
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
