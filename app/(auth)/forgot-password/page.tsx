import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="mb-2">
            <Image
              src="/logo.png"
              alt="RoofStar Industries Logo"
              width={180}
              height={90}
              priority
              className="h-auto w-auto"
            />
          </Link>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
