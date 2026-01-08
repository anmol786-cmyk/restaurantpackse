'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/woocommerce';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Edit,
  Save,
  Share2,
  Plus,
  TrendingDown,
  X,
  List,
} from 'lucide-react';
import type { WishlistItem, WishlistPriority } from '@/store/wishlist-store';

export function WishlistPage() {
  const {
    items,
    lists,
    currentListId,
    setCurrentList,
    removeItem,
    updateItem,
    moveToCart,
    getItemsByList,
    getTotalItems,
    createList,
    deleteList,
    clearList,
    getShareUrl,
  } = useWishlistStore();

  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentList = lists.find((list) => list.id === currentListId);
  const currentItems = getItemsByList(currentListId);

  const handleMoveToCart = (item: WishlistItem) => {
    moveToCart(item.id, (product, variation) => {
      addToCart(product, 1, variation);
    });
  };

  const handleEditNotes = (item: WishlistItem) => {
    setEditingNotes(item.id);
    setNotesText(item.notes || '');
  };

  const handleSaveNotes = (itemId: string) => {
    updateItem(itemId, { notes: notesText });
    setEditingNotes(null);
  };

  const handlePriorityChange = (itemId: string, priority: WishlistPriority) => {
    updateItem(itemId, { priority });
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim(), newListDescription.trim());
      setNewListName('');
      setNewListDescription('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleShare = async () => {
    if (currentList) {
      const shareUrl = getShareUrl(currentListId);
      if (navigator.share) {
        try {
          await navigator.share({
            title: currentList.name,
            text: `Check out my wishlist: ${currentList.name}`,
            url: shareUrl,
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    }
  };

  const getPriorityColor = (priority: WishlistPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPriceChange = (item: WishlistItem) => {
    if (item.currentPrice < item.originalPrice) {
      const percentageChange =
        ((item.originalPrice - item.currentPrice) / item.originalPrice) * 100;
      return percentageChange.toFixed(0);
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your favorite items and shopping lists
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wishlist</DialogTitle>
              <DialogDescription>
                Create a new wishlist to organize your favorite items
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">List Name</label>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Birthday Wishlist"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="mt-1"
                />
              </div>
              <Button onClick={handleCreateList} className="w-full">
                Create List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List Selector */}
      {lists.length > 1 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Select List:</label>
          <Select value={currentListId} onValueChange={setCurrentList}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.name} ({getTotalItems(list.id)} items)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Current List Info */}
      {currentList && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-current text-red-500" />
                  {currentList.name}
                </CardTitle>
                {currentList.description && (
                  <CardDescription className="mt-1">
                    {currentList.description}
                  </CardDescription>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {getTotalItems(currentListId)} {getTotalItems(currentListId) === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {!currentList.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(`Are you sure you want to delete "${currentList.name}"?`)
                      ) {
                        deleteList(currentListId);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete List
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to clear all items from "${currentList.name}"?`
                      )
                    ) {
                      clearList(currentListId);
                    }
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Items Grid */}
      {currentItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start adding items to your wishlist!
            </p>
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {currentItems.map((item) => {
            const priceChange = getPriceChange(item);

            return (
              <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative">
                  {/* Priority Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className={`${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                  </div>

                  {/* Product Image */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block relative aspect-square overflow-hidden bg-muted/20"
                  >
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {priceChange && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-green-500 px-2 py-1 text-sm font-bold text-white">
                        <TrendingDown className="h-4 w-4" />
                        {priceChange}% OFF
                      </div>
                    )}
                  </Link>
                </div>

                <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Product Info */}
                  <div>
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-semibold line-clamp-2 hover:underline">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(item.currentPrice, 'SEK')}
                      </p>
                      {priceChange && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.originalPrice, 'SEK')}
                        </p>
                      )}
                    </div>
                    {item.variation && (
                      <p className="text-sm text-muted-foreground">
                        {item.variation.attributes.map((attr) => attr.option).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  {editingNotes === item.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Add a note..."
                        className="h-20 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveNotes(item.id)}
                          className="flex-1"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingNotes(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          "{item.notes}"
                        </p>
                      )}
                    </>
                  )}

                  {/* Priority Selector */}
                  <div className="mt-auto">
                    <Select
                      value={item.priority}
                      onValueChange={(value: WishlistPriority) =>
                        handlePriorityChange(item.id, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNotes(item)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {item.notes ? 'Edit Note' : 'Add Note'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
