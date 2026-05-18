import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your KenaKata account and view your orders.",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
