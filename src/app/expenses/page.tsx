"use client";

import { useState } from "react";
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useExpenseCategories,
  useUpdateExpenseCategory,
  useSettings,
  useUpdateSettings,
} from "@/hooks/use-expenses";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { BudgetDisplay } from "@/components/expenses/budget-display";
import { DailySpendingTracker } from "@/components/expenses/daily-spending-tracker";
import { ExpenseAnalytics } from "@/components/expenses/expense-analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Wallet, Edit, Trash2 } from "lucide-react";
import { Expense } from "@/types";
import { formatBRL, convertToUSD, formatUSD, formatUTCDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExpensesPage() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: categories, isLoading: categoriesLoading } = useExpenseCategories();
  const { data: settings } = useSettings();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const updateCategory = useUpdateExpenseCategory();
  const updateSettings = useUpdateSettings();

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const exchangeRate = settings?.exchangeRate ?? 5.4;

  const handleCreate = async (data: { date: string; amountBrl: string; categoryId: string; description?: string }) => {
    await createExpense.mutateAsync({
      date: data.date,
      amountBrl: parseFloat(data.amountBrl),
      categoryId: parseInt(data.categoryId, 10),
      description: data.description,
    });
  };

  const handleUpdate = async (data: { date: string; amountBrl: string; categoryId: string; description?: string }) => {
    if (!editingExpense) return;
    await updateExpense.mutateAsync({
      id: editingExpense.id,
      data: {
        date: data.date,
        amountBrl: parseFloat(data.amountBrl),
        categoryId: parseInt(data.categoryId, 10),
        description: data.description,
      },
    });
    setEditingExpense(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    await deleteExpense.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const handleUpdateCategory = async (id: number, dailyBudgetPerPerson: number) => {
    await updateCategory.mutateAsync({ id, data: { dailyBudgetPerPerson } });
  };

  const handleUpdateSettings = async (data: Partial<typeof settings>) => {
    await updateSettings.mutateAsync(data as Parameters<typeof updateSettings.mutateAsync>[0]);
  };

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amountBrl), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Track your spending • Total: {formatBRL(totalSpent)} (~{formatUSD(convertToUSD(totalSpent, exchangeRate))})
          </p>
        </div>

        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Expenses</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {expenses && expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: expense.category?.colorHex || "#666",
                          }}
                        >
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                              {formatBRL(Number(expense.amountBrl))}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              (~{formatUSD(convertToUSD(Number(expense.amountBrl), exchangeRate))})
                            </span>
                            <Badge variant="outline">
                              {expense.category?.name}
                            </Badge>
                          </div>
                          {expense.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {expense.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatUTCDate(expense.date, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 self-end sm:self-center shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingExpense(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No expenses yet</h3>
              <p className="text-muted-foreground mt-1">
                Start tracking your spending
              </p>
              <Button onClick={() => setFormOpen(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          {expenses && categories && settings && (
            <DailySpendingTracker
              expenses={expenses}
              categories={categories}
              settings={settings}
            />
          )}
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          {categories && settings && (
            <BudgetDisplay
              categories={categories}
              settings={settings}
              onUpdateCategory={handleUpdateCategory}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          {expenses && categories && settings && (
            <ExpenseAnalytics
              expenses={expenses}
              categories={categories}
              settings={settings}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Create form */}
      {categories && (
        <ExpenseForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleCreate}
          categories={categories}
          isLoading={createExpense.isPending}
        />
      )}

      {/* Edit form */}
      {categories && (
        <ExpenseForm
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSubmit={handleUpdate}
          expense={editingExpense}
          categories={categories}
          isLoading={updateExpense.isPending}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
