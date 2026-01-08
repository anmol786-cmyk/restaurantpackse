'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  List,
  ShoppingCart,
  Trash2,
  Edit,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface ReorderList {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  totalValue: number;
  lastUsed: string;
  frequency: 'weekly' | 'monthly' | 'as-needed';
}

export function ReorderLists() {
  const [lists, setLists] = useState<ReorderList[]>([
    {
      id: '1',
      name: 'Weekly Stock',
      description: 'Regular weekly restocking items',
      itemCount: 12,
      totalValue: 5680,
      lastUsed: '2025-01-05',
      frequency: 'weekly',
    },
    {
      id: '2',
      name: 'Monthly Bulk Order',
      description: 'Large quantity items ordered monthly',
      itemCount: 25,
      totalValue: 18920,
      lastUsed: '2024-12-28',
      frequency: 'monthly',
    },
    {
      id: '3',
      name: 'Spice Essentials',
      description: 'Core spices and seasonings',
      itemCount: 8,
      totalValue: 2340,
      lastUsed: '2025-01-02',
      frequency: 'as-needed',
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    const newList: ReorderList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      itemCount: 0,
      totalValue: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      frequency: 'as-needed',
    };

    setLists([...lists, newList]);
    setNewListName('');
    setNewListDescription('');
    setIsCreating(false);
    toast.success(`Created list "${newListName}"`);
  };

  const handleReorderList = (list: ReorderList) => {
    // In production, fetch list items and add to cart
    toast.success(`Added ${list.itemCount} items from "${list.name}" to cart`);
  };

  const handleDeleteList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    setLists(lists.filter(l => l.id !== listId));
    toast.success(`Deleted list "${list?.name}"`);
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      'as-needed': 'bg-gray-100 text-gray-800',
    };
    return colors[frequency as keyof typeof colors] || colors['as-needed'];
  };

  if (lists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reorder Lists</CardTitle>
          <CardDescription>
            Create saved lists for quick reordering of frequently purchased items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reorder lists yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first list to quickly reorder your regular items.
            </p>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Reorder List</DialogTitle>
                  <DialogDescription>
                    Give your list a name and description to organize your regular orders.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Input
                      placeholder="List name (e.g., Weekly Stock)"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Description (optional)"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateList}>Create List</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reorder Lists</h2>
          <p className="text-muted-foreground">
            Quickly reorder your frequently purchased items
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reorder List</DialogTitle>
              <DialogDescription>
                Give your list a name and description to organize your regular orders.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Input
                  placeholder="List name (e.g., Weekly Stock)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card key={list.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{list.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {list.description || 'No description'}
                  </CardDescription>
                </div>
                <Badge className={getFrequencyBadge(list.frequency)}>
                  {list.frequency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{list.itemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Value</span>
                  <span className="font-medium">{list.totalValue.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Last used: {new Date(list.lastUsed).toLocaleDateString('sv-SE')}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleReorderList(list)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info('Edit feature coming soon')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
