"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { NoteModal } from "@/components/journal-components/note-modal"
import { EditTradeModal } from "@/components/journal-components/edit-trade-modal"
import { DeleteConfirmationModal } from "@/components/journal-components/delete-confirmation-modal"
import { subDays, parseISO, isAfter, format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { deleteTrade } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"

type Trade = Database["public"]["Tables"]["journal"]["Row"]

interface TradeTableProps {
  trades: Trade[]
  showAll?: boolean
  onTradeUpdated?: () => void
}

export default function TradeTable({ trades, showAll = false, onTradeUpdated = () => {} }: TradeTableProps) {
  const [selectedNote, setSelectedNote] = useState<{ symbol: string; note: string } | null>(null)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number; symbol: string } | null>(null)
  const { toast } = useToast()

  const recentTrades = useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)

    return trades
      .filter((trade) => isAfter(parseISO(trade.date), sevenDaysAgo))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [trades])

  const displayedTrades = showAll ? trades : recentTrades

  const calculateTradeValue = (entryPrice: number, quantity: number) => {
    return entryPrice * quantity
  }

  const calculateROI = (entryPrice: number, exitPrice: number | null) => {
    if (!exitPrice) return 0
    return ((exitPrice - entryPrice) / entryPrice) * 100
  }

  const handleDeleteConfirm = (id: number, symbol: string) => {
    setDeleteConfirmation({ id, symbol })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null)
  }

  const handleDeleteTrade = async () => {
    if (!deleteConfirmation) return

    const id = deleteConfirmation.id
    setIsDeleting(id)
    setDeleteConfirmation(null)

    try {
      const result = await deleteTrade(id)
      if (result.success) {
        toast({
          title: "Trade deleted",
          description: "The trade has been successfully deleted.",
        })
        onTradeUpdated()
      } else {
        toast({
          title: "Error deleting trade",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting trade:", error)
      toast({
        title: "Error deleting trade",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div className="relative">
        {/* Fixed header table */}
        <div className="sticky-header-container border-b">
          <Table className=" bg-white dark:bg-[#1b1d20]">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky-header-cell w-[120px]">Date</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Symbol</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Type</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Trade</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Entry</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Exit</TableHead>
                <TableHead className="sticky-header-cell w-[80px]">Qty</TableHead>
                <TableHead className="sticky-header-cell w-[120px]">Capital</TableHead>
                <TableHead className="sticky-header-cell w-[120px]">P&L</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">ROI</TableHead>
                <TableHead className="sticky-header-cell w-[100px]">Note</TableHead>
                <TableHead className="sticky-header-cell w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[600px]">
          <Table >
            <TableBody >
              {displayedTrades.map((trade) => {
                const roi = calculateROI(trade.entry_price, trade.exit_price)
                return (
                  <TableRow key={trade.id}>
                    <TableCell className="w-[120px] whitespace-nowrap">
                      {format(parseISO(trade.date), "dd-MMM-yyyy")}
                    </TableCell>
                    <TableCell className="w-[100px]">{trade.symbol}</TableCell>
                    <TableCell className="w-[100px]">{trade.trade_type}</TableCell>
                    <TableCell className="w-[100px]">{trade.type}</TableCell>
                    <TableCell className="w-[100px]">₹{trade.entry_price.toFixed(2)}</TableCell>
                    <TableCell className="w-[100px]">₹{trade.exit_price?.toFixed(2) || "-"}</TableCell>
                    <TableCell className="w-[80px]">{trade.quantity}</TableCell>
                    <TableCell className="w-[120px]">
                      ₹{calculateTradeValue(trade.entry_price, trade.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <span
                        className={`px-2 py-1 rounded-md font-semibold ${
                          (trade.profit_loss || 0) >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        ₹{(trade.profit_loss || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <span
                        className={`px-2 py-1 rounded-md font-semibold ${
                          roi >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {roi.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {trade.note && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedNote({ symbol: trade.symbol, note: trade.note || "" })}
                        >
                          Note
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                          onClick={() => handleEditTrade(trade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteConfirm(trade.id, trade.symbol)}
                          disabled={isDeleting === trade.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedNote && (
        <NoteModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          note={selectedNote.note}
          symbol={selectedNote.symbol}
        />
      )}

      <EditTradeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        trade={selectedTrade}
        onTradeUpdated={onTradeUpdated}
      />

      {deleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirmation}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteTrade}
          symbol={deleteConfirmation.symbol}
        />
      )}
    </>
  )
}
