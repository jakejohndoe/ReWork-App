import ErrorBoundaryWrapper from '@/components/error-boundary'

export default function ResumeEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper>
}