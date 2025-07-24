import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main
      className={cn(
        "relative h-screen w-screen flex flex-col items-center justify-center text-white",
        poppins.className
      )}
    >
      <div
        className="fixed inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/background.jpg')" }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6 text-center">
        <h1 className="text-4xl font-bold">Auth</h1>
        <p className="text-lg">A Simple authentication service</p>
        <div>
          <Button variant='secondary' size='lg'> Sign in</Button>
        </div>
      </div>
    </main>
  );
}
