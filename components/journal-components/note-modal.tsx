import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: string
  symbol: string
}

export function NoteModal({ isOpen, onClose, note, symbol }: NoteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trade Note for {symbol}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4 p-4 bg-muted rounded-md">{note}</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
