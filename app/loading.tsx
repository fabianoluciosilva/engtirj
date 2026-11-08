export default function Loading() {
  return (
    <div className="container-page flex min-h-[50vh] items-center justify-center py-20">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-accent" />
        Carregando…
      </div>
    </div>
  )
}
