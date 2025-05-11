"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format, parseISO } from "date-fns"
import { updateTrade } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface EditTradeModalProps {
  isOpen: boolean
  onClose: () => void
  trade: Trade | null
  onTradeUpdated: () => void
}

export function EditTradeModal({ isOpen, onClose, trade, onTradeUpdated }: EditTradeModalProps) {
  const [formData, setFormData] = useState<Partial<Trade>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize form data when trade changes
  useEffect(() => {
    if (trade) {
      setFormData({
        ...trade,
        // Format date for the date input
        date: trade.date ? format(parseISO(trade.date), "yyyy-MM-dd") : "",
        // Format expiry for the date input if it exists
        expiry: trade.expiry ? format(parseISO(trade.expiry), "yyyy-MM-dd") : "",
      })
    }
  }, [trade])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Handle number inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? null : Number(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const calculateProfitLoss = () => {
    if (formData.entry_price && formData.exit_price && formData.quantity && formData.type) {
      const entryPrice = Number(formData.entry_price)
      const exitPrice = Number(formData.exit_price)
      const quantity = Number(formData.quantity)

      // For long trades: (exit - entry) * quantity
      // For short trades: (entry - exit) * quantity
      const profitLoss =
        formData.type === "Long" ? (exitPrice - entryPrice) * quantity : (entryPrice - exitPrice) * quantity

      setFormData({
        ...formData,
        profit_loss: profitLoss,
      })
    }
  }

  // Recalculate profit/loss when relevant fields change
  useEffect(() => {
    calculateProfitLoss()
  }, [formData.entry_price, formData.exit_price, formData.quantity, formData.type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trade || !trade.id) return

    setIsSubmitting(true)

    try {
      // Prepare the data for submission
      const submissionData = {
        id: trade.id,
        ...formData,
        // Ensure numeric fields are numbers
        entry_price: formData.entry_price ? Number(formData.entry_price) : null,
        exit_price: formData.exit_price ? Number(formData.exit_price) : null,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        profit_loss: formData.profit_loss ? Number(formData.profit_loss) : null,
        stop_loss: formData.stop_loss ? Number(formData.stop_loss) : null,
      }

      const result = await updateTrade(submissionData)

      if (result.success) {
        toast({
          title: "Trade updated",
          description: "The trade has been successfully updated.",
        })
        onTradeUpdated()
        onClose()
      } else {
        toast({
          title: "Error updating trade",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating trade:", error)
      toast({
        title: "Error updating trade",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const showExpiryField = ["Future", "Option", "Commodity"].includes(formData.trade_type || "")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
          <DialogDescription>Update the details of your trade. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Date and Symbol in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={formData.symbol || ""}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Type and Trade in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="trade_type">Type</Label>
                <Select
                  name="trade_type"
                  value={formData.trade_type || "Equity"}
                  onValueChange={(value) => handleSelectChange("trade_type", value)}
                >
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
              <div className="space-y-2">
                <Label htmlFor="type">Trade</Label>
                <Select
                  name="type"
                  value={formData.type || "Long"}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
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

            {/* Expiry and Strategy in one row - only show expiry for certain trade types */}
            {showExpiryField ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    type="date"
                    value={formData.expiry || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Input
                    id="strategy"
                    name="strategy"
                    value={formData.strategy || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Input
                    id="strategy"
                    name="strategy"
                    value={formData.strategy || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div></div>
              </div>
            )}

            {/* Entry and Quantity in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="entry_price">Entry Price</Label>
                <Input
                  id="entry_price"
                  name="entry_price"
                  type="number"
                  step="0.01"
                  value={formData.entry_price || ""}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity || ""}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Exit and Stop Loss in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="exit_price">Exit Price</Label>
                <Input
                  id="exit_price"
                  name="exit_price"
                  type="number"
                  step="0.01"
                  value={formData.exit_price || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop_loss">Stop Loss</Label>
                <Input
                  id="stop_loss"
                  name="stop_loss"
                  type="number"
                  step="0.01"
                  value={formData.stop_loss || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Profit/Loss (calculated and read-only) */}
            <div className="space-y-2">
              <Label htmlFor="profit_loss">Profit/Loss (Calculated)</Label>
              <Input
                id="profit_loss"
                name="profit_loss"
                type="number"
                step="0.01"
                value={formData.profit_loss || ""}
                className="w-full bg-muted"
                readOnly
              />
            </div>

            {/* Note in its own row */}
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                placeholder="Add a note about this trade"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
