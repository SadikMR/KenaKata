export default function OrderConfirmationLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4" />
        <div className="h-8 w-48 bg-muted rounded mx-auto mb-2" />
        <div className="h-4 w-64 bg-muted rounded mx-auto" />
      </div>
    </div>
  )
}
