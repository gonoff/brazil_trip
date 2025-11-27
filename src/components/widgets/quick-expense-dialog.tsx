"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExpenseCategories, useCreateExpense } from "@/hooks/use-expenses";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const quickExpenseSchema = z.object({
  amountBrl: z.string().min(1, "Amount is required"),
  categoryId: z.number().min(1, "Category is required"),
  description: z.string().optional(),
});

type QuickExpenseFormValues = z.infer<typeof quickExpenseSchema>;

interface QuickExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickExpenseDialog({ open, onOpenChange }: QuickExpenseDialogProps) {
  const { data: categories, isLoading: categoriesLoading } = useExpenseCategories();
  const createExpense = useCreateExpense();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuickExpenseFormValues>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: {
      amountBrl: "",
      categoryId: 0,
      description: "",
    },
  });

  const handleFormSubmit = async (data: QuickExpenseFormValues) => {
    await createExpense.mutateAsync({
      date: format(new Date(), "yyyy-MM-dd"),
      amountBrl: parseFloat(data.amountBrl),
      categoryId: data.categoryId,
      description: data.description,
    });
    reset();
    setSelectedCategory(null);
    onOpenChange(false);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setValue("categoryId", categoryId);
  };

  const handleClose = () => {
    reset();
    setSelectedCategory(null);
    onOpenChange(false);
  };

  // Quick amount buttons
  const quickAmounts = [10, 25, 50, 100, 200, 500];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
        </DialogHeader>

        {categoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Category quick select */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-3 gap-2">
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors",
                      selectedCategory === category.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: category.colorHex || "#666" }}
                    />
                    <span className="text-xs font-medium truncate w-full text-center">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.categoryId && (
                <p className="text-sm text-destructive">Please select a category</p>
              )}
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <Label htmlFor="amountBrl">Amount (R$)</Label>
              <Input
                id="amountBrl"
                type="number"
                step="0.01"
                {...register("amountBrl")}
                placeholder="0.00"
                className="text-lg"
              />
              {errors.amountBrl && (
                <p className="text-sm text-destructive">{errors.amountBrl.message}</p>
              )}
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-1.5">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() => setValue("amountBrl", amount.toString())}
                >
                  R${amount}
                </Button>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Note (optional)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="What was this for?"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createExpense.isPending}
              >
                {createExpense.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
