"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSettings } from "@/hooks/use-expenses";
import { formatBRL, formatUSD } from "@/lib/utils";

type Direction = "USD_TO_BRL" | "BRL_TO_USD";

export function CurrencyConverter() {
  const { data: settings } = useSettings();
  const exchangeRate = settings?.exchangeRate ?? 5.4;

  const [direction, setDirection] = useState<Direction>("USD_TO_BRL");
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<number>(0);

  // Load last amount from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("currencyConverterAmount");
    if (stored) {
      setAmount(stored);
    }
  }, []);

  // Calculate conversion
  const calculate = useCallback((value: string, dir: Direction, rate: number) => {
    const num = parseFloat(value) || 0;
    if (dir === "USD_TO_BRL") {
      return num * rate;
    } else {
      return num / rate;
    }
  }, []);

  // Update result when inputs change
  useEffect(() => {
    setResult(calculate(amount, direction, exchangeRate));
    if (amount) {
      localStorage.setItem("currencyConverterAmount", amount);
    }
  }, [amount, direction, exchangeRate, calculate]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === "USD_TO_BRL" ? "BRL_TO_USD" : "USD_TO_BRL"));
  };

  const fromCurrency = direction === "USD_TO_BRL" ? "USD" : "BRL";
  const toCurrency = direction === "USD_TO_BRL" ? "BRL" : "USD";
  const fromSymbol = direction === "USD_TO_BRL" ? "$" : "R$";
  const formatResult = direction === "USD_TO_BRL" ? formatBRL : formatUSD;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Currency converter">
          <DollarSign className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Currency Converter</h4>
            <span className="text-xs text-muted-foreground">
              1 USD = {exchangeRate.toFixed(2)} BRL
            </span>
          </div>

          <div className="space-y-3">
            {/* Input Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs">
                {fromCurrency}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {fromSymbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleDirection}
                className="h-8 gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Swap
              </Button>
            </div>

            {/* Result */}
            <div className="space-y-1.5">
              <Label className="text-xs">{toCurrency}</Label>
              <div className="p-3 bg-muted rounded-md text-center">
                <span className="text-lg font-semibold">
                  {formatResult(result)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-1.5 flex-wrap">
            {[10, 50, 100, 500].map((val) => (
              <Button
                key={val}
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 text-xs flex-1"
                onClick={() => setAmount(val.toString())}
              >
                {fromSymbol}{val}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
