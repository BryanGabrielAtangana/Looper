import LooperLogo from "@/public/logos/looper.png";
import Image from "next/image";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <Image src={LooperLogo} alt="looper logo" className="w-[75%]" />
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Strengthen your CV with{" "}
        <Link href="/sign-in" className="font-bold hover:underline">
          AI-powered insights
        </Link>{" "}
        and optimize your job search with{" "}
        <Link href="/sign-in" className="font-bold hover:underline">
          smart job orientation
        </Link>{" "}
      </p>
      <HeaderAuth />
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
