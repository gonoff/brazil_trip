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
} from "@/hooks/use-expenses";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { BudgetDisplay } from "@/components/expenses/budget-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Wallet, Edit, Trash2 } from "lucide-react";
import { Expense, ExpenseFormData } from "@/types";
import { format } from "date-fns";
import { formatBRL, convertToUSD, formatUSD } from "@/lib/utils";
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

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const exchangeRate = settings?.exchangeRate ? Number(settings.exchangeRate) : 5.4;

  const handleCreate = async (data: ExpenseFormData) => {
    await createExpense.mutateAsync(data);
  };

  const handleUpdate = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    await updateExpense.mutateAsync({ id: editingExpense.id, data });
    setEditingExpense(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    await deleteExpense.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const handleUpdateCategory = async (id: number, budgetLimit: number) => {
    await updateCategory.mutateAsync({ id, data: { budgetLimit } });
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
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {expenses && expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: expense.category?.colorHex || "#666",
                          }}
                        >
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
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
                            <p className="text-sm text-muted-foreground">
                              {expense.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
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

        <TabsContent value="budget" className="mt-4">
          {categories && (
            <BudgetDisplay
              categories={categories}
              exchangeRate={exchangeRate}
              onUpdateCategory={handleUpdateCategory}
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
