"use client";

import { ExpenseCategory, AppSettings } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBRL, formatUSD } from "@/lib/utils";
import { getBudgetStatus, BUDGET_STATUS, TRIP_DATES } from "@/lib/constants";
import { Settings, Users, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface BudgetDisplayProps {
  categories: ExpenseCategory[];
  settings: AppSettings;
  onUpdateCategory: (id: number, dailyBudgetPerPerson: number) => Promise<void>;
  onUpdateSettings: (data: Partial<AppSettings>) => Promise<void>;
}

export function BudgetDisplay({
  categories,
  settings,
  onUpdateCategory,
  onUpdateSettings,
}: BudgetDisplayProps) {
  const [editingSettings, setEditingSettings] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [newDailyBudget, setNewDailyBudget] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    totalBudgetBrl: settings.totalBudgetBrl?.toString() || "",
    exchangeRate: settings.exchangeRate.toString(),
    numberOfTravelers: settings.numberOfTravelers.toString(),
  });

  const { exchangeRate, numberOfTravelers, totalBudgetBrl } = settings;

  const handleSaveSettings = async () => {
    await onUpdateSettings({
      totalBudgetBrl: settingsForm.totalBudgetBrl ? parseFloat(settingsForm.totalBudgetBrl) : null,
      exchangeRate: parseFloat(settingsForm.exchangeRate),
      numberOfTravelers: parseInt(settingsForm.numberOfTravelers, 10),
    });
    setEditingSettings(false);
  };

  const handleSaveDailyBudget = async () => {
    if (!editingCategory) return;
    await onUpdateCategory(editingCategory.id, parseFloat(newDailyBudget) || 0);
    setEditingCategory(null);
    setNewDailyBudget("");
  };

  const totalSpent = categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const totalBudget = totalBudgetBrl || 0;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overallStatus = totalBudget > 0 ? getBudgetStatus(totalSpent, totalBudget, 80) : BUDGET_STATUS.OK;

  return (
    <div className="space-y-4">
      {/* Settings Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Trip Settings
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSettingsForm({
                  totalBudgetBrl: settings.totalBudgetBrl?.toString() || "",
                  exchangeRate: settings.exchangeRate.toString(),
                  numberOfTravelers: settings.numberOfTravelers.toString(),
                });
                setEditingSettings(true);
              }}
            >
              Edit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Budget</div>
              <div className="font-medium">{formatBRL(totalBudget)}</div>
              <div className="text-xs text-muted-foreground">
                ~{formatUSD(totalBudget / exchangeRate)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Exchange Rate</div>
              <div className="font-medium">1 USD = {exchangeRate.toFixed(2)} BRL</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Travelers
              </div>
              <div className="font-medium">{numberOfTravelers} people</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Trip Dates
              </div>
              <div className="font-medium">{TRIP_DATES.totalDays} days</div>
              <div className="text-xs text-muted-foreground">
                {format(TRIP_DATES.start, "MMM d")} - {format(TRIP_DATES.end, "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Overall Budget</span>
            {totalBudget > 0 && (
              <>
                {overallStatus === BUDGET_STATUS.EXCEEDED && (
                  <Badge variant="destructive">Over Budget</Badge>
                )}
                {overallStatus === BUDGET_STATUS.WARNING && (
                  <Badge className="bg-[#C9A227] text-white">Warning</Badge>
                )}
                {overallStatus === BUDGET_STATUS.OK && (
                  <Badge className="bg-accent">On Track</Badge>
                )}
              </>
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
                ~{formatUSD(totalSpent / exchangeRate)} / {formatUSD(totalBudget / exchangeRate)}
              </span>
            </div>
            <Progress
              value={Math.min(totalPercentage, 100)}
              className={
                overallStatus === BUDGET_STATUS.EXCEEDED
                  ? "[&>div]:bg-destructive"
                  : overallStatus === BUDGET_STATUS.WARNING
                  ? "[&>div]:bg-[#C9A227]"
                  : ""
              }
            />
            <div className="text-sm text-muted-foreground">
              Remaining: {formatBRL(Math.max(totalBudget - totalSpent, 0))} (~{formatUSD(Math.max(totalBudget - totalSpent, 0) / exchangeRate)})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Budgets by Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Budgets by Category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set daily limits to get warnings when you overspend
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const spent = category.spent || 0;
            const dailyBudget = category.dailyBudgetPerPerson || 0;
            // Daily budget in BRL per person
            const dailyBudgetBrl = dailyBudget * exchangeRate;

            return (
              <div key={category.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.colorHex || "#666" }}
                  />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {dailyBudget > 0 ? `$${dailyBudget}/day/person` : "No limit"}
                    </div>
                    {dailyBudget > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {formatBRL(dailyBudgetBrl)}/day/person
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setNewDailyBudget(dailyBudget.toString());
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Spending by Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const spent = category.spent || 0;
            const percentage = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.colorHex || "#666" }}
                    />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatBRL(spent)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ~{formatUSD(spent / exchangeRate)} ({percentage.toFixed(1)}% of budget)
                    </div>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Edit Settings Dialog */}
      <Dialog open={editingSettings} onOpenChange={setEditingSettings}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Trip Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget (R$)</Label>
              <Input
                id="totalBudget"
                type="number"
                step="0.01"
                value={settingsForm.totalBudgetBrl}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, totalBudgetBrl: e.target.value }))}
                placeholder="Enter your total budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">Exchange Rate (BRL per USD)</Label>
              <Input
                id="exchangeRate"
                type="number"
                step="0.01"
                value={settingsForm.exchangeRate}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, exchangeRate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Input
                id="travelers"
                type="number"
                step="1"
                min="1"
                value={settingsForm.numberOfTravelers}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, numberOfTravelers: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingSettings(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Daily Budget Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Daily Budget</DialogTitle>
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
              <Label htmlFor="dailyBudget">Daily Budget per Person (USD)</Label>
              <Input
                id="dailyBudget"
                type="number"
                step="0.01"
                value={newDailyBudget}
                onChange={(e) => setNewDailyBudget(e.target.value)}
                placeholder="Enter daily budget (0 for no limit)"
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 to disable warnings for this category
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDailyBudget}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
