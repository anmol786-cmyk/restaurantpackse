'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReorderListsStore, type ReorderList } from '@/store/reorder-lists-store';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Trash2,
  ShoppingCart,
  Edit2,
  Package,
  ListPlus,
  Loader2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function ReorderLists() {
  const { lists, createList, updateList, deleteList, removeItemFromList, updateItemQuantity } =
    useReorderListsStore();
  const { addItemFromLineItem } = useCartStore();
  const { format: formatCurrency } = useCurrency();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<ReorderList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  const toggleListExpanded = (listId: string) => {
    const newExpanded = new Set(expandedLists);
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId);
    } else {
      newExpanded.add(listId);
    }
    setExpandedLists(newExpanded);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    createList(newListName.trim(), newListDescription.trim() || undefined);
    toast.success(`Created list "${newListName}"`);
    setNewListName('');
    setNewListDescription('');
    setIsCreateDialogOpen(false);
  };

  const handleEditList = () => {
    if (!editingList || !newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    updateList(editingList.id, {
      name: newListName.trim(),
      description: newListDescription.trim() || undefined,
    });
    toast.success('List updated');
    setEditingList(null);
    setNewListName('');
    setNewListDescription('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteList = (list: ReorderList) => {
    deleteList(list.id);
    toast.success(`Deleted list "${list.name}"`);
  };

  const handleAddAllToCart = async (list: ReorderList) => {
    if (list.items.length === 0) {
      toast.error('This list is empty');
      return;
    }

    setIsAddingToCart(list.id);

    try {
      for (const item of list.items) {
        addItemFromLineItem({
          product_id: item.productId,
          name: item.productName,
          price: item.price.toString(),
          quantity: item.defaultQuantity,
          image: item.productImage ? { src: item.productImage } : undefined,
        });
      }

      toast.success(`Added ${list.items.length} item(s) from "${list.name}" to cart`);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      toast.error('Failed to add items to cart');
    } finally {
      setIsAddingToCart(null);
    }
  };

  const openEditDialog = (list: ReorderList) => {
    setEditingList(list);
    setNewListName(list.name);
    setNewListDescription(list.description || '');
    setIsEditDialogOpen(true);
  };

  const calculateListTotal = (list: ReorderList) => {
    return list.items.reduce((total, item) => total + item.price * item.defaultQuantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ListPlus className="h-5 w-5" />
            Reorder Lists
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Save your frequently ordered products for quick reordering
          </p>
        </div>

        {/* Create New List Button */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reorder List</DialogTitle>
              <DialogDescription>
                Create a list to save products you frequently order together.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="list-name">List Name *</Label>
                <Input
                  id="list-name"
                  placeholder="e.g., Weekly Stock, Kitchen Essentials"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-description">Description (optional)</Label>
                <Input
                  id="list-description"
                  placeholder="e.g., Items we order every Monday"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lists */}
      {lists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No reorder lists yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Create lists to save products you frequently order. You can then add all items to
                your cart with one click.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First List
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => {
            const isExpanded = expandedLists.has(list.id);
            const listTotal = calculateListTotal(list);

            return (
              <Card key={list.id} className="overflow-hidden">
                {/* List Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleListExpanded(list.id)}
                >
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{list.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {list.items.length} items
                        </Badge>
                      </div>
                      {list.description && (
                        <p className="text-sm text-muted-foreground">{list.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-sm font-medium text-muted-foreground mr-2">
                      {formatCurrency(listTotal)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleAddAllToCart(list)}
                      disabled={list.items.length === 0 || isAddingToCart === list.id}
                    >
                      {isAddingToCart === list.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      Add All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(list)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete List</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{list.name}&quot;? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteList(list)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* List Items (Expanded) */}
                {isExpanded && (
                  <CardContent className="pt-0 border-t">
                    {list.items.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">This list is empty</p>
                        <p className="text-xs mt-1">
                          Browse products and click &quot;Add to List&quot; to add items
                        </p>
                        <Button asChild variant="link" size="sm" className="mt-2">
                          <Link href="/shop">Browse Products</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-4">
                        {list.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                          >
                            {/* Product Image */}
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-white border flex-shrink-0">
                              {item.productImage ? (
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/product/${item.productSlug}`}
                                className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} each
                              </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateItemQuantity(list.id, item.productId, item.defaultQuantity - 1)
                                }
                                disabled={item.defaultQuantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.defaultQuantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateItemQuantity(list.id, item.productId, item.defaultQuantity + 1)
                                }
                              >
                                +
                              </Button>
                            </div>

                            {/* Line Total */}
                            <div className="text-right min-w-[80px]">
                              <p className="font-semibold text-sm">
                                {formatCurrency(item.price * item.defaultQuantity)}
                              </p>
                            </div>

                            {/* Remove */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItemFromList(list.id, item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {/* List Summary */}
                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <span className="text-sm text-muted-foreground">
                            Last updated: {format(new Date(list.updatedAt), 'MMM dd, yyyy')}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">List Total</p>
                            <p className="text-lg font-bold text-primary">
                              {formatCurrency(listTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit List Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
            <DialogDescription>Update the name and description of your list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-list-name">List Name *</Label>
              <Input
                id="edit-list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-list-description">Description (optional)</Label>
              <Input
                id="edit-list-description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
