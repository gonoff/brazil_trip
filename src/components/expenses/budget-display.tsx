"use client";

import { ExpenseCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBRL, convertToUSD, formatUSD } from "@/lib/utils";
import { getBudgetStatus, BUDGET_STATUS } from "@/lib/constants";
import { AlertTriangle, CheckCircle, XCircle, Settings } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface BudgetDisplayProps {
  categories: ExpenseCategory[];
  exchangeRate: number;
  onUpdateCategory: (id: number, budgetLimit: number) => Promise<void>;
}

export function BudgetDisplay({
  categories,
  exchangeRate,
  onUpdateCategory,
}: BudgetDisplayProps) {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [newLimit, setNewLimit] = useState("");

  const handleSaveLimit = async () => {
    if (!editingCategory) return;
    await onUpdateCategory(editingCategory.id, parseFloat(newLimit));
    setEditingCategory(null);
    setNewLimit("");
  };

  const totalBudget = categories.reduce(
    (sum, cat) => sum + (cat.budgetLimit || 0),
    0
  );
  const totalSpent = categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overallStatus = getBudgetStatus(totalSpent, totalBudget, 80);

  return (
    <div className="space-y-4">
      {/* Overall Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Overall Budget</span>
            {overallStatus === BUDGET_STATUS.EXCEEDED && (
              <Badge variant="destructive">Over Budget</Badge>
            )}
            {overallStatus === BUDGET_STATUS.WARNING && (
              <Badge className="bg-yellow-500">Warning</Badge>
            )}
            {overallStatus === BUDGET_STATUS.OK && (
              <Badge className="bg-green-600">On Track</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {formatBRL(totalSpent)} / {formatBRL(totalBudget)}
              </span>
              <span className="text-muted-foreground">
                ~{formatUSD(convertToUSD(totalSpent, exchangeRate))} /{" "}
                {formatUSD(convertToUSD(totalBudget, exchangeRate))}
              </span>
            </div>
            <Progress
              value={Math.min(totalPercentage, 100)}
              className={
                overallStatus === BUDGET_STATUS.EXCEEDED
                  ? "[&>div]:bg-destructive"
                  : overallStatus === BUDGET_STATUS.WARNING
                  ? "[&>div]:bg-yellow-500"
                  : ""
              }
            />
            <div className="text-sm text-muted-foreground">
              Remaining: {formatBRL(Math.max(totalBudget - totalSpent, 0))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Budget by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const spent = category.spent || 0;
            const limit = category.budgetLimit || 0;
            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
            const status = getBudgetStatus(
              spent,
              limit,
              category.warningThresholdPercent
            );

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.colorHex || "#666" }}
                    />
                    <span className="font-medium text-sm">{category.name}</span>
                    {status === BUDGET_STATUS.EXCEEDED && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    {status === BUDGET_STATUS.WARNING && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {status === BUDGET_STATUS.OK && limit > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatBRL(spent)} / {formatBRL(limit)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingCategory(category);
                        setNewLimit(limit.toString());
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={
                    status === BUDGET_STATUS.EXCEEDED
                      ? "[&>div]:bg-destructive"
                      : status === BUDGET_STATUS.WARNING
                      ? "[&>div]:bg-yellow-500"
                      : ""
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Edit Budget Limit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Budget Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: editingCategory?.colorHex || "#666",
                  }}
                />
                <span>{editingCategory?.name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetLimit">Budget Limit (R$)</Label>
              <Input
                id="budgetLimit"
                type="number"
                step="0.01"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Enter new limit"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLimit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
