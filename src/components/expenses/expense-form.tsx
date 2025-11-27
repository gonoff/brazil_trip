"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense, ExpenseCategory } from "@/types";
import { format } from "date-fns";
import { formatUTCDate } from "@/lib/utils";

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amountBrl: z.string().min(1, "Amount is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExpenseFormValues) => Promise<void>;
  expense?: Expense | null;
  categories: ExpenseCategory[];
  isLoading?: boolean;
}

export function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  expense,
  categories,
  isLoading,
}: ExpenseFormProps) {
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          date: formatUTCDate(expense.date, "yyyy-MM-dd"),
          amountBrl: expense.amountBrl.toString(),
          categoryId: expense.categoryId.toString(),
          description: expense.description || "",
        }
      : {
          date: format(new Date(), "yyyy-MM-dd"),
          amountBrl: "",
          categoryId: "",
          description: "",
        },
  });

  const categoryId = watch("categoryId");

  // Reset form when expense prop changes (for editing)
  useEffect(() => {
    if (expense) {
      reset({
        date: formatUTCDate(expense.date, "yyyy-MM-dd"),
        amountBrl: expense.amountBrl.toString(),
        categoryId: expense.categoryId.toString(),
        description: expense.description || "",
      });
    } else {
      reset({
        date: format(new Date(), "yyyy-MM-dd"),
        amountBrl: "",
        categoryId: "",
        description: "",
      });
    }
  }, [expense, reset]);

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountBrl">Amount (R$)</Label>
              <Input
                id="amountBrl"
                type="number"
                step="0.01"
                {...register("amountBrl")}
                placeholder="0.00"
              />
              {errors.amountBrl && (
                <p className="text-sm text-destructive">{errors.amountBrl.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.colorHex || "#666" }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="What was this expense for?"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
