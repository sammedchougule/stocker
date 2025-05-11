"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addMonths } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addTrade } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

const indianStocks = [
  { value: "RELIANCE", label: "Reliance Industries" },
  { value: "TCS", label: "Tata Consultancy Services" },
  { value: "HDFCBANK", label: "HDFC Bank" },
  { value: "INFY", label: "Infosys" },
  { value: "HINDUNILVR", label: "Hindustan Unilever" },
  { value: "ICICIBANK", label: "ICICI Bank" },
  { value: "SBIN", label: "State Bank of India" },
  { value: "BHARTIARTL", label: "Bharti Airtel" },
  { value: "ITC", label: "ITC" },
  { value: "KOTAKBANK", label: "Kotak Mahindra Bank" },
]

interface AddTradeFormProps {
  onTradeAdded?: () => void
}

export default function AddTradeForm({ onTradeAdded = () => {} }: AddTradeFormProps) {
  const [open, setOpen] = useState(false)
  const [tradeType, setTradeType] = useState("Equity")
  const [ticker, setTicker] = useState("")
  const [tickerDropdownOpen, setTickerDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.set("ticker", ticker) // Add the ticker value

      const result = await addTrade(formData)

      if (result.success) {
        toast({
          title: "Trade added successfully",
          description: "Your trade has been recorded.",
        })
        setOpen(false)
        onTradeAdded() // Call the callback to refresh trades
      } else {
        toast({
          title: "Error adding trade",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error adding trade",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const showExpiryField = ["Future", "Option", "Commodity"].includes(tradeType)

  const currentDate = new Date()
  const expiryOptions = [
    format(currentDate, "MMM yyyy"),
    format(addMonths(currentDate, 1), "MMM yyyy"),
    format(addMonths(currentDate, 2), "MMM yyyy"),
  ]

  const strategies = [
    "Trend Following",
    "Mean Reversion",
    "Breakout",
    "Momentum",
    "Scalping",
    "Arbitrage",
    "Options Spread",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#151719] text-black dark:text-white max-w-[750px] w-[calc(100%-2rem)] max-h-[90vh] rounded-xl shadow-xl p-4 sm:p-6">
        <DialogHeader className="border-b pb-3 dark:border-gray-700">
          <DialogTitle className="text-lg font-semibold">Add New Trade</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Enter the details of your trade. Click save when done.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2 mt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date & Ticker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ticker">Ticker</Label>
                <Popover open={tickerDropdownOpen} onOpenChange={setTickerDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between", !ticker && "text-muted-foreground")}
                    >
                      {ticker
                        ? indianStocks.find((stock) => stock.value === ticker)?.label
                        : "Select stock..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search stock..." />
                      <CommandList>
                        <CommandEmpty>No stock found.</CommandEmpty>
                        <CommandGroup>
                          {indianStocks.map((stock) => (
                            <CommandItem
                              key={stock.value}
                              onSelect={() => {
                                setTicker(stock.value === ticker ? "" : stock.value)
                                setTickerDropdownOpen(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", ticker === stock.value ? "opacity-100" : "opacity-0")}
                              />
                              {stock.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Type & Trade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select name="type" onValueChange={setTradeType} defaultValue="Equity">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Future">Future</SelectItem>
                    <SelectItem value="Option">Option</SelectItem>
                    <SelectItem value="Commodity">Commodity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trade">Trade</Label>
                <Select name="trade" defaultValue="Long">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Long">Long</SelectItem>
                    <SelectItem value="Short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expiry & Strategy */}
            <div className="grid grid-cols-2 gap-4">
              {showExpiryField && (
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Select name="expiry">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      {expiryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className={showExpiryField ? "" : "col-span-2"}>
                <Label htmlFor="strategy">Strategy</Label>
                <Select name="strategy">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Entry & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry">Entry Price</Label>
                <Input id="entry" name="entry" type="number" step="0.01" className="w-full" required />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" className="w-full" required />
              </div>
            </div>

            {/* Exit & Stop Loss */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exit">Exit Price</Label>
                <Input id="exit" name="exit" type="number" step="0.01" className="w-full" required />
              </div>
              <div>
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input id="stopLoss" name="stopLoss" type="number" step="0.01" className="w-full" />
              </div>
            </div>

            {/* Note */}
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" name="note" placeholder="Add a note about this trade" className="w-full" />
            </div>

            {/* Submit */}
            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Trade"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>

  )
}
